"use client";

import { useActionState, useState } from "react";
import { saveSection, type CmsState } from "./actions";

type Json = string | Json[] | { [k: string]: Json };

const LABELS: Record<string, string> = {
  name: "Nama",
  shortName: "Nama singkat",
  abbr: "Singkatan",
  tagline: "Tagline",
  positioning: "Positioning",
  closing: "Kalimat penutup",
  email: "Email",
  address: "Alamat",
  building: "Gedung",
  area: "Area",
  mapsUrl: "Tautan Google Maps",
  overview: "Ringkasan",
  focus: "Fokus",
  vision: "Visi",
  mission: "Misi",
  title: "Judul",
  body: "Isi",
  headline: "Judul utama",
  summary: "Ringkasan",
  items: "Daftar item",
  applications: "Aplikasi",
  benefits: "Manfaat",
  eyebrow: "Label kecil",
  components: "Komponen",
  note: "Catatan",
  intro: "Pengantar",
  lines: "Daftar produk",
  detail: "Keterangan",
  needs: "Kebutuhan",
  service: "Layanan",
  code: "Kode",
  pillar: "Pilar (slug)",
  id: "ID",
  image: "Gambar",
  slug: "Slug",
};
const label = (k: string) => LABELS[k] ?? k.charAt(0).toUpperCase() + k.slice(1);

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
/** Item kosong dengan bentuk yang sama dengan contoh. */
function blank(v: Json): Json {
  if (typeof v === "string") return "";
  if (Array.isArray(v)) return [];
  return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)]));
}

const inputCls = "field";

