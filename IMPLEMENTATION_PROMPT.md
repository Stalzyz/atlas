# Atlas Enterprise — Implementation Prompt
> Generated after full codebase analysis · June 2026

---

## CODEBASE OVERVIEW

This is a **Turborepo monorepo** with three apps:

| App | Stack | Path |
|-----|-------|------|
| `storefront` | Next.js 14 (App Router, RSC + Client) | `apps/storefront/src/` |
| `admin` | Next.js 14 (Client-heavy) | `apps/admin/src/` |
| `api` | NestJS + Prisma | `apps/api/src/` |
| `database` | Prisma schema | `packages/database/prisma/schema.prisma` |

API base URL: `https://atlasapi.grekam.in/api/v1`  
Storefront URL: `https://atlas.grekam.in`

---

## WHAT IS ALREADY IMPLEMENTED (do not rebuild these)

- ✅ Meta Pixel init in `apps/storefront/src/components/analytics/MetaPixel.tsx` — PageView fires on route change
- ✅ AddToCart pixel event in `apps/storefront/src/context/CartContext.tsx`
- ✅ InitiateCheckout pixel event in `apps/storefront/src/components/cart/CartDrawer.tsx`
- ✅ CAPI purchase sync in `apps/api/src/marketing/marketing.service.ts` (lines ~438–497)
- ✅ Facebook XML feed endpoint at `GET /marketing/facebook-feed.xml` — `generateFacebookXmlFeed()` already returns id, title, description, link, image_link, brand, condition, availability, price, sale_price, item_group_id
- ✅ Collection page sorting (newest / price_asc / price_desc) in `apps/storefront/src/app/collections/[handle]/page.tsx`
- ✅ Collection page pagination controls (useState-based, lines ~288–337)
- ✅ Desktop header dropdown with children in `apps/storefront/src/components/layout/Header.tsx` (lines ~77–94)
- ✅ Product image zoom modal in `apps/storefront/src/components/products/ProductGallery.tsx`
- ✅ Packing slip modal component at `apps/admin/src/components/modals/PackingSlipModal.tsx`
- ✅ Sequential `formattedOrderNumber` in orders service — does not reset on cancellation
- ✅ CSV export function in `apps/admin/src/app/orders/page.tsx` (`handleExportCSV`, lines ~157–300)
- ✅ Multi-collection relationship exists in Prisma schema (products ↔ collections many-to-many)

---

## REQUIREMENTS TO IMPLEMENT

---

### 1. BACKUP PLAN

**Status: 0% implemented — nothing exists**

#### 1A. Database Backup Script
Create `/scripts/backup-db.sh`:
```bash
#!/bin/bash
# Runs mysqldump (or pg_dump) every 6 hours via cron
# Saves to /backups/db/YYYY-MM-DD_HH-MM-SS.sql.gz
# Keeps: last 4 × 6h files (daily), 7 daily, 4 weekly, 3 monthly
# On failure: sends email/webhook to admin
# Appends result to /backups/logs/backup.log with timestamp
```

#### 1B. File Backup Script
Create `/scripts/backup-files.sh`:
```bash
# Tarballs: product images, banners, customer uploads, invoices, assets
# Source directories to back up: (check .env for UPLOAD_DIR)
# Destination: /backups/files/YYYY-MM-DD_HH-MM-SS.tar.gz
# Same retention as DB (daily/weekly/monthly)
```

#### 1C. Cron Setup
Add to server crontab:
```
0 */6 * * * /scripts/backup-db.sh >> /backups/logs/backup.log 2>&1
0 2 * * * /scripts/backup-files.sh >> /backups/logs/backup.log 2>&1
```

#### 1D. Admin Failure Notification
In both scripts: if backup fails, POST to the existing NestJS notification endpoint OR send email via the mail service at `apps/api/src/mail/`. The admin email is already configured in settings.

#### 1E. Backup Admin UI (optional, lower priority)
Add a "Backups" section under `/settings` in the admin app that:
- Lists backup log entries (read from the log file via an API endpoint)
- Shows last successful backup timestamp
- Has a "Download Latest Backup" button

#### 1F. Restoration Runbook
Create `/docs/RESTORATION.md` documenting step-by-step recovery for: Orders, Customers, Products, Inventory, Content, Media.

