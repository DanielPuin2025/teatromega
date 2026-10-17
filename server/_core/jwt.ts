import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET es obligatorio en producción.");
}
const secret = new TextEncoder().encode(JWT_SECRET || "dev-only-secret-not-for-production");

export async function signJWT(payload: { userId: number; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<{ userId: number; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: number; role: string };
  } catch (error) {
    return null;
  }
}
