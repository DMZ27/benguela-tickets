import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatKwanza } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPublishedEvents() {
  try {
    return await prisma.event.findMany({
      where: { isPublished: true },
      include: {
        ticketTypes: {
          orderBy: { price: "asc" },
          take: 1,
        },
      },
      orderBy: { startsAt: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const events = await getPublishedEvents();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Benguela<span className="text-sky-500">Tickets</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/meus-ingressos" className="text-zinc-400 hover:text-white transition">
              Meus Ingressos
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-medium hover:bg-sky-500 transition"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Os melhores eventos de <span className="text-sky-500">Benguela</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Compre o seu ingresso online de forma rápida e segura. Receba o QR Code no telemóvel e entre sem filas.
        </p>
      </section>

      {/* Events Grid */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-2xl font-semibold mb-8">Próximos Eventos</h2>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <p className="text-zinc-400">Nenhum evento publicado ainda.</p>
            <p className="text-sm text-zinc-500 mt-2">
              Vá ao painel admin e crie o primeiro evento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const minPrice = event.ticketTypes[0]?.price;
              return (
                <Link
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-sky-600/50 transition"
                >
                  <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                    {event.flyerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.flyerUrl}
                        alt={event.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600">
                        Sem flyer
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg group-hover:text-sky-400 transition">
                      {event.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">{event.location}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        {new Date(event.startsAt).toLocaleDateString("pt-AO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {minPrice !== undefined && (
                        <span className="font-medium text-sky-400">
                          desde {formatKwanza(minPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Benguela Tickets — Feito para Benguela
      </footer>
    </div>
  );
}
