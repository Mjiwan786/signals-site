"use client";
import { API_BASE } from "@/lib/env";

export default function ApiGuard() {
  if (process.env.NEXT_PUBLIC_API_BASE) return null;

  return (
    <div className="bg-yellow-900/30 border border-yellow-600/50 text-yellow-200 px-4 py-3 text-sm">
      <strong>⚠️ API Configuration Missing:</strong> Set <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_API_BASE</code> in your <code className="bg-black/30 px-1 rounded">.env.local</code> file.
      Currently using default: <code className="bg-black/30 px-1 rounded">{API_BASE}</code>
    </div>
  );
}
