"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    flyerUrl: "",
    location: "",
    startsAt: "",
    endsAt: "",
    isPublished: false,
    ticketName: "Pista",
    ticketPrice: "",
    ticketQuantity: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          description: form.description,
          flyerUrl:
            form.flyerUrl ||
            "https://placehold.co/600x800/1e293b/94a3b8?text=Flyer",
          location: form.location,
          startsAt: form.startsAt,
          endsAt: form.endsAt || null,
          isPublished: form.isPublished,
          ticketType: {
            name: form.ticketName,
            price: Number(form.ticketPrice),
            quantity: Number(form.ticketQuantity),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar evento");
      }

      router.push("/admin/eventos");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/admin/eventos"
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← Voltar
          </Link>
          <span className="font-semibold">Novo Evento</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Criar Evento</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-600/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Título do Evento *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleTitleChange}
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
              placeholder="Ex: Festival de Verão Benguela 2026"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Descrição *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
              placeholder="Descreve o evento..."
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Local *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
              placeholder="Ex: Praia Morena, Benguela"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Data e Hora de Início *
              </label>
              <input
                type="datetime-local"
                name="startsAt"
                value={form.startsAt}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Data e Hora de Fim
              </label>
              <input
                type="datetime-local"
                name="endsAt"
                value={form.endsAt}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              URL do Flyer
            </label>
            <input
              type="url"
              name="flyerUrl"
              value={form.flyerUrl}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
              placeholder="https://..."
            />
            <p className="text-xs text-zinc-500 mt-1">
              Por agora cola um link de imagem. Depois implementamos upload.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-5 space-y-4">
            <h2 className="font-medium">Primeiro Tipo de Passe</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome</label>
                <input
                  type="text"
                  name="ticketName"
                  value={form.ticketName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Preço (Kz)
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  name="ticketQuantity"
                  value={form.ticketQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPublished"
              id="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className="w-4 h-4 rounded border-zinc-600"
            />
            <label htmlFor="isPublished" className="text-sm">
              Publicar imediatamente
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-600 py-3 font-medium hover:bg-sky-500 disabled:opacity-50 transition"
          >
            {loading ? "A criar..." : "Criar Evento"}
          </button>
        </form>
      </main>
    </div>
  );
}
