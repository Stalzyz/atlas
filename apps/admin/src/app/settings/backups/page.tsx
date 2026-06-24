"use client";

import { useState, useEffect, useCallback } from "react";
import { Database, FileArchive, RefreshCw, Download, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { useAdminAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api";

interface BackupLogEntry {
  timestamp: string;
  script: string;
  level: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  message: string;
}

interface BackupStatus {
  db: { lastSuccess: string | null; lastFile: string | null; count: number };
  files: { lastSuccess: string | null; lastFile: string | null; count: number };
}

function LevelBadge({ level }: { level: BackupLogEntry["level"] }) {
  const map = {
    SUCCESS: { icon: <CheckCircle2 size={13} />, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    ERROR: { icon: <XCircle size={13} />, cls: "text-red-700 bg-red-50 border-red-200" },
    WARNING: { icon: <AlertCircle size={13} />, cls: "text-amber-700 bg-amber-50 border-amber-200" },
    INFO: { icon: <Clock size={13} />, cls: "text-gray-600 bg-gray-50 border-gray-200" },
  };
  const { icon, cls } = map[level] ?? map.INFO;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${cls}`}>
      {icon} {level}
    </span>
  );
}

function StatusCard({
  title,
  icon,
  status,
  type,
  onDownload,
  downloading,
}: {
  title: string;
  icon: React.ReactNode;
  status: BackupStatus["db"] | null;
  type: "db" | "files";
  onDownload: (type: "db" | "files") => void;
  downloading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            {type === "db" ? "PostgreSQL · pg_dump · every 6h" : "Uploads · tar · daily 2 AM"}
          </p>
        </div>
      </div>

      {status ? (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Last Backup</p>
            <p className="font-medium text-gray-800 text-xs">
              {status.lastSuccess ?? <span className="text-gray-400 italic">Never</span>}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Stored Files</p>
            <p className="font-medium text-gray-800">{status.count}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Loading…</p>
      )}

      <button
        onClick={() => onDownload(type)}
        disabled={downloading || !status?.lastFile}
        className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {downloading ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
        Download Latest
      </button>
    </div>
  );
}

export default function BackupsPage() {
  const { token } = useAdminAuth();
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [logs, setLogs] = useState<BackupLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<"db" | "files" | null>(null);
  const [filter, setFilter] = useState<"ALL" | "SUCCESS" | "ERROR" | "WARNING">("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statusRes, logsRes] = await Promise.all([
        apiFetch("/backup/status", { token }),
        apiFetch("/backup/logs?limit=300", { token }),
      ]);
      if (statusRes.ok) setStatus(await statusRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleDownload = async (type: "db" | "files") => {
    setDownloading(type);
    try {
      const res = await apiFetch(`/backup/download?type=${type}`, { token });
      if (!res.ok) { alert("No backup file available."); return; }
      const blob = await res.blob();
      const disposition = res.headers.get("content-disposition") ?? "";
      const nameMatch = disposition.match(/filename="(.+?)"/);
      const filename = nameMatch?.[1] ?? `backup-${type}.${type === "db" ? "sql.gz" : "tar.gz"}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  const filteredLogs = filter === "ALL" ? logs : logs.filter((l) => l.level === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backups</h1>
          <p className="text-sm text-gray-500 mt-1">Automated database and file backups with tiered retention</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusCard
          title="Database Backup"
          icon={<Database size={18} />}
          status={status?.db ?? null}
          type="db"
          onDownload={handleDownload}
          downloading={downloading === "db"}
        />
        <StatusCard
          title="File Backup"
          icon={<FileArchive size={18} />}
          status={status?.files ?? null}
          type="files"
          onDownload={handleDownload}
          downloading={downloading === "files"}
        />
      </div>

      {/* Retention Policy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Retention policy</p>
        <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-700">
          <li>Last 4 backups always kept (covers 24h at 6h interval for DB)</li>
          <li>1 backup per day for the past 7 days</li>
          <li>1 backup per week for the past 4 weeks</li>
          <li>1 backup per month for the past 3 months</li>
        </ul>
      </div>

      {/* Log Viewer */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">Backup Log</h2>
          <div className="flex gap-1.5">
            {(["ALL", "SUCCESS", "ERROR", "WARNING"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw size={20} className="animate-spin text-gray-400" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-400">
              {logs.length === 0
                ? "No backup logs found. Have the cron jobs been set up on the server?"
                : "No entries matching this filter."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-medium w-44">Timestamp</th>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-medium w-28">Script</th>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-medium w-24">Status</th>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((entry, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-mono text-gray-500 whitespace-nowrap">{entry.timestamp}</td>
                      <td className="px-4 py-2.5 text-gray-600">{entry.script}</td>
                      <td className="px-4 py-2.5">
                        <LevelBadge level={entry.level} />
                      </td>
                      <td className="px-4 py-2.5 text-gray-700 font-mono break-all">{entry.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cron reference */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-widest">Server Cron Setup</p>
        <pre className="text-xs text-gray-700 font-mono leading-6">
{`# Add via: crontab -e
0 */6 * * * /scripts/backup-db.sh >> /backups/logs/backup.log 2>&1
0 2   * * * /scripts/backup-files.sh >> /backups/logs/backup.log 2>&1`}
        </pre>
      </div>
    </div>
  );
}
