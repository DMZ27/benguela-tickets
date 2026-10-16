import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ tickets: [] });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        userId: user.id,
        status: { in: ["PAID", "USED"] },
      },
      include: {
        event: {
          select: {
            title: true,
            location: true,
            startsAt: true,
            flyerUrl: true,
          },
        },
        ticketType: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao procurar ingressos" },
      { status: 500 }
    );
  }
}
