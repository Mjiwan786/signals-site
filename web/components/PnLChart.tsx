"use client";
import { useEffect, useState } from "react";
import type { PnLPoint } from "@/lib/api";
import { getPnL } from "@/lib/api";

export default function PnLChart({ n = 500 }: { n?: number }) {
  const [data, setData] = useState<PnLPoint[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true);
    getPnL(n)
      .then((result) => {
        setData(result);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch((e) => {
        setErr(String(e));
        setLoading(false);
      });
  }, [n]);

  // Error state
  if (err) {
    return (
      <div className="w-full max-w-4xl p-6 bg-surface border border-border rounded-xl">
        <div className="text-danger text-sm">Error loading PnL data: {err}</div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl p-6 bg-surface border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
          <div className="text-text2 text-sm">Loading equity curve…</div>
        </div>
      </div>
    );
  }

  // Empty state (safe guard for empty arrays)
  if (!data.length) {
    return (
      <div className="w-full max-w-4xl p-6 bg-surface border border-border rounded-xl">
        <div className="text-dim text-sm">No PnL data available.</div>
      </div>
    );
  }

  // Minimal SVG line to avoid extra deps; you can swap to Recharts/lightweight-charts later
  const w = 720, h = 260, pad = 30;

  // Safe guards for empty arrays
  const xs = data.map(d => d.ts);
  const ys = data.map(d => d.equity);

  if (xs.length === 0 || ys.length === 0) {
    return (
      <div className="w-full max-w-4xl p-6 bg-surface border border-border rounded-xl">
        <div className="text-dim text-sm">Invalid PnL data format.</div>
      </div>
    );
  }

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  // Edge case: single point or flat data
  const isFlat = minY === maxY || data.length === 1;

  // Add small padding to Y scale (5% of range)
  const yPadding = isFlat ? 0 : (maxY - minY) * 0.05;
  const paddedMinY = minY - yPadding;
  const paddedMaxY = maxY + yPadding;

  const x = (t: number) => pad + (w - 2 * pad) * ((t - minX) / (maxX - minX || 1));
  const y = (v: number) => {
    if (isFlat) return h / 2; // Center horizontally for flat data
    return h - pad - (h - 2 * pad) * ((v - paddedMinY) / (paddedMaxY - paddedMinY));
  };

  const dAttr = data.map((p, i) => `${i ? "L" : "M"}${x(p.ts)},${y(p.equity)}`).join(" ");

  // Calculate total PnL change
  const totalChange = data.length > 1 ? data[data.length - 1].equity - data[0].equity : 0;
  const isPositive = totalChange >= 0;

  return (
    <div className="w-full max-w-4xl">
      <div className="p-6 bg-surface border border-border rounded-xl shadow-soft">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-xl font-semibold text-text">Live Equity Curve</h3>
          <div className="text-xs text-dim">
            {data.length} point{data.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* SVG Chart */}
        <div className="overflow-x-auto">
          <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            className="rounded-lg bg-elev border border-border/50"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeWidth="1" className="text-border opacity-50" />
            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeWidth="1" className="text-border opacity-50" />

            {/* Equity line */}
            <path
              d={dAttr}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isFlat ? "text-dim opacity-40" : isPositive ? "text-success" : "text-danger"}
            />

            {/* Start/End markers */}
            {!isFlat && data.length > 1 && (
              <>
                <circle cx={x(data[0].ts)} cy={y(data[0].equity)} r="4" fill="currentColor" className="text-accentA" />
                <circle cx={x(data[data.length - 1].ts)} cy={y(data[data.length - 1].equity)} r="4" fill="currentColor" className={isPositive ? "text-success" : "text-danger"} />
              </>
            )}

            {isFlat && (
              <text x={w / 2} y={h / 2 - 20} textAnchor="middle" className="text-xs text-dim fill-current">
                Awaiting more data…
              </text>
            )}
          </svg>
        </div>

        {/* Caption with range and last updated */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-2 text-xs">
          <div className="text-text2">
            {isFlat ? (
              <span>Equity: <span className="font-semibold text-text">${minY.toFixed(2)}</span></span>
            ) : (
              <span>
                Range: <span className="font-semibold text-text">${minY.toFixed(2)}</span> → <span className={`font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>${maxY.toFixed(2)}</span>
                <span className={`ml-2 ${isPositive ? 'text-success' : 'text-danger'}`}>
                  ({isPositive ? '+' : ''}{totalChange.toFixed(2)})
                </span>
              </span>
            )}
          </div>

          {lastUpdated && (
            <div className="text-dim">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
