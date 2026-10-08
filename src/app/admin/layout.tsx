import Link from "next/link";
import { isAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  return (
    <>
      {authed ? (
        <nav aria-label="Menu admin" className="border-b border-line bg-paper-2/60">
          <div className="wrap flex gap-6 text-[14px]">
            <Link href="/admin" className="border-b-2 border-transparent py-3 text-ink/75 hover:border-accent hover:text-ink">
              Daftar RFQ
            </Link>
            <Link href="/admin/cms" className="border-b-2 border-transparent py-3 text-ink/75 hover:border-accent hover:text-ink">
              Konten Website
            </Link>
          </div>
        </nav>
      ) : null}
      {children}
    </>
  );
}
