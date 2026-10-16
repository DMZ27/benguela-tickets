import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      description,
      flyerUrl,
      location,
      startsAt,
      endsAt,
      isPublished,
      ticketType,
    } = body;

    if (
      !title ||
      !slug ||
      !description ||
      !location ||
      !startsAt ||
      !ticketType?.name ||
      !ticketType?.price ||
      !ticketType?.quantity
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    // Verifica se o slug já existe
    const existing = await prisma.event.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Já existe um evento com este slug" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        flyerUrl: flyerUrl || "https://placehold.co/600x800/1e293b/94a3b8?text=Flyer",
        location,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        isPublished: Boolean(isPublished),
        ticketTypes: {
          create: {
            name: ticketType.name,
            price: Number(ticketType.price),
            quantity: Number(ticketType.quantity),
          },
        },
      },
      include: {
        ticketTypes: true,
      },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    console.error("[CREATE_EVENT]", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao criar evento" },
      { status: 500 }
    );
  }
}
