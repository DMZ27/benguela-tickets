import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTicketPayload } from "@/lib/qr";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { valid: false, reason: "Token em falta" },
        { status: 400 }
      );
    }

    const payload = await verifyTicketPayload(token);

    if (!payload) {
      return NextResponse.json({
        valid: false,
        reason: "QR inválido ou adulterado",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: payload.tid },
      include: {
        event: { select: { title: true, startsAt: true } },
        ticketType: { select: { name: true } },
        user: { select: { name: true, phone: true, email: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({
        valid: false,
        reason: "Ingresso não encontrado",
      });
    }

    if (ticket.status === "USED") {
      return NextResponse.json({
        valid: false,
        reason: "Ingresso já foi utilizado",
        usedAt: ticket.usedAt,
      });
    }

    if (ticket.status !== "PAID") {
      return NextResponse.json({
        valid: false,
        reason: "Ingresso não está pago",
      });
    }

    // Marca como usado
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: "USED",
        usedAt: new Date(),
      },
    });

    return NextResponse.json({
      valid: true,
      ticket: {
        code: ticket.code,
        type: ticket.ticketType.name,
        holder: ticket.user.name || ticket.user.phone || ticket.user.email || "—",
        event: ticket.event.title,
        startsAt: ticket.event.startsAt,
      },
    });
  } catch (error) {
    console.error("[VALIDATE_TICKET]", error);
    return NextResponse.json(
      { valid: false, reason: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
