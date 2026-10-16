import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    return await prisma.event.findMany({
      include: {
        ticketTypes: true,
        _count: { select: { tickets: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminEventosPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
            ← Voltar ao Dashboard
          </Link>
          <span className="font-semibold">Gestão de Eventos</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Eventos</h1>
          <Link
            href="/admin/eventos/novo"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500 transition"
          >
            + Novo Evento
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <p className="text-zinc-400">Nenhum evento criado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-zinc-500">
                    {event.isPublished ? (
                      <span className="text-emerald-400">Publicado</span>
                    ) : (
                      <span className="text-amber-400">Rascunho</span>
                    )}{" "}
                    · {event._count.tickets} ingressos ·{" "}
                    {new Date(event.startsAt).toLocaleDateString("pt-AO")}
                  </p>
                </div>
                <div className="text-sm text-zinc-400">
                  {event.ticketTypes.length} tipo(s) de passe
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