---

### 2. ORDER MANAGEMENT PANEL

#### 2A. Exclude Cancelled from Default View
**File:** `apps/admin/src/app/orders/page.tsx`

Current: `activeTab` defaults to `"ALL"` which includes CANCELLED orders.

**Change:**
- Default `activeTab` to `"ACTIVE"` (a new virtual tab)
- When `activeTab === "ACTIVE"`, send `excludeStatus=CANCELLED` as a query param to the API (or filter client-side: `orders.filter(o => o.status !== 'CANCELLED')`)
- Tabs: `["ACTIVE", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]`
- Rename the "ALL" tab label to "Active Orders" (excludes cancelled)
- The "CANCELLED" tab shows only cancelled orders (already works via status filter)

**API side** (`apps/api/src/orders/orders.service.ts`): add support for `excludeStatus` query param in `findAll()`:
```typescript
if (excludeStatus) {
  where.status = { not: excludeStatus };
}
```

#### 2B. CSV Export — Add Missing Columns
**File:** `apps/admin/src/app/orders/page.tsx`, function `handleExportCSV` (line ~164)

The CSV already has most fields but column header names differ from requirements. Ensure these exact columns exist with these exact header names:

| Required Header | Current Field Mapping |
|---|---|
| Order Number | Already mapped as `#${formattedOrderNumber}` → rename header from "Name" to "Order Number" |
| Order Date | "Created at" → rename to "Order Date" |
| Customer Name | "Billing Name" → add explicit "Customer Name" column using `o.customerName` or `o.customer?.name` |
| Customer Phone Number | "Phone" → rename to "Customer Phone Number" |
| Payment Status | "Financial Status" → rename to "Payment Status" |
| Payment Reference ID | "Payment Reference" → rename to "Payment Reference ID" |
| **NEW** Product Name | "Lineitem name" → keep, rename header to "Product Name" |
| **NEW** Quantity | "Lineitem quantity" → keep, rename to "Quantity" |
| **NEW** Unit Price | "Lineitem price" → keep, rename to "Unit Price" |
| **NEW** Order Value | "Total" → keep, rename to "Order Value" |
| **NEW** Shipping Charges | "Shipping" → keep, rename to "Shipping Charges" |
| **NEW** Tax Value | "Taxes" → keep, rename to "Tax Value" |

Produce one row per line item (the current code already does `ordersToExport.forEach` iterating line items — confirm this logic at ~line 196).

#### 2C. Packing Slip — Wire into Orders Page
**File:** `apps/admin/src/app/orders/page.tsx`

The `PackingSlipModal` already exists at `apps/admin/src/components/modals/PackingSlipModal.tsx` but is not imported in the orders page. 

**Add:**
```tsx
import { PackingSlipModal } from "@/components/modals/PackingSlipModal";

// State
const [packingSlipOrders, setPackingSlipOrders] = useState<any[]>([]);
const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);
```

**Single order:** Add "Print Packing Slip" to the `MoreVertical` dropdown on each order row — calls `setPackingSlipOrders([order])` then `setIsPackingSlipOpen(true)`.

**Bulk print:** Add "Print Packing Slips" to the bulk action bar (shown when `selectedIds.length > 0`) — sets `packingSlipOrders` to the filtered selected orders.

---

### 3. PRODUCT LISTING & COLLECTION PAGES

#### 3A. Pagination Persistence (Back Button)
**Problem:** All paginated pages use `useState` for page number — back button resets to page 1.

**Solution:** Replace `useState` page tracking with URL search params.

**Files to update:**

**`apps/storefront/src/app/collections/[handle]/page.tsx`**
```tsx
// Replace:
const [page, setPage] = useState(1);

// With:
"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();
const page = Number(searchParams.get("page") || "1");

const setPage = (newPage: number) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(newPage));
  router.push(`${pathname}?${params.toString()}`, { scroll: false });
};
```
Also persist `sort`, `selectedTags`, `selectedSizes`, `minPrice`, `maxPrice` in URL params.

**`apps/storefront/src/app/search/page.tsx`** — apply same URL param pattern for `page`.

**`apps/admin/src/app/products/page.tsx`** — apply URL param pattern (or localStorage fallback) for page.

**`apps/admin/src/app/products/import/page.tsx`** — apply same.

