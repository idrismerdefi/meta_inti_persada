import "server-only";
import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "mip_admin";
const MAX_AGE = 60 * 60 * 8; // 8 jam

function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  // Token diturunkan dari password: mengganti ADMIN_PASSWORD otomatis membatalkan semua sesi.
  return createHmac("sha256", pw).update("mip-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return safeEqual(input, pw);
}

export async function isAdmin() {
  const expected = sessionToken();
  if (!expected) return false;
  const got = (await cookies()).get(COOKIE)?.value;
  return Boolean(got) && safeEqual(got!, expected);
}

export async function startSession() {
  const token = sessionToken();
  if (!token) return;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}
