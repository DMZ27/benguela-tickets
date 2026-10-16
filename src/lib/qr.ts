import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";

const secret = new TextEncoder().encode(
  process.env.QR_SECRET || "benguela-tickets-secret-change-in-production"
);

export async function generateTicketPayload(data: {
  id: string;
  eventId: string;
  userId: string;
  code: string;
}) {
  const token = await new SignJWT({
    tid: data.id,
    eid: data.eventId,
    uid: data.userId,
    code: data.code,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("45d")
    .sign(secret);

  return token;
}

export async function verifyTicketPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      tid: string;
      eid: string;
      uid: string;
      code: string;
    };
  } catch {
    return null;
  }
}

export function generateReadableCode() {
  return "BGL-" + randomBytes(3).toString("hex").toUpperCase();
}