**`apps/admin/src/app/orders/page.tsx`** — persist `activeTab` and current page in URL or localStorage so back button returns to the same tab/page.

**`apps/admin/src/app/customers/page.tsx`** — apply URL param pattern for page.

#### 3B. Add Alphabetical Sort Option
**File:** `apps/storefront/src/app/collections/[handle]/page.tsx` (line ~256)

```tsx
<option value="alphabetical">A → Z</option>
```

**API side** (`apps/api/src/products/products.service.ts`): Handle `sort=alphabetical`:
```typescript
case 'alphabetical':
  orderBy = { title: 'asc' };
  break;
```

---

### 4. MENU NAVIGATION

#### 4A. Mobile Accordion Menu
**File:** `apps/storefront/src/components/layout/MobileNav.tsx`

Currently has no support for `item.children`. The desktop `Header.tsx` already handles children via hover dropdown. MobileNav needs an accordion:

```tsx
// For each menu item that has children:
const [openItem, setOpenItem] = useState<string | null>(null);

// Render:
{item.children?.length > 0 ? (
  <>
    <button onClick={() => setOpenItem(openItem === item.id ? null : item.id)}>
      {item.label}
      <ChevronDown className={openItem === item.id ? "rotate-180" : ""} />
    </button>
    {openItem === item.id && (
      <div className="pl-4 border-l border-theme-border">
        {item.children.map(child => (
          <Link key={child.id} href={child.url}>{child.label}</Link>
        ))}
      </div>
    )}
  </>
) : (
  <Link href={item.url}>{item.label}</Link>
)}
```

#### 4B. Breadcrumb Navigation
**Status: Only exists in cart. Missing on collection and product pages.**

Create `apps/storefront/src/components/layout/Breadcrumb.tsx`:
```tsx
// Props: items: Array<{ label: string, href?: string }>
// Renders: Home → Collection → Product
// Use JSON-LD BreadcrumbList for SEO
```

**Add to:**
- `apps/storefront/src/app/collections/[handle]/page.tsx` → `Home → Collections → {collection.title}`
- `apps/storefront/src/app/products/[handle]/page.tsx` → `Home → {collection.title} → {product.title}`

---

### 5. HOMEPAGE IMPROVEMENTS

#### 5A. Image Zoom Already Implemented
`ProductGallery.tsx` already has a zoom modal — no action needed.

#### 5B. Layout Audit Checklist
**File:** `apps/storefront/src/app/page.tsx` and all section components in `apps/storefront/src/components/sections/`

Review and fix:
- Equal spacing between sections: ensure consistent `py-16 md:py-24` on each `<section>`
- CTA buttons ("Shop Now", "View Collection", "Buy Now"): standardize to a shared `<CTAButton>` component
- Image dimensions: add `aspect-ratio` constraints on all collection/product card images
- Responsive: test breakpoints at 375px, 768px, 1280px
- Broken links: audit all `href` values on CTA buttons — replace any `#`, `undefined`, or empty strings
- Console errors: run `next build` and check output
- No overlapping content: check z-index on sticky header vs hero section

---

### 6. PRODUCT CREATION — MULTI-COLLECTION WITH COUNT

#### 6A. Multi-Collection Selector in Product Edit
**File:** `apps/admin/src/app/products/[id]/page.tsx`

Current state: collections are shown as a single `<select>` for "Category/Type" (line ~398). This is NOT the actual many-to-many collection assignment.

**Change:**
1. Load the product's current collection assignments:
```typescript
// In useEffect / fetchProduct:
const collectionRes = await fetch(`${apiBase}/products/${id}/collections`, { headers });
const assignedCollections = await collectionRes.json(); // Array of { id, title }
```

2. Replace the single-select with a multi-select checkbox list or tag-picker:
```tsx
// Show all collections as checkboxes
// Pre-check the ones already assigned
// Label: "Collections (X selected)"
// When X > 0, show: "3 Collections" badge next to the label
```

3. On save, call `PATCH /products/:id` or `PUT /products/:id/collections` with the selected collection IDs.

**File:** `apps/admin/src/app/products/new/page.tsx`

Add the same multi-collection field to the new product form (currently it has no collections field at all).

