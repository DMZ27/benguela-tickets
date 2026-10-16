"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Ticket, Calendar, MapPin, Loader2 } from "lucide-react";

type TicketData = {
  id: string;
  code: string;
  status: string;
  qrPayload: string;
  event: {
    title: string;
    location: string;
    startsAt: string;
    flyerUrl: string;
  };
  ticketType: {
    name: string;
  };
};

export default function MeusIngressosPage() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(
        `/api/meus-ingressos?email=${encodeURIComponent(email.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao buscar ingressos");
        setTickets([]);
      } else {
        setTickets(data.tickets || []);
      }
    } catch {
      setError("Erro de conexão. Tenta novamente.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Benguela<span className="text-sky-500">Tickets</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Título */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 mb-5">
            <Ticket className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Meus Ingressos
          </h1>
          <p className="text-zinc-400">
            Introduz o email usado na compra para ver os teus QR Codes
          </p>
        </div>

        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o.teu.email@exemplo.com"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-60 px-8 py-3.5 font-semibold transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  A procurar...
                </>
              ) : (
                "Ver Ingressos"
              )}
            </button>
          </div>
        </form>

        {/* Mensagens */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 mb-8 text-center">
            {error}
          </div>
        )}

        {searched && !loading && tickets.length === 0 && !error && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
            <p className="text-zinc-300 text-lg mb-2">
              Nenhum ingresso encontrado
            </p>
            <p className="text-zinc-500 text-sm">
              Verifica se o email está correcto ou se a compra já foi
              confirmada.
            </p>
          </div>
        )}

        {/* Lista de ingressos */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden"
            >
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
                {/* QR Code */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <div className="bg-white p-3 rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        ticket.qrPayload
                      )}`}
                      alt={`QR Code ${ticket.code}`}
                      width={180}
                      height={180}
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-center text-xs text-zinc-500 mt-2 font-mono">
                    {ticket.code}
                  </p>
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-lg font-semibold leading-tight">
                      {ticket.event.title}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                        ticket.status === "PAID"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : ticket.status === "USED"
                          ? "bg-zinc-700 text-zinc-300"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {ticket.status === "PAID"
                        ? "Válido"
                        : ticket.status === "USED"
                        ? "Utilizado"
                        : ticket.status}
                    </span>
                  </div>

                  <p className="text-sky-400 text-sm font-medium mb-4">
                    {ticket.ticketType.name}
                  </p>

                  <div className="space-y-2 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      {new Date(ticket.event.startsAt).toLocaleDateString(
                        "pt-AO",
                        {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-500" />
                      {ticket.event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
