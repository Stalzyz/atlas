# Restoration Runbook

Step-by-step recovery procedures for the Raaghas Enterprise platform.

---

## Before You Begin

1. **Verify the incident** — confirm data is actually lost or corrupted before restoring. Accidental restoration overwrites good data.
2. **Identify the backup to use** — check `/backups/logs/backup.log` for the last `SUCCESS` entry before the incident.
3. **Take a safety snapshot** — before touching anything, dump the current (broken) state:
   ```bash
   pg_dump -U raaghas_user -h localhost raaghas | gzip > /tmp/pre-restore-snapshot.sql.gz
   ```
4. **Announce downtime** — notify the team; put the storefront in maintenance mode if possible.

---

## 1. Full Database Restoration

Restores the entire PostgreSQL database from a `.sql.gz` backup.

```bash
# 1. Choose the backup file
BACKUP_FILE=/backups/db/2024-01-15_06-00-00.sql.gz

# 2. Drop and recreate the database (requires postgres superuser)
psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'raaghas';"
psql -U postgres -c "DROP DATABASE IF EXISTS raaghas;"
psql -U postgres -c "CREATE DATABASE raaghas OWNER raaghas_user;"

# 3. Restore
zcat "${BACKUP_FILE}" | psql -U raaghas_user -h localhost raaghas

# 4. Verify
psql -U raaghas_user -h localhost raaghas -c "SELECT COUNT(*) FROM \"Order\";"
psql -U raaghas_user -h localhost raaghas -c "SELECT COUNT(*) FROM \"Product\";"
```

**After restore:** Restart the API server so Prisma reconnects cleanly.

---

## 2. Orders

To recover a specific order or date range without a full restore:

```bash
# Extract just the Order table from the backup
BACKUP_FILE=/backups/db/2024-01-15_06-00-00.sql.gz
WORK_DIR=/tmp/order-restore
mkdir -p "${WORK_DIR}"

# Decompress and grep for Order inserts
zcat "${BACKUP_FILE}" | grep -A 1 'COPY public."Order"' > "${WORK_DIR}/orders.sql"

# Or restore to a temp database and query selectively
psql -U postgres -c "CREATE DATABASE raaghas_restore OWNER raaghas_user;"
zcat "${BACKUP_FILE}" | psql -U raaghas_user -h localhost raaghas_restore

# Find and copy specific orders
psql -U raaghas_user -h localhost raaghas_restore \
  -c "SELECT * FROM \"Order\" WHERE \"createdAt\" >= '2024-01-14' AND \"createdAt\" < '2024-01-15';" \
  > "${WORK_DIR}/orders_to_restore.csv"

# Manually re-insert or compare with current data
# Clean up temp db when done
psql -U postgres -c "DROP DATABASE raaghas_restore;"
```

---

## 3. Customers

```bash
# Same selective restore pattern as Orders
# Key tables: User, Address, WalletTransaction, LoyaltyTransaction, Referral

psql -U raaghas_user -h localhost raaghas_restore \
  -c "SELECT id, name, email, phone, \"createdAt\" FROM \"User\" WHERE \"createdAt\" >= '2024-01-14';"

# To restore a single customer's wallet balance:
psql -U raaghas_user -h localhost raaghas \
  -c "UPDATE \"User\" SET \"walletBalance\" = 500 WHERE id = 'cuid-here';"
```

---

## 4. Products & Inventory

```bash
# Key tables: Product, ProductVariant, ProductImage, Collection, CollectionProduct
# Inventory: InventoryItem, StockMovement

# Restore from temp db
psql -U raaghas_user -h localhost raaghas_restore \
  -c "\COPY (SELECT * FROM \"Product\") TO '/tmp/products.csv' CSV HEADER;"

# Check current vs backup inventory
psql -U raaghas_user -h localhost raaghas_restore \
  -c "SELECT p.name, i.quantity FROM \"InventoryItem\" i JOIN \"ProductVariant\" v ON i.\"variantId\" = v.id JOIN \"Product\" p ON v.\"productId\" = p.id ORDER BY p.name;"
```

---

## 5. Content (CMS / Pages / Navigation)

```bash
# Key tables: Page, NavigationItem, BannerSlide, ThemePreset, SiteContent

psql -U raaghas_user -h localhost raaghas_restore \
  -c "SELECT slug, title, \"updatedAt\" FROM \"Page\" ORDER BY \"updatedAt\" DESC;"

# To restore a single page from backup:
psql -U raaghas_user -h localhost raaghas_restore \
  -c "SELECT * FROM \"Page\" WHERE slug = 'about-us';" | \
  psql -U raaghas_user -h localhost raaghas  # pipe result as INSERT manually
```

---

## 6. Media / File Restoration

Restores uploaded images, banners, and assets from a `.tar.gz` file backup.

```bash
BACKUP_FILE=/backups/files/2024-01-15_02-00-00.tar.gz
UPLOAD_DIR=/var/www/raaghas/apps/api/uploads

# 1. Move current uploads out of the way
mv "${UPLOAD_DIR}" "${UPLOAD_DIR}.broken-$(date +%s)"

# 2. Extract backup
mkdir -p "${UPLOAD_DIR}"
tar -xzf "${BACKUP_FILE}" -C / --strip-components=0

# 3. Fix permissions
chown -R www-data:www-data "${UPLOAD_DIR}"
chmod -R 755 "${UPLOAD_DIR}"

# 4. Verify spot-check
ls -lh "${UPLOAD_DIR}/products/" | head -20
```

---

## 7. Invoices

Invoices are PDF files stored in the database as references plus in the uploads directory.

```bash
# Recover invoice records from DB backup
psql -U raaghas_user -h localhost raaghas_restore \
  -c "SELECT id, \"invoiceNumber\", \"buyerEmail\", \"createdAt\" FROM \"Invoice\" ORDER BY \"createdAt\" DESC LIMIT 50;"

# Recover PDF files — they are in the uploads/invoices/ subdirectory
# Restore file backup first (Section 6), then verify:
ls /var/www/raaghas/apps/api/uploads/invoices/ | head -20
```

---

## Post-Restoration Checklist

- [ ] Database connection is healthy (`GET /api/health`)
- [ ] Spot-check orders: latest 5 orders visible in admin
- [ ] Spot-check products: images load on storefront
- [ ] Test a checkout flow end-to-end (sandbox payment)
- [ ] Confirm email delivery (send a test invoice)
- [ ] Verify backup cron jobs are still scheduled (`crontab -l`)
- [ ] Update the incident log with: what happened, which backup was used, what data was lost

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| Admin email | Configured in Store Settings (`supportEmail`) |
| Database | `localhost:5432` — `raaghas_user` |
| API Server | `http://localhost:6005` |
| Backup logs | `/backups/logs/backup.log` |
