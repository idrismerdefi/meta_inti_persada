"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitRfq, type RfqState, type RfqValues } from "@/app/rfq/actions";
import { Arrow } from "./ui";

const initial: RfqState = { status: "idle" };

type Row = { key: number; description: string; qty: string; unit: string };

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[14px]">
      <span>{children}</span>
      {optional ? <span className="tag text-[10px] text-muted">Opsional</span> : null}
    </label>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] text-danger">
      {msg}
    </p>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="link-arrow w-full justify-center rounded-[2px] bg-ink px-6 py-4 text-[16px] text-white transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Mengirim…" : "Kirim RFQ"}
      {pending ? null : <Arrow />}
    </button>
  );
}

export function RfqForm({
  defaultCategories = [],
  defaultItem = "",
  email,
  categories: rfqCategoryOptions,
  sectors: rfqSectorOptions,
}: {
  defaultCategories?: string[];
  defaultItem?: string;
  email: string;
  categories: string[];
  sectors: string[];
}) {
  const [state, action] = useActionState(submitRfq, initial);

  const v: Partial<RfqValues> = state.status === "error" ? state.values : {};
  const err = state.status === "error" ? state.fieldErrors : {};

  const startRows: Row[] =
    v.items && v.items.length > 0
      ? v.items.map((i, k) => ({ key: k, ...i }))
      : [{ key: 0, description: defaultItem, qty: "", unit: "" }];
  const [rows, setRows] = useState<Row[]>(startRows);
  const [nextKey, setNextKey] = useState(startRows.length);

  if (state.status === "success") {
    return (
      <div className="border border-line bg-white p-8 md:p-12" role="status" aria-live="polite">
        <p className="tag text-brand">RFQ diterima</p>
        <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-[-0.02em]">
          Terima kasih. Permintaan Anda sudah tercatat.
        </h2>
        <dl className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
          <div className="bg-paper p-5">
            <dt className="tag text-muted">Nomor referensi</dt>
            <dd className="mt-2 font-mono text-[20px]">{state.refCode}</dd>
          </div>
          <div className="bg-paper p-5">
            <dt className="tag text-muted">Perusahaan</dt>
            <dd className="mt-2 text-[17px]">{state.company}</dd>
          </div>
        </dl>
        <p className="mt-8 max-w-[56ch] text-[16px] leading-relaxed text-muted">
          Tim kami akan menghubungi <span className="text-ink">{state.email}</span> untuk konfirmasi spesifikasi
          dan penawaran. Sebutkan nomor referensi di atas bila Anda menghubungi kami di{" "}
          <a className="text-brand underline underline-offset-4" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
        <a href="/rfq" className="link-arrow mt-8 text-[15px] text-brand">
          Kirim RFQ lain
          <Arrow />
        </a>
      </div>
    );
  }

  const selectedCats = v.categories ?? defaultCategories;

  return (
    <form action={action} noValidate className="border border-line bg-white" aria-describedby="rfq-status">
      {state.status === "error" ? (
        <div id="rfq-status" role="alert" className="border-b border-danger/30 bg-danger-tint px-6 py-4 text-[14px] text-danger md:px-10">
          {state.message}
        </div>
      ) : null}

      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="border-b border-line px-6 py-8 md:px-10 md:py-10">
        <legend className="tag float-left mb-6 w-full text-muted">
          <span className="text-brand">01</span>&nbsp;&nbsp;Kontak
        </legend>
        <div className="clear-both grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Nama lengkap</Label>
            <input id="name" name="name" className="field" autoComplete="name" defaultValue={v.name} aria-invalid={!!err.name} aria-describedby="e-name" required />
            <FieldError id="e-name" msg={err.name} />
          </div>
          <div>
            <Label htmlFor="position" optional>Jabatan</Label>
            <input id="position" name="position" className="field" autoComplete="organization-title" defaultValue={v.position} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="company">Perusahaan</Label>
            <input id="company" name="company" className="field" autoComplete="organization" defaultValue={v.company} aria-invalid={!!err.company} aria-describedby="e-company" required />
            <FieldError id="e-company" msg={err.company} />
          </div>
          <div>
            <Label htmlFor="email">Email kerja</Label>
            <input id="email" name="email" type="email" className="field" autoComplete="email" defaultValue={v.email} aria-invalid={!!err.email} aria-describedby="e-email" required />
            <FieldError id="e-email" msg={err.email} />
          </div>
          <div>
            <Label htmlFor="phone">Telepon / WhatsApp</Label>
            <input id="phone" name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="+62 …" defaultValue={v.phone} aria-invalid={!!err.phone} aria-describedby="e-phone" required />
            <FieldError id="e-phone" msg={err.phone} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-b border-line px-6 py-8 md:px-10 md:py-10">
        <legend className="tag float-left mb-6 w-full text-muted">
          <span className="text-brand">02</span>&nbsp;&nbsp;Kebutuhan
        </legend>
        <div className="clear-both grid gap-6">
          <div>
            <Label htmlFor="sector">Sektor industri</Label>
            <select id="sector" name="sector" className="field select-chevron" defaultValue={v.sector ?? ""} aria-invalid={!!err.sector} aria-describedby="e-sector" required>
              <option value="" disabled>
                Pilih sektor
              </option>
              {rfqSectorOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <FieldError id="e-sector" msg={err.sector} />
          </div>

          <div>
            <p className="mb-3 text-[14px]">
              Kategori produk <span className="tag ml-2 text-[10px] text-muted">Boleh lebih dari satu</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {rfqCategoryOptions.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input type="checkbox" name="categories" value={c} defaultChecked={selectedCats.includes(c)} className="peer sr-only" />
                  <span className="inline-block rounded-full border border-line px-3.5 py-2 text-[14px] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-bright hover:border-ink/50">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[14px]">Daftar item</p>
            <div className="hidden grid-cols-[1fr_5.5rem_7.5rem_2.5rem] gap-3 pb-2 sm:grid">
              <span className="tag text-[10px] text-muted">Deskripsi / spesifikasi</span>
              <span className="tag text-[10px] text-muted">Qty</span>
              <span className="tag text-[10px] text-muted">Satuan</span>
              <span />
            </div>
            <ol className="grid gap-3">
              {rows.map((r, i) => (
                <li key={r.key} className="grid grid-cols-[1fr_1fr_2.5rem] gap-3 border-b border-line pb-3 sm:grid-cols-[1fr_5.5rem_7.5rem_2.5rem] sm:border-0 sm:pb-0">
                  <input
                    name="item_description"
                    aria-label={`Deskripsi item ${i + 1}`}
                    className="field col-span-3 sm:col-span-1"
                    placeholder={i === 0 ? "mis. Casing spacer 12\" carrier, 20\" casing, HDPE" : "Deskripsi & spesifikasi"}
                    defaultValue={v.items?.[i]?.description ?? r.description}
                    aria-invalid={i === 0 && !!err.items}
                  />
                  <input name="item_qty" aria-label={`Kuantitas item ${i + 1}`} className="field" placeholder="Qty" inputMode="decimal" defaultValue={v.items?.[i]?.qty ?? r.qty} />
                  <input name="item_unit" aria-label={`Satuan item ${i + 1}`} className="field" placeholder="pcs / set / m" defaultValue={v.items?.[i]?.unit ?? r.unit} />
                  <button
                    type="button"
                    onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.key !== r.key) : rs))}
                    disabled={rows.length === 1}
                    className="flex h-full min-h-11 items-center justify-center rounded-[2px] border border-line text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
                    aria-label={`Hapus item ${i + 1}`}
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </button>
                </li>
              ))}
            </ol>
            <FieldError id="e-items" msg={err.items} />
            <button
              type="button"
              onClick={() => {
                setRows((rs) => [...rs, { key: nextKey, description: "", qty: "", unit: "" }]);
                setNextKey((k) => k + 1);
              }}
              disabled={rows.length >= 30}
              className="mt-4 inline-flex items-center gap-2 text-[14px] text-brand hover:underline hover:underline-offset-4"
            >
              <span aria-hidden="true" className="text-[18px] leading-none">+</span> Tambah item
            </button>
          </div>
        </div>
      </fieldset>

      <fieldset className="border-b border-line px-6 py-8 md:px-10 md:py-10">
        <legend className="tag float-left mb-6 w-full text-muted">
          <span className="text-brand">03</span>&nbsp;&nbsp;Pengiriman &amp; catatan
        </legend>
        <div className="clear-both grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="deliveryLocation" optional>Lokasi pengiriman</Label>
            <input id="deliveryLocation" name="deliveryLocation" className="field" placeholder="Kota / site proyek" defaultValue={v.deliveryLocation} />
          </div>
          <div>
            <Label htmlFor="neededBy" optional>Dibutuhkan paling lambat</Label>
            <input id="neededBy" name="neededBy" type="date" className="field" defaultValue={v.neededBy} aria-invalid={!!err.neededBy} />
            <FieldError id="e-neededBy" msg={err.neededBy} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="notes" optional>Catatan tambahan</Label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="field resize-y"
              placeholder="Standar (API, ASME, ANSI…), merek yang diinginkan, sertifikat yang dibutuhkan, dsb."
              defaultValue={v.notes}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p className="max-w-[44ch] text-[13px] leading-relaxed text-muted">
          Data Anda hanya dipakai untuk menindaklanjuti permintaan penawaran ini.
        </p>
        <Submit />
      </div>
    </form>
  );
}
