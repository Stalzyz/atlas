#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  ATLAS — MASTER DEPLOYMENT SCRIPT v9.0 (rsync — no more timeouts)
#  Uses rsync to only transfer CHANGED files — skips node_modules entirely.
#  Remote runs npm install + prisma + pm2 restart on the VPS side.
# ═══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

VPS_IP="72.61.231.187"
REMOTE_DIR="/var/www/atlas_new"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=30"

echo "💎 ATLAS MASTER DEPLOYMENT v9.0 (rsync mode)"
echo "════════════════════════════════════════════════"

# ── 1. LOCAL BUILD ─────────────────────────────────────────────────────────────
echo "🏗️  Building locally..."
# npm install --legacy-peer-deps --quiet
# ⚠️  CRITICAL: Only build the 3 app packages — NEVER include @atlas/database
# The database package is a library (Prisma client wrapper), not a runnable service.
# Passing --force without --filter causes npm to propagate start:prod to ALL workspaces.
npx turbo build --filter=atlas-api --filter=admin --filter=storefront
echo "✅ Local build complete"

# ── 2. RSYNC (only changed files, no node_modules, no .git, no cache) ─────────
echo ""
echo "🚀 Syncing changed files to VPS via rsync..."
echo "   (Only uploads what changed — no 683M zip, no timeout)"
rsync -az --progress \
  --exclude='node_modules' \
  --exclude='**/node_modules' \
  --exclude='.git' \
  --exclude='**/.git' \
  --exclude='.turbo' \
  --exclude='**/.turbo' \
  --exclude='**/.next/cache' \
  --exclude='uploads' \
  --exclude='**/uploads' \
  --exclude='*.log' \
  --exclude='*.zip' \
  --exclude='*.tar.gz' \
  --exclude='scratch' \
  --exclude='playwright-report' \
  --exclude='certification-suite' \
  -e "ssh $SSH_OPTS" \
  . \
  root@$VPS_IP:$REMOTE_DIR/

echo "✅ Files synced"