**API side** (`apps/api/src/products/products.service.ts` and `products.controller.ts`):
- Ensure `GET /products/:id/collections` returns the product's assigned collections
- Ensure `PATCH /products/:id` (or a dedicated endpoint) accepts `collectionIds: string[]` and syncs the many-to-many

#### 6B. Show Collection Count Badge
In both new/edit product pages, next to the collections field label, display:
```tsx
<label>
  Collections
  {selectedCollectionIds.length > 0 && (
    <span className="ml-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
      {selectedCollectionIds.length}
    </span>
  )}
</label>
```

---

### 7. META / FACEBOOK INTEGRATION

#### 7A. Missing Pixel Events

**ViewContent — Product Detail Page**
**File:** `apps/storefront/src/app/products/[handle]/page.tsx`

Add in a `useEffect` after product loads (client component):
```tsx
import { trackMetaEvent } from "@/components/analytics/MetaPixel";

useEffect(() => {
  if (product) {
    trackMetaEvent("ViewContent", {
      content_ids: [selectedVariant?.id || product.variants[0]?.id],
      content_name: product.title,
      content_type: "product",
      currency: "INR",
      value: selectedVariant?.price || product.variants[0]?.price,
    });
  }
}, [product?.id, selectedVariant?.id]);
```

**Purchase Event — Checkout Confirmation**
**File:** `apps/storefront/src/app/checkout/page.tsx`

After order confirmation (look for the "Purchase Confirmed" section, line ~594), add:
```tsx
trackMetaEvent("Purchase", {
  content_ids: order.items.map((i: any) => i.variantId),
  content_type: "product",
  currency: "INR",
  value: order.totalAmount,
  num_items: order.items.length,
});
```

**LinkClick Event**
**File:** `apps/storefront/src/components/analytics/MetaPixel.tsx`

Add a global click listener for outbound links or important CTAs:
```tsx
useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a");
    if (target && target.href && !target.href.startsWith(window.location.origin)) {
      trackMetaEvent("Lead", { content_name: target.innerText });
    }
  };
  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, []);
```

#### 7B. Event Deduplication (event_id)
**Problem:** Pixel fires client-side AND CAPI fires server-side for Purchase — Meta sees duplicates without matching `event_id`.

**Fix — Storefront side:**
Generate a UUID for each event and pass it to both the pixel and the API:
```tsx
// In CartContext, checkout, etc.:
const eventId = crypto.randomUUID();

// Pixel:
(window as any).fbq("track", "Purchase", eventData, { eventID: eventId });

// API call (include in request body):
fetch("/api/orders", { body: JSON.stringify({ ...orderData, metaEventId: eventId }) });
```

**Fix — API side** (`apps/api/src/marketing/marketing.service.ts`, function `sendMetaCAPIEvent` or similar):
```typescript
// In the CAPI payload, include:
event_id: payload.metaEventId, // the same UUID from the client
```

This tells Meta these are the same event — it deduplicates automatically.

#### 7C. Verify content_ids Match Catalog
In `CartContext.tsx` (AddToCart), `content_ids` uses `newItem.id`.
In `CartDrawer.tsx` (InitiateCheckout), verify it sends variant IDs, not product IDs.
In the catalog feed, `<g:id>` = `variant.id`.

Ensure ALL pixel events use `variantId` (not `productId`) as `content_ids[0]` to match the catalog's `<g:id>`.

---

### 8. FACEBOOK CATALOG FEED

#### 8A. Add Missing Required Fields
**File:** `apps/api/src/marketing/marketing.service.ts`, function `generateFacebookXmlFeed()` (line ~587)

Current feed is missing these required Meta catalog fields. Update the `itemsXml` generation:

```typescript
// Add to product query includes:
include: {
  variants: true,
  images: { orderBy: { position: 'asc' } }, // ALL images, not just take:1
  collections: { include: { collection: true } },
}

// In the item XML, add:
<g:sku>${variant.sku || variant.id}</g:sku>
<g:quantity>${variant.inventory}</g:quantity>
<g:google_product_category>Apparel &amp; Accessories &gt; Clothing</g:google_product_category>

// Additional images (all beyond the first):
${p.images.slice(1).map(img => `<g:additional_image_link>${this.escapeXml(img.url)}</g:additional_image_link>`).join('\n')}
```

