import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum ficheiro enviado" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Só são permitidos ficheiros de imagem" },
        { status: 400 }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "A imagem deve ter no máximo 4MB" },
        { status: 400 }
      );
    }

    // Converte para base64 data URL
    // Nota: isto funciona bem para flyers pequenos/médios.
    // Para produção com muitos eventos, recomenda-se Cloudinary ou similar.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
    });
  } catch (error: any) {
    console.error("[UPLOAD]", error);
    return NextResponse.json(
      { error: "Erro ao processar a imagem" },
      { status: 500 }
    );
  }
}