# ── 3. REMOTE ACTIVATION ───────────────────────────────────────────────────────
echo ""
echo "🛠️  Running remote activation..."
ssh $SSH_OPTS root@$VPS_IP << 'REMOTE_SCRIPT'
  set -euo pipefail
  cd /var/www/atlas_new

  # ── Sync production .env (single source of truth) ────────────────────────────
  cp apps/api/.env.production apps/api/.env
  echo "✅ .env synced from .env.production"

  # ── Install Linux-native dependencies ────────────────────────────────────────
  echo "📦 Installing Linux dependencies..."
  npm install --legacy-peer-deps --quiet

  # ── Force correct Prisma version with Linux binary targets ───────────────────
  echo "🗄️  Installing Prisma with Linux engine targets..."
  rm -rf node_modules/.bin node_modules/@prisma node_modules/prisma
  npm install prisma@6.7.0 @prisma/client@6.7.0 --save-exact --legacy-peer-deps --quiet

  # ── Generate Prisma client for Linux ─────────────────────────────────────────
  echo "🗄️  Generating Prisma client..."
  DATABASE_URL=$(grep '^DATABASE_URL=' apps/api/.env | cut -d'=' -f2-) \
    ./node_modules/.bin/prisma generate --schema=packages/database/prisma/schema.prisma

  # ── Run database migrations ───────────────────────────────────────────────────
  echo "🗄️  Running database push..."
  DATABASE_URL=$(grep '^DATABASE_URL=' apps/api/.env | cut -d'=' -f2-) \
    ./node_modules/.bin/prisma db push --schema=packages/database/prisma/schema.prisma --accept-data-loss

  echo "📦 Baselining migration history..."

  # ── Ensure shared uploads symlink is intact ───────────────────────────────────
  echo "📁 Verifying shared uploads directory..."
  mkdir -p /var/www/atlas_new/shared/uploads
  chmod -R 775 /var/www/atlas_new/shared/uploads
  chown -R root:www-data /var/www/atlas_new/shared/uploads

  # Re-create the symlink inside each app's dist if it was overwritten by rsync
  for app_dir in apps/api apps/storefront apps/admin; do
    if [ -d "$app_dir" ] && [ ! -L "$app_dir/uploads" ]; then
      echo "  🔗 Re-linking uploads for $app_dir..."
      rm -rf "$app_dir/uploads"
      ln -sfn /var/www/atlas_new/shared/uploads "$app_dir/uploads"
    fi
  done
  echo "✅ Uploads directory verified"

  # ── Prepare Next.js Standalone Static Files ───────────────────────────────────
  echo "📦 Syncing static files to standalone directories..."
  for app_dir in apps/storefront apps/admin; do
    if [ -d "$app_dir/.next/standalone" ]; then
      mkdir -p "$app_dir/.next/standalone/$app_dir/.next"
      rsync -a "$app_dir/.next/static/" "$app_dir/.next/standalone/$app_dir/.next/static/"
      if [ -d "$app_dir/public" ]; then
        # ⚠️  CRITICAL: Exclude 'uploads' symlink from standalone public/
        # The uploads symlink points to shared/uploads which creates an ELOOP
        # (infinite symlink loop) crash when Next.js statically serves the folder.
        # Uploaded files are served via /api/uploads — not from standalone public/.
        rm -f "$app_dir/.next/standalone/$app_dir/public/uploads"
        rsync -a --exclude='uploads' "$app_dir/public/" "$app_dir/.next/standalone/$app_dir/public/"
      fi
    fi
  done

  # ── Restart all PM2 services (Zero Downtime) ──────────────────────────────────
  echo "🚀 Reloading PM2 services for zero downtime..."
  
  # API
  if pm2 describe atlas-api > /dev/null 2>&1; then
    NODE_ENV=production PORT=6005 pm2 reload atlas-api --update-env
  else
    NODE_ENV=production PORT=6005 pm2 start apps/api/dist/src/main.js --name atlas-api --node-args="--max-old-space-size=512"
  fi

  # Admin
  if pm2 describe atlas-admin > /dev/null 2>&1; then
    NODE_ENV=production PORT=6010 pm2 reload atlas-admin --update-env
  else
    NODE_ENV=production PORT=6010 pm2 start apps/admin/.next/standalone/apps/admin/server.js --name atlas-admin --node-args="--max-old-space-size=512"
  fi

  # Storefront
  if pm2 describe atlas-storefront > /dev/null 2>&1; then
    NODE_ENV=production PORT=6009 pm2 reload atlas-storefront --update-env
  else
    NODE_ENV=production PORT=6009 pm2 start apps/storefront/.next/standalone/apps/storefront/server.js --name atlas-storefront --node-args="--max-old-space-size=512"
  fi

  pm2 save
  echo "✅ PM2 services running:"
  pm2 status

  # ── Deploy Nginx config ───────────────────────────────────────────────────────
  echo "🌐 Deploying Nginx configuration..."
  cp /var/www/atlas_new/atlas_nginx.conf /etc/nginx/sites-available/atlas
  # Remove stale duplicate symlinks that cause limit_req_zone conflicts
  rm -f /etc/nginx/sites-enabled/atlas.conf /etc/nginx/sites-enabled/admin.grekam.in
  ln -sf /etc/nginx/sites-available/atlas /etc/nginx/sites-enabled/atlas
  nginx -t && systemctl reload nginx && echo "✅ Nginx reloaded" || echo "⚠️  Nginx reload failed — check: nginx -t"

  # ── Health check ─────────────────────────────────────────────────────────────
  echo "🔍 Health check in 5 seconds..."
  sleep 5
  nginx -t
  curl -sf http://localhost:6005/api/v1/health && echo "✅ API HEALTHY" || echo "❌ API HEALTH CHECK FAILED — check: pm2 logs atlas-api --lines 30"

  echo ""
  echo "🏁 ═══════════════════════════════════════════════════════"
  echo "   DEPLOYMENT COMPLETE"
  echo "   Storefront : https://atlas.grekam.in"
  echo "   Admin      : https://admin.grekam.in"
  echo "   API Health : https://api.grekam.in/api/v1/health"
  echo "═══════════════════════════════════════════════════════════"
REMOTE_SCRIPT
