#!/bin/bash
# Database backup script for Raaghas Enterprise (PostgreSQL)
# Schedule: every 6 hours via cron: 0 */6 * * * /scripts/backup-db.sh >> /backups/logs/backup.log 2>&1
# Retention: last 4 x 6h files | 7 daily | 4 weekly | 3 monthly

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/.env.backup" 2>/dev/null || true

DB_URL="${DATABASE_URL:-postgresql://raaghas_user:Raaghas%40Prod2024@localhost:5432/raaghas}"
BACKUP_DIR="${BACKUP_DIR:-/backups/db}"
LOG_FILE="${LOG_FILE:-/backups/logs/backup.log}"
API_URL="${API_URL:-http://localhost:6005}"
API_SECRET="${BACKUP_API_SECRET:-}"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DATESTAMP=$(date +"%Y-%m-%d")
WEEK=$(date +"%Y-W%V")
MONTH=$(date +"%Y-%m")
BACKUP_FILE="${BACKUP_DIR}/${TIMESTAMP}.sql.gz"

# ── Helpers ──────────────────────────────────────────────────────────────────
log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] [backup-db] $*" | tee -a "${LOG_FILE}"; }

notify_failure() {
  local reason="$1"
  log "ERROR: ${reason}"
  curl -s -X POST "${API_URL}/backup/notify" \
    -H "Content-Type: application/json" \
    -H "x-backup-secret: ${API_SECRET}" \
    -d "{\"type\":\"db\",\"status\":\"failed\",\"reason\":$(echo -n "${reason}" | python3 -c 'import sys,json;print(json.dumps(sys.stdin.read()))')}" \
    --max-time 10 || true
}

# ── Setup ────────────────────────────────────────────────────────────────────
mkdir -p "${BACKUP_DIR}" "$(dirname "${LOG_FILE}")"

log "Starting database backup → ${BACKUP_FILE}"

# ── Extract pg_dump credentials from DATABASE_URL ────────────────────────────
# URL format: postgresql://user:pass@host:port/dbname
if [[ "${DB_URL}" =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
  PG_USER="${BASH_REMATCH[1]}"
  PG_PASS="${BASH_REMATCH[2]}"
  PG_HOST="${BASH_REMATCH[3]}"
  PG_PORT="${BASH_REMATCH[4]}"
  PG_DB="${BASH_REMATCH[5]}"
  # URL-decode password (replace %40 → @, etc.)
  PG_PASS=$(python3 -c "import urllib.parse, sys; print(urllib.parse.unquote(sys.argv[1]))" "${PG_PASS}")
else
  notify_failure "Could not parse DATABASE_URL"
  exit 1
fi

# ── Run pg_dump ───────────────────────────────────────────────────────────────
export PGPASSWORD="${PG_PASS}"
if ! pg_dump \
  --host="${PG_HOST}" \
  --port="${PG_PORT}" \
  --username="${PG_USER}" \
  --dbname="${PG_DB}" \
  --format=plain \
  --no-password \
  2>/tmp/pg_dump_err.txt \
  | gzip -9 > "${BACKUP_FILE}.tmp"; then
  ERR=$(cat /tmp/pg_dump_err.txt)
  rm -f "${BACKUP_FILE}.tmp"
  notify_failure "pg_dump failed: ${ERR}"
  exit 1
fi
unset PGPASSWORD

mv "${BACKUP_FILE}.tmp" "${BACKUP_FILE}"
SIZE=$(du -sh "${BACKUP_FILE}" | cut -f1)
log "SUCCESS: ${BACKUP_FILE} (${SIZE})"

# ── Retention ─────────────────────────────────────────────────────────────────
# Rule: keep last 4 files (covers 24h at 6h interval)
#       1 file per calendar-day for past 7 days
#       1 file per week for past 4 weeks
#       1 file per month for past 3 months
# Strategy: tag oldest-per-period to protect, then delete unprotected files older than 24h

prune_backups() {
  local dir="$1"
  local files
  mapfile -t files < <(ls -1t "${dir}"/*.sql.gz 2>/dev/null)
  local total=${#files[@]}

  # Always keep the 4 most recent
  local keep=()
  for i in "${!files[@]}"; do
    [[ $i -lt 4 ]] && keep+=("${files[$i]}")
  done

  # Gather one-per-day for last 7 days
  declare -A daily_seen
  for f in "${files[@]}"; do
    local fname
    fname=$(basename "$f")
    local fdate="${fname:0:10}"
    local fage=$(( ( $(date +%s) - $(date -d "${fdate}" +%s 2>/dev/null || echo 0) ) / 86400 ))
    if [[ $fage -le 7 && -z "${daily_seen[$fdate]:-}" ]]; then
      daily_seen["$fdate"]="$f"
      keep+=("$f")
    fi
  done

  # Gather one-per-week for last 4 weeks
  declare -A weekly_seen
  for f in "${files[@]}"; do
    local fname
    fname=$(basename "$f")
    local fdate="${fname:0:10}"
    local fweek
    fweek=$(date -d "${fdate}" +"%Y-W%V" 2>/dev/null || echo "unknown")
    local fage=$(( ( $(date +%s) - $(date -d "${fdate}" +%s 2>/dev/null || echo 0) ) / 86400 ))
    if [[ $fage -le 28 && -z "${weekly_seen[$fweek]:-}" ]]; then
      weekly_seen["$fweek"]="$f"
      keep+=("$f")
    fi
  done

  # Gather one-per-month for last 3 months
  declare -A monthly_seen
  for f in "${files[@]}"; do
    local fname
    fname=$(basename "$f")
    local fdate="${fname:0:10}"
    local fmonth="${fdate:0:7}"
    local fage=$(( ( $(date +%s) - $(date -d "${fdate}" +%s 2>/dev/null || echo 0) ) / 86400 ))
    if [[ $fage -le 92 && -z "${monthly_seen[$fmonth]:-}" ]]; then
      monthly_seen["$fmonth"]="$f"
      keep+=("$f")
    fi
  done

  # Delete anything not in keep set that is older than 24h
  for f in "${files[@]}"; do
    local in_keep=false
    for k in "${keep[@]}"; do
      [[ "$f" == "$k" ]] && in_keep=true && break
    done
    if [[ "$in_keep" == false ]]; then
      local fage_hours=$(( ( $(date +%s) - $(stat -c %Y "$f") ) / 3600 ))
      if [[ $fage_hours -ge 24 ]]; then
        log "Pruning old backup: $(basename "$f")"
        rm -f "$f"
      fi
    fi
  done
}

prune_backups "${BACKUP_DIR}"

# ── Notify success ────────────────────────────────────────────────────────────
curl -s -X POST "${API_URL}/backup/notify" \
  -H "Content-Type: application/json" \
  -H "x-backup-secret: ${API_SECRET}" \
  -d "{\"type\":\"db\",\"status\":\"success\",\"file\":\"${TIMESTAMP}.sql.gz\",\"size\":\"${SIZE}\"}" \
  --max-time 10 || true

log "Database backup complete."
