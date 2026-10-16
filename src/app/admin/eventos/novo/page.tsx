"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoEventoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    flyerUrl: "",
    location: "",
    startsAt: "",
    endsAt: "",
    isPublished: true,
    ticketName: "Pista",
    ticketPrice: "",
    ticketQuantity: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Só são permitidos ficheiros de imagem");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 4MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Preview local
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro no upload");
      }

      setForm((prev) => ({
        ...prev,
        flyerUrl: data.url,
      }));
    } catch (err: any) {
      setError(err.message || "Erro ao fazer upload da imagem");
      setPreview(null);
    } finally {
      setUploading(false);
    }
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/admin/eventos"
          className="text-sm text-zinc-400 hover:text-white mb-4 inline-block"
        >
          ← Voltar aos eventos
        </Link>
        <h1 className="text-2xl font-bold">Criar Novo Evento</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Preenche os dados e faz upload do flyer
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-600/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Flyer Upload */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Flyer do Evento
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-zinc-700 rounded-2xl p-8 text-center cursor-pointer hover:border-sky-600/50 hover:bg-zinc-900/50 transition"
          >
            {preview || form.flyerUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview || form.flyerUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
                <p className="text-xs text-zinc-500 mt-3">
                  Clica para trocar a imagem
                </p>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-zinc-300 font-medium">
                  {uploading ? "A enviar..." : "Clica para fazer upload"}
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  PNG, JPG ou WEBP até 4MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
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

        {/* Slug */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Slug (URL)</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Descrição *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-sky-500"
            placeholder="Descreve o evento com detalhes..."
          />
        </div>

        {/* Local */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Local *</label>
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

        {/* Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
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
            <label className="block text-sm text-zinc-400 mb-1.5">
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

        {/* Tipo de Passe */}
        <div className="border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-medium text-zinc-200">Tipo de Passe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Nome</label>
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
              <label className="block text-sm text-zinc-400 mb-1.5">
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
              <label className="block text-sm text-zinc-400 mb-1.5">
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

        {/* Publicar */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isPublished"
            id="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="isPublished" className="text-sm text-zinc-300">
            Publicar imediatamente no site
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full rounded-xl bg-sky-600 py-3.5 font-semibold hover:bg-sky-500 disabled:opacity-50 transition"
        >
          {loading ? "A criar evento..." : "Criar Evento"}
        </button>
      </form>
    </div>
  );
}
