import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <section className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-deep lg:block">
        <Image
          src="/photos/refinery.jpg"
          alt=""
          fill
          sizes="50vw"
          className="object-cover opacity-45 mix-blend-luminosity"
        />
        <div className="drafting-grid absolute inset-0" />
        <p className="tag absolute bottom-8 left-8 text-white/70">
          <span className="text-accent-bright">PT. Meta Inti Persada</span>
          <span className="mx-2 opacity-50">/</span>Panel Admin
        </p>
      </div>
      <div className="flex items-center py-20 md:py-28">
        <div className="wrap max-w-[520px]">
          <span aria-hidden="true" className="mb-5 block h-1 w-12 bg-accent" />
          <p className="tag text-muted">
            <span className="text-accent">Admin</span>
            <span className="mx-2 opacity-50">/</span>Daftar RFQ
          </p>
          <h1 className="mt-5 text-[40px] leading-[1.05] tracking-[-0.03em]">Masuk ke panel admin.</h1>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
