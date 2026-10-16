import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [events, ticketsSold, revenue] = await Promise.all([
      prisma.event.count(),
      prisma.ticket.count({ where: { status: { in: ["PAID", "USED"] } } }),
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      events,
      ticketsSold,
      revenue: revenue._sum.totalAmount || 0,
    };
  } catch {
    return { events: 0, ticketsSold: 0, revenue: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Benguela<span className="text-sky-500">Tickets</span>
          </Link>
          <span className="text-sm text-zinc-400">Painel Admin</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Centro de Comando</h1>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400 mb-1">Eventos</p>
            <p className="text-3xl font-bold">{stats.events}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400 mb-1">Ingressos Vendidos</p>
            <p className="text-3xl font-bold">{stats.ticketsSold}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400 mb-1">Receita</p>
            <p className="text-3xl font-bold text-sky-400">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
                minimumFractionDigits: 0,
              }).format(stats.revenue)}
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/eventos"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-sky-600/50 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Eventos</h2>
            <p className="text-sm text-zinc-400">Criar e gerir eventos</p>
          </Link>

          <Link
            href="/admin/vendas"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-sky-600/50 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Vendas</h2>
            <p className="text-sm text-zinc-400">Ver pedidos e ingressos</p>
          </Link>

          <Link
            href="/admin/scanner"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-sky-600/50 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Scanner</h2>
            <p className="text-sm text-zinc-400">Validar ingressos na porta</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
