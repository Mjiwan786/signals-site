"use client";
import { useEffect, useMemo, useState } from "react";
import type { SignalDTO } from "@/lib/api";
import { getSignals } from "@/lib/api";
import { DEFAULT_MODE } from "@/lib/env";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function SignalsTable() {
  const [mode, setMode] = useState<"paper" | "live">(DEFAULT_MODE as any);
  const [pair, setPair] = useState<string>("");
  const [rows, setRows] = useState<SignalDTO[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setErr(null);
    getSignals({ mode, pair: pair || undefined, limit: 200 })
      .then(data => {
        setRows(data);
        setErr(null);
      })
      .catch(e => {
        setErr(String(e));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [mode]);

  const lastTs = useMemo(() => rows.at(-1)?.ts, [rows]);

  return (
    <div className="w-full">
      {/* Controls Row */}
      <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-surface border border-border rounded-lg">
        {/* Mode Toggle */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-dim mb-1">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="w-full bg-elev border border-border rounded px-3 py-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          >
            <option value="paper">Paper Trading</option>
            <option value="live">Live Trading</option>
          </select>
        </div>

        {/* Pair Filter */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-dim mb-1">Pair Filter</label>
          <input
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            placeholder="e.g. BTC-USD"
            className="w-full bg-elev border border-border rounded px-3 py-2 text-text text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2 rounded bg-accent hover:bg-accent/80 text-white text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ReloadIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>

        {/* Status Info */}
        {lastTs && !loading && (
          <span className="text-xs text-dim ml-auto whitespace-nowrap">
            Last signal: {new Date(lastTs * 1000).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Error Message */}
      {err && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger/50 rounded text-danger text-sm">
          Error: {err}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-elev border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text2 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text2 uppercase tracking-wider">Pair</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text2 uppercase tracking-wider">Side</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text2 uppercase tracking-wider">Entry</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text2 uppercase tracking-wider">SL</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text2 uppercase tracking-wider">TP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text2 uppercase tracking-wider">Strategy</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text2 uppercase tracking-wider">Conf%</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {rows.map(r => {
              try {
                const isBuy = r.side?.toLowerCase() === 'buy';
                return (
                  <tr key={r.id || Math.random()} className="hover:bg-elev/50 transition-colors">
                    <td className="px-4 py-3 text-text2">
                      {r.ts ? new Date(r.ts * 1000).toLocaleTimeString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-text font-medium">{r.pair || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                        isBuy ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                      }`}>
                        {r.side?.toUpperCase() || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-text font-mono">
                      {r.entry?.toFixed?.(4) ?? r.entry ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-text2 font-mono">
                      {r.sl ? r.sl.toFixed(4) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-text2 font-mono">
                      {r.tp ? r.tp.toFixed(4) : "-"}
                    </td>
                    <td className="px-4 py-3 text-text2">{r.strategy || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                        (r.confidence || 0) >= 0.8 ? 'bg-success/20 text-success' :
                        (r.confidence || 0) >= 0.6 ? 'bg-accent/20 text-accent' :
                        'bg-danger/20 text-danger'
                      }`}>
                        {r.confidence ? (r.confidence * 100).toFixed(1) : "-"}%
                      </span>
                    </td>
                  </tr>
                );
              } catch {
                return null;
              }
            })}
            {rows.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-8 text-center text-dim" colSpan={8}>
                  No signals found. Try adjusting your filters or refresh the data.
                </td>
              </tr>
            )}
            {loading && rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center" colSpan={8}>
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
                    <span className="text-text2">Loading signals…</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      {rows.length > 0 && (
        <div className="mt-3 text-xs text-dim text-center">
          Showing {rows.length} signal{rows.length !== 1 ? 's' : ''} (limit: 200)
        </div>
      )}
    </div>
  );
}
