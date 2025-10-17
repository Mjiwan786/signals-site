import { API_BASE } from "./env";

export type PnLPoint = { ts: number; equity: number; daily_pnl: number };
export type SignalDTO = {
  id: string;
  ts: number;
  pair: string;
  side: "buy" | "sell";
  entry: number;
  sl?: number;
  tp?: number;
  strategy: string;
  confidence: number;
  mode: "paper" | "live";
};

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export const getPnL = (n = 500) =>
  fetch(`${API_BASE}/v1/pnl?n=${n}`, { cache: "no-store" }).then(j<PnLPoint[]>);

export const getSignals = (opts: { mode?: "paper" | "live"; pair?: string; limit?: number } = {}) => {
  const m = opts.mode ?? "paper";
  const p = opts.pair ? `&pair=${encodeURIComponent(opts.pair)}` : "";
  const l = `&limit=${opts.limit ?? 200}`;
  return fetch(`${API_BASE}/v1/signals?mode=${m}${p}${l}`, { cache: "no-store" })
    .then(j<SignalDTO[]>);
};