/** Perkecil di browser (maks. 1600 px, JPEG) supaya unggahan ringan; jika gagal, kirim file aslinya. */
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    return file;
  }
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", await shrink(file), "upload.jpg");
      const res = await fetch("/admin/media", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Gagal mengunggah.");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex aspect-[4/3] w-48 items-center justify-center overflow-hidden border border-line bg-paper-2 text-[12px] text-muted">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Pratinjau gambar" className="h-full w-full object-cover" />
        ) : (
          "Tanpa gambar"
        )}
      </div>
      <div className="grid gap-2 text-[13px]">
        <label className="inline-block cursor-pointer rounded-[2px] border border-line px-3.5 py-2 hover:border-accent hover:text-accent">
          {busy ? "Mengunggah…" : value ? "Ganti gambar" : "Unggah gambar"}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} disabled={busy} className="sr-only" />
        </label>
        {value ? (
          <button type="button" onClick={() => onChange("")} className="justify-self-start text-danger hover:underline">
            Hapus gambar
          </button>
        ) : null}
        <p className="max-w-[28ch] text-muted">JPG, PNG, atau WebP. Rasio 4:3 paling pas. Klik Simpan setelah memilih.</p>
        {error ? (
          <p role="alert" className="text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  value,
  onChange,
  path,
  tpl,
  locked,
}: {
  value: Json;
  onChange: (v: Json) => void;
  path: string[];
  tpl: Json;
  locked: string | undefined;
}) {
  const name = path[path.length - 1] ?? "";

  if (typeof value === "string" && name === "image") {
    return <ImageField value={value} onChange={onChange} />;
  }

  if (typeof value === "string") {
    const long = value.length > 70 || value.includes("\n") || /^(body|summary|intro|vision|detail)$/.test(name);
    const readOnly = locked === name;
    const common = {
      value,
      readOnly,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
      className: `${inputCls} ${readOnly ? "bg-paper-2 text-muted" : ""}`,
      "aria-label": label(name),
    };
    return long ? <textarea rows={3} {...common} /> : <input type="text" {...common} />;
  }

  if (Array.isArray(value)) {
    const itemTpl = (Array.isArray(tpl) ? tpl[0] : tpl) as Json;
    const simple = typeof itemTpl === "string";
    const set = (i: number, v: Json) => onChange(value.map((x, j) => (j === i ? v : x)));
    const move = (i: number, d: number) => {
      const j = i + d;
      if (j < 0 || j >= value.length) return;
      const next = [...value];
      [next[i], next[j]] = [next[j], next[i]];
      onChange(next);
    };
    const fixed = path.length === 0 && locked !== undefined; // daftar utama yang jumlahnya dikunci
    return (
      <div className="grid gap-3">
        {value.map((v, i) => (
          <div key={i} className={simple ? "flex items-start gap-2" : "border border-line bg-white p-4"}>
            {simple ? (
              <div className="min-w-0 flex-1">
                <Field value={v} onChange={(x) => set(i, x)} path={[...path, String(i)]} tpl={itemTpl} locked={locked} />
              </div>
            ) : (
              <>
                <p className="tag mb-3 text-muted">
                  {label(name)} {i + 1}
                </p>
                <Field value={v} onChange={(x) => set(i, x)} path={[...path, String(i)]} tpl={itemTpl} locked={locked} />
              </>
            )}
            <div className={`flex gap-1 text-[13px] ${simple ? "pt-2" : "mt-3 justify-end"}`}>
              {!fixed && (
                <>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-2 py-1 text-muted hover:text-ink disabled:opacity-30" aria-label="Naikkan">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="px-2 py-1 text-muted hover:text-ink disabled:opacity-30" aria-label="Turunkan">
                    ↓
                  </button>
                  <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="px-2 py-1 text-danger hover:underline">
                    Hapus
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {!fixed && (
          <button
            type="button"
            onClick={() => onChange([...value, blank(itemTpl)])}
            className="justify-self-start rounded-[2px] border border-line px-3.5 py-2 text-[13px] hover:border-accent hover:text-accent"
          >
            + Tambah {label(name).toLowerCase()}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {Object.entries(value).map(([k, v]) => (
        <div key={k}>
          <label className="tag mb-1.5 block text-muted">
            {label(k)}
            {locked === k ? " (terkunci)" : ""}
          </label>
          <Field
            value={v}
            onChange={(x) => onChange({ ...value, [k]: x })}
            path={[...path, k]}
            tpl={(tpl as { [k: string]: Json })[k] ?? v}
            locked={locked}
          />
        </div>
      ))}
    </div>
  );
}

export function ContentEditor({
  contentKey,
  initial,
  locked,
  resetAction,
  isEdited,
}: {
  contentKey: string;
  initial: Json;
  locked?: string;
  resetAction: () => Promise<void>;
  isEdited: boolean;
}) {
  const [value, setValue] = useState<Json>(() => clone(initial));
  const [state, action, pending] = useActionState<CmsState, FormData>(saveSection.bind(null, contentKey), {});

  return (
    <div>
      <form action={action}>
        <input type="hidden" name="json" value={JSON.stringify(value)} />
        <Field value={value} onChange={setValue} path={[]} tpl={initial} locked={locked} />

        <div className="sticky bottom-0 -mx-5 mt-10 flex flex-wrap items-center gap-4 border-t border-line bg-paper/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
          <button
            type="submit"
            disabled={pending}
            className="rounded-[2px] bg-accent px-5 py-3 text-[15px] text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
          >
            {pending ? "Menyimpan…" : "Simpan perubahan"}
          </button>
          <span role="status" aria-live="polite" className="text-[14px]">
            {state.ok ? <span className="text-[#166534]">Tersimpan. Website sudah diperbarui.</span> : null}
            {state.error ? <span className="text-danger">{state.error}</span> : null}
          </span>
        </div>
      </form>

      {isEdited ? (
        <form action={resetAction} className="mt-6">
          <button
            className="text-[14px] text-muted underline underline-offset-4 hover:text-danger"
            onClick={(e) => {
              if (!confirm("Kembalikan bagian ini ke teks bawaan? Perubahan Anda akan hilang.")) e.preventDefault();
            }}
          >
            Kembalikan ke teks bawaan
          </button>
        </form>
      ) : null}
    </div>
  );
}
