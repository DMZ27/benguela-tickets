"use client";

import { useState } from "react";
import Link from "next/link";

export default function ScannerPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{
    valid: boolean;
    reason?: string;
    ticket?: {
      code: string;
      type: string;
      holder: string;
      event: string;
    };
    usedAt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleValidate() {
    if (!token.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tickets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, reason: "Erro de conexão" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
            ← Voltar
          </Link>
          <span className="font-semibold">Scanner de Ingressos</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <label className="block text-sm text-zinc-400 mb-2">
            Cole o conteúdo do QR Code (token JWT)
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-mono focus:outline-none focus:border-sky-500"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />

          <button
            onClick={handleValidate}
            disabled={loading || !token.trim()}
            className="mt-4 w-full rounded-xl bg-sky-600 py-3 font-medium hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "A validar..." : "Validar Ingresso"}
          </button>
        </div>

        {result && (
          <div
            className={`mt-6 rounded-2xl border p-6 ${
              result.valid
                ? "border-emerald-600/50 bg-emerald-950/30"
                : "border-red-600/50 bg-red-950/30"
            }`}
          >
            {result.valid && result.ticket ? (
              <div>
                <p className="text-emerald-400 font-bold text-lg mb-4">✓ Ingresso Válido</p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-zinc-400">Código:</span>{" "}
                    <span className="font-mono font-medium">{result.ticket.code}</span>
                  </p>
                  <p>
                    <span className="text-zinc-400">Tipo:</span> {result.ticket.type}
                  </p>
                  <p>
                    <span className="text-zinc-400">Titular:</span> {result.ticket.holder}
                  </p>
                  <p>
                    <span className="text-zinc-400">Evento:</span> {result.ticket.event}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-red-400 font-bold text-lg mb-2">✗ Inválido</p>
                <p className="text-sm text-zinc-300">{result.reason}</p>
                {result.usedAt && (
                  <p className="text-xs text-zinc-500 mt-2">
                    Usado em: {new Date(result.usedAt).toLocaleString("pt-AO")}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-500">
          No futuro este scanner pode usar a câmara do telemóvel para ler o QR automaticamente.
        </p>
      </main>
    </div>
  );
}
