#!/bin/bash
# File backup script for Raaghas Enterprise (uploads / media)
# Schedule: daily at 2 AM via cron: 0 2 * * * /scripts/backup-files.sh >> /backups/logs/backup.log 2>&1
# Retention: last 4 files | 7 daily | 4 weekly | 3 monthly

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/.env.backup" 2>/dev/null || true

# Source directories — UPLOAD_DIR from env, fallback to api/uploads
UPLOAD_DIR="${UPLOAD_DIR:-/var/www/raaghas/apps/api/uploads}"
EXTRA_DIRS="${EXTRA_BACKUP_DIRS:-}"  # space-separated extra dirs

BACKUP_DIR="${BACKUP_DIR:-/backups/files}"
LOG_FILE="${LOG_FILE:-/backups/logs/backup.log}"
API_URL="${API_URL:-http://localhost:6005}"
API_SECRET="${BACKUP_API_SECRET:-}"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/${TIMESTAMP}.tar.gz"

# ── Helpers ──────────────────────────────────────────────────────────────────
log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] [backup-files] $*" | tee -a "${LOG_FILE}"; }

notify_failure() {
  local reason="$1"
  log "ERROR: ${reason}"
  curl -s -X POST "${API_URL}/backup/notify" \
    -H "Content-Type: application/json" \
    -H "x-backup-secret: ${API_SECRET}" \
    -d "{\"type\":\"files\",\"status\":\"failed\",\"reason\":$(echo -n "${reason}" | python3 -c 'import sys,json;print(json.dumps(sys.stdin.read()))')}" \
    --max-time 10 || true
}

# ── Setup ────────────────────────────────────────────────────────────────────
mkdir -p "${BACKUP_DIR}" "$(dirname "${LOG_FILE}")"

log "Starting file backup → ${BACKUP_FILE}"

# ── Collect source paths ──────────────────────────────────────────────────────
SOURCES=()
if [[ -d "${UPLOAD_DIR}" ]]; then
  SOURCES+=("${UPLOAD_DIR}")
else
  log "WARNING: UPLOAD_DIR '${UPLOAD_DIR}' does not exist — skipping"
fi

for extra in ${EXTRA_DIRS}; do
  if [[ -d "${extra}" ]]; then
    SOURCES+=("${extra}")
  else
    log "WARNING: Extra dir '${extra}' does not exist — skipping"
  fi
done

if [[ ${#SOURCES[@]} -eq 0 ]]; then
  notify_failure "No source directories found to back up"
  exit 1
fi

log "Sources: ${SOURCES[*]}"

# ── Run tar ───────────────────────────────────────────────────────────────────
if ! tar -czf "${BACKUP_FILE}.tmp" "${SOURCES[@]}" 2>/tmp/tar_err.txt; then
  ERR=$(cat /tmp/tar_err.txt)
  rm -f "${BACKUP_FILE}.tmp"
  notify_failure "tar failed: ${ERR}"
  exit 1
fi

mv "${BACKUP_FILE}.tmp" "${BACKUP_FILE}"
SIZE=$(du -sh "${BACKUP_FILE}" | cut -f1)
log "SUCCESS: ${BACKUP_FILE} (${SIZE})"

# ── Retention ─────────────────────────────────────────────────────────────────
prune_backups() {
  local dir="$1"
  local files
  mapfile -t files < <(ls -1t "${dir}"/*.tar.gz 2>/dev/null)

  local keep=()
  for i in "${!files[@]}"; do
    [[ $i -lt 4 ]] && keep+=("${files[$i]}")
  done

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
  -d "{\"type\":\"files\",\"status\":\"success\",\"file\":\"${TIMESTAMP}.tar.gz\",\"size\":\"${SIZE}\"}" \
  --max-time 10 || true

log "File backup complete."
