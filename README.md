# PT. Meta Inti Persada — Website

Website company profile + sistem Request for Quotation (RFQ), dibangun dengan **Next.js (App Router)**, **Tailwind CSS v4**, dan **Postgres via Drizzle ORM**.

## Menjalankan

```bash
npm install
cp .env.example .env.local     # isi ADMIN_PASSWORD
npm run dev                    # http://localhost:3000
```

Tanpa `DATABASE_URL`, data RFQ otomatis disimpan di Postgres lokal (PGlite, berjalan di dalam Node) pada folder `.data/` — tidak perlu install database apa pun untuk development.

## Halaman

| Rute            | Isi                                                                          |
| --------------- | ---------------------------------------------------------------------------- |
| `/`             | Profil, visi-misi, 4 pilar bisnis, casing spacer, PLTS, proses, nilai, sektor |
| `/produk`       | Katalog lini produk per pilar, tiap item bisa langsung "Minta harga"          |
| `/rfq`          | Form RFQ (multi-item) → tersimpan di database, mendapat nomor referensi       |
| `/admin`        | Daftar RFQ masuk, filter & ubah status (dilindungi `ADMIN_PASSWORD`)          |

## Database (produksi)

1. Buat database Postgres (mis. Neon, Supabase, Railway).
2. Set `DATABASE_URL` (sertakan `?sslmode=require` bila diminta provider).
3. Tabel dibuat otomatis saat RFQ pertama masuk. Alternatif: `npm run db:push`.

Schema ada di `src/db/schema.ts`.

## Deploy ke Vercel

1. Push repo ke GitHub → Import di Vercel.
2. Environment variables: `DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`.
3. Deploy. (Di Vercel wajib memakai `DATABASE_URL` — filesystem serverless tidak permanen.)

## Mengubah konten

Semua teks dari company profile ada di **`src/content/company.ts`** — ubah di situ, semua halaman ikut berubah.

## Struktur

```
src/
  app/            halaman (App Router), server actions, sitemap, robots
  components/     Header, Footer, Logo, form RFQ, UI kecil
  components/drawings/   ilustrasi teknik SVG (casing spacer, crossing, PLTS)
  content/        konten perusahaan
  db/             schema & koneksi Drizzle
  lib/auth.ts     sesi admin (cookie HMAC, httpOnly)
  fonts/          Instrument Sans & IBM Plex Mono (OFL, self-hosted)
```

## Catatan desain

- Ilustrasi berupa gambar teknik SVG orisinal — tanpa stock photo, ringan, tajam di semua layar.
- Logo "M" direkonstruksi sebagai vektor (`src/components/Logo.tsx`, `public/brand/logo-mark.svg`). Jika ada file logo resmi (SVG/AI), ganti di dua tempat tersebut.
- Foto proyek/gudang asli milik perusahaan akan menambah kredibilitas; bisa ditambahkan di section Profil atau Casing Spacer.
