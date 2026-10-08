"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { isContentKey, resetContent, saveContent } from "@/lib/cms";

export type CmsState = { ok?: boolean; error?: string; at?: number };

export async function saveSection(key: string, _prev: CmsState, fd: FormData): Promise<CmsState> {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!isContentKey(key)) return { error: "Bagian konten tidak dikenal." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(fd.get("json") ?? ""));
  } catch {
    return { error: "Data tidak valid. Muat ulang halaman lalu coba lagi." };
  }
  await saveContent(key, parsed);
  revalidatePath("/", "layout");
  return { ok: true, at: Date.now() };
}

export async function resetSection(key: string) {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!isContentKey(key)) return;
  await resetContent(key);
  revalidatePath("/", "layout");
  redirect(`/admin/cms/${key}`);
}
