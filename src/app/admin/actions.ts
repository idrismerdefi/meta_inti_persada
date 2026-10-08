"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/db";
import { RFQ_STATUSES, type RfqStatus } from "@/db/schema";
import { checkPassword, endSession, isAdmin, isAdminConfigured, startSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "ADMIN_PASSWORD belum diatur di environment server." };
  }
  // Jeda kecil untuk memperlambat percobaan tebak-password.
  await new Promise((r) => setTimeout(r, 400));
  if (!checkPassword(String(fd.get("password") ?? ""))) {
    return { error: "Password salah." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function updateStatus(fd: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");

  const id = Number(fd.get("id"));
  const status = String(fd.get("status")) as RfqStatus;
  if (!Number.isInteger(id) || !RFQ_STATUSES.includes(status)) return;

  const db = await getDb();
  await db.update(schema.rfqRequests).set({ status }).where(eq(schema.rfqRequests.id, id));
  revalidatePath("/admin");
}
