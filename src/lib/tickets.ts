import { prisma } from "./prisma";
import { generateReadableCode, generateTicketPayload } from "./qr";

export async function createTicketsFromOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: true,
    },
  });

  if (!order || order.status !== "PAID") {
    throw new Error("Order is not paid");
  }

  const createdTickets = [];

  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      const code = generateReadableCode();

      const ticket = await prisma.ticket.create({
        data: {
          code,
          orderId: order.id,
          eventId: order.eventId,
          ticketTypeId: item.ticketTypeId,
          userId: order.userId,
          status: "PAID",
          qrPayload: "pending",
        },
      });

      const qrPayload = await generateTicketPayload({
        id: ticket.id,
        eventId: ticket.eventId,
        userId: ticket.userId,
        code: ticket.code,
      });

      const updated = await prisma.ticket.update({
        where: { id: ticket.id },
        data: { qrPayload },
      });

      await prisma.ticketType.update({
        where: { id: item.ticketTypeId },
        data: { sold: { increment: 1 } },
      });

      createdTickets.push(updated);
    }
  }

  return createdTickets;
}
