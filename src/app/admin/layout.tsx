import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg">
              Benguela<span className="text-sky-500">Tickets</span>
              <span className="ml-2 text-xs font-normal text-zinc-500">
                Admin
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link
                href="/admin"
                className="text-zinc-400 hover:text-white transition"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/eventos"
                className="text-zinc-400 hover:text-white transition"
              >
                Eventos
              </Link>
              <Link
                href="/admin/scanner"
                className="text-zinc-400 hover:text-white transition"
              >
                Scanner
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            ← Ver site
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
