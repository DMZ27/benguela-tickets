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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Benguela<span className="text-sky-500">Tickets</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/meus-ingressos"
              className="text-zinc-400 hover:text-white transition"
            >
              Meus Ingressos
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-zinc-950 to-zinc-950" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Os melhores eventos de{" "}
            <span className="text-sky-400">Benguela</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Compra o teu ingresso online de forma rápida e segura. Recebe o QR
            Code no telemóvel e entra sem filas.
          </p>
          <a
            href="#eventos"
            className="inline-flex items-center rounded-full bg-sky-600 px-8 py-3.5 text-sm font-semibold hover:bg-sky-500 transition shadow-lg shadow-sky-900/30"
          >
            Ver Eventos
          </a>
        </div>
      </section>

      {/* Events */}
      <section id="eventos" className="mx-auto max-w-6xl px-4 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Próximos Eventos</h2>
            <p className="text-zinc-500 text-sm mt-1">
              Escolhe o teu próximo momento
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎫</span>
            </div>
            <p className="text-zinc-300 text-lg mb-2">
              Ainda não há eventos publicados
            </p>
            <p className="text-zinc-500 text-sm">
              Volta em breve. Novos eventos estão a caminho.
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
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden hover:border-sky-600/40 hover:bg-zinc-900/70 transition duration-300"
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
                      <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                        Sem flyer
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg group-hover:text-sky-400 transition line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1.5 truncate">
                      {event.location}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {new Date(event.startsAt).toLocaleDateString("pt-AO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {minPrice !== undefined && (
                        <span className="text-sm font-medium text-sky-400">
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

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-10">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Benguela Tickets</p>
          <p>Feito para Benguela</p>
        </div>
      </footer>
    </div>
  );
}