Also fix the price field — Meta requires the **actual selling price** as `<g:price>` and MRP (if higher) as `<g:sale_price>`. Currently the code swaps them. Correct:
```typescript
// g:price = MRP (was: basePrice = variant.mrp || variant.price) ← WRONG
// g:sale_price = actual price (when discount exists) ← keep
// Correct:
const regularPrice = variant.mrp && Number(variant.mrp) > Number(variant.price) ? variant.mrp : variant.price;
const salePrice = variant.mrp && Number(variant.mrp) > Number(variant.price) ? variant.price : null;
```

#### 8B. Ensure Feed is Publicly Accessible
The `@Public()` decorator is already on the route — confirm no auth middleware blocks it.
Test: `curl -I https://atlasapi.grekam.in/api/v1/marketing/facebook-feed.xml` should return `200 OK`.

#### 8C. Auto-Refresh / Cache
Add response header for Meta's crawler:
```typescript
@Header('Cache-Control', 'public, max-age=3600') // 1 hour
@Header('Content-Type', 'application/xml')
```

For daily refresh, add a scheduled NestJS task (`@Cron`) that regenerates and caches the feed:
```typescript
// apps/api/src/marketing/marketing.service.ts
@Cron('0 3 * * *') // 3am daily
async refreshFacebookFeed() {
  const xml = await this.generateFacebookXmlFeed();
  this.cachedFeed = xml;
  this.cachedFeedAt = new Date();
}
```
Store in memory (`this.cachedFeed`) and serve from cache in `getFacebookFeed()`.

#### 8D. Inventory Sync
Inventory is already pulled live from `variant.inventory` at feed-generation time. With the caching above, it refreshes every hour at minimum (cache-control) and regenerates nightly. No additional sync needed unless real-time is required — if so, invalidate `cachedFeed` whenever a variant's inventory changes in `products.service.ts`.

---

## IMPLEMENTATION PRIORITY ORDER

| Priority | Requirement | Effort |
|----------|-------------|--------|
| 1 | 2A — Exclude cancelled from default order view | Low |
| 2 | 2B — CSV column headers rename | Low |
| 3 | 2C — Packing slip on Orders page | Low |
| 4 | 6A/6B — Multi-collection selector + count badge | Medium |
| 5 | 3A — Pagination persistence (URL params) | Medium |
| 6 | 3B — Alphabetical sort option | Low |
| 7 | 4B — Breadcrumb on collection/product pages | Low |
| 8 | 4A — Mobile accordion menu | Low |
| 9 | 7A — Missing pixel events (ViewContent, Purchase) | Medium |
| 10 | 7B — Event deduplication with event_id | Medium |
| 11 | 7C — Verify content_ids = variant IDs | Low |
| 12 | 8A — Catalog feed missing fields (sku, qty, category, images) | Medium |
| 13 | 8B/8C/8D — Feed caching + refresh | Low |
| 14 | 5B — Homepage layout audit | Medium |
| 15 | 1 — Full backup system | High |

---

## KEY FILE MAP

```
apps/admin/src/app/orders/page.tsx              → 2A, 2B, 2C, 3A
apps/admin/src/app/products/[id]/page.tsx       → 6A, 6B
apps/admin/src/app/products/new/page.tsx        → 6A, 6B
apps/admin/src/app/customers/page.tsx           → 3A
apps/storefront/src/app/collections/[handle]/page.tsx → 3A, 3B
apps/storefront/src/app/search/page.tsx         → 3A
apps/storefront/src/app/products/[handle]/page.tsx    → 7A (ViewContent)
apps/storefront/src/app/checkout/page.tsx       → 7A (Purchase), 7B
apps/storefront/src/components/analytics/MetaPixel.tsx → 7A (LinkClick), 7B
apps/storefront/src/components/layout/MobileNav.tsx   → 4A
apps/storefront/src/components/layout/Header.tsx      → 4B (Breadcrumb)
apps/storefront/src/context/CartContext.tsx     → 7B, 7C
apps/api/src/orders/orders.service.ts           → 2A
apps/api/src/products/products.service.ts       → 3B, 6A
apps/api/src/marketing/marketing.service.ts     → 7B, 8A, 8B, 8C, 8D
scripts/backup-db.sh                            → 1A
scripts/backup-files.sh                         → 1B
```
