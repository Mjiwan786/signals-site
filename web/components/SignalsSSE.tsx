"use client";
import { useEffect, useState } from "react";
import type { SignalDTO } from "@/lib/api";
import { API_BASE } from "@/lib/env";

export default function SignalsSSE({ mode = "paper" }: { mode?: "paper" | "live" }) {
  const [last, setLast] = useState<SignalDTO | null>(null);
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/v1/signals/stream?mode=${mode}`);
    es.onmessage = (e) => {
      try { setLast(JSON.parse(e.data)); } catch { }
    };
    return () => es.close();
  }, [mode]);
  if (!last) return null;
  return (
    <div className="text-xs opacity-80">
      Live: {last.pair} {last.side} @ {last.entry} • {new Date(last.ts).toLocaleTimeString()}
    </div>
  );
}
