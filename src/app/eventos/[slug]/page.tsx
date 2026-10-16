import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatKwanza } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug, isPublished: true },
    include: {
      ticketTypes: {
        orderBy: { price: "asc" },
      },
    },
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Benguela<span className="text-sky-500">Tickets</span>
          </Link>
          <Link href="/meus-ingressos" className="text-sm text-zinc-400 hover:text-white">
            Meus Ingressos
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Flyer */}
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            {event.flyerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.flyerUrl}
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="aspect-[3/4] flex items-center justify-center text-zinc-600">
                Sem flyer
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {event.title}
            </h1>
            <p className="text-zinc-400 mb-6">{event.location}</p>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-8">
              <div>
                <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">
                  Data
                </span>
                {new Date(event.startsAt).toLocaleDateString("pt-AO", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div>
                <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">
                  Hora
                </span>
                {new Date(event.startsAt).toLocaleTimeString("pt-AO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none mb-10">
              <p className="text-zinc-300 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Ticket Types */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-4">Escolha o seu passe</h2>
              {event.ticketTypes.map((type) => {
                const available = type.quantity - type.sold;
                const soldOut = available <= 0;

                return (
                  <div
                    key={type.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4"
                  >
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-zinc-500">
                        {soldOut ? "Esgotado" : `${available} disponíveis`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-sky-400">
                        {formatKwanza(type.price)}
                      </span>
                      {!soldOut && (
                        <Link
                          href={`/checkout/${event.id}?type=${type.id}`}
                          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500 transition"
                        >
                          Comprar
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
