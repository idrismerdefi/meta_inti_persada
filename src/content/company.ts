/**
 * Seluruh konten website bersumber dari Company Profile PT. Meta Inti Persada.
 * Edit di satu tempat ini; semua halaman membaca dari sini.
 */

export const company = {
  name: "PT. Meta Inti Persada",
  shortName: "Meta Inti Persada",
  abbr: "MIP",
  tagline: "Solusi Terintegrasi, Nilai Berkelanjutan",
  positioning: "Reliable Partner for Industrial & Oil & Gas Procurement Solutions",
  closing: "Building Reliable Industrial Partnerships",
  email: "metaintipersada@gmail.com",
  address: {
    building: "Gedung BEI Tower 1, Level 3 Unit 304",
    area: "SCBD Senayan, Jakarta Selatan 12190",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gedung+Bursa+Efek+Indonesia+Tower+1+SCBD+Jakarta",
  },
  overview: [
    "PT. Meta Inti Persada menyediakan produk dan peralatan berkualitas tinggi untuk mendukung proyek, operasi, perawatan (maintenance), serta pengembangan infrastruktur industri skala nasional.",
    "Kami bertindak sebagai penyambung yang andal antara produsen berkualitas dan kebutuhan proyek spesifik pelanggan melalui manajemen rantai pasok yang responsif.",
  ],
  focus: [
    {
      title: "Trade & Procurement",
      body: "Pemenuhan kebutuhan barang industri secara terarah dan transparan.",
    },
    {
      title: "Pipeline & Migas",
      body: "Spesialisasi pada casing spacer, insulator, dan aksesoris perpipaan.",
    },
    {
      title: "Technical & Energy",
      body: "Peralatan mekanikal, teknik, serta solusi Energi Baru Terbarukan (EBT).",
    },
  ],
  vision:
    "Menjadi perusahaan perdagangan dan pengadaan peralatan industri yang terpercaya, profesional, dan kompetitif untuk kebutuhan industri dan Oil & Gas di Indonesia.",
  mission: [
    "Menyediakan produk berkualitas & sesuai spesifikasi teknis.",
    "Memberikan pelayanan cepat, responsif, dan profesional.",
    "Membangun jaringan vendor & mitra bisnis strategis.",
    "Menjamin ketepatan waktu pengadaan dan kepuasan pelanggan.",
  ],
};

export type Pillar = {
  slug: string;
  code: string;
  title: string;
  summary: string;
  items: string[];
};

export const pillars: Pillar[] = [
  {
    slug: "trade-procurement",
    code: "A",
    title: "Trade & Procurement",
    summary:
      "Peralatan teknik, material proyek, spare parts, safety equipment, serta supplies mechanical & electrical.",
    items: ["Peralatan teknik", "Material proyek", "Spare parts", "Safety equipment", "Mechanical & electrical supplies"],
  },
  {
    slug: "oil-gas",
    code: "B",
    title: "Oil & Gas Equipment",
    summary:
      "Pipeline & piping equipment, casing spacer, insulator, fitting, flange, gasket, dan valve kelas industri.",
    items: ["Pipeline & piping equipment", "Casing spacer", "Insulator", "Fitting & flange", "Gasket", "Valve kelas industri"],
  },
  {
    slug: "technical-supplies",
    code: "C",
    title: "Technical Supplies",
    summary:
      "Mesin industri, workshop equipment, tools, instrumentasi, dan perlengkapan penunjang operasi pabrik.",
    items: ["Mesin industri", "Workshop equipment", "Tools", "Instrumentasi", "Penunjang operasi pabrik"],
  },
  {
    slug: "renewable-energy",
    code: "D",
    title: "Renewable Energy",
    summary:
      "Solar panel, solar inverter, mounting system, komponen elektrikal, dan kebutuhan PLTS industri.",
    items: ["Solar panel", "Solar inverter", "Mounting system", "Komponen elektrikal", "Kebutuhan PLTS industri"],
  },
];

export const casingSpacer = {
  title: "Casing Spacer",
  headline: "Solusi penyangga pipeline crossing",
  body: "Casing Spacer merupakan komponen vital untuk menjaga posisi carrier pipe agar tetap simetris di dalam casing pada aplikasi crossing jalan, rel kereta, atau sungai.",
  applications: ["Crossing jalan", "Crossing rel kereta", "Crossing sungai"],
  benefits: [
    { title: "Proteksi pipa", body: "Mencegah kontak langsung pipe–casing guna menghindari korosi." },
    { title: "Kustomisasi", body: "Ukuran diameter & material disesuaikan dengan kebutuhan proyek." },
    { title: "Pemasangan mudah", body: "Mempercepat proses penarikan pipa saat instalasi." },
  ],
};

export const renewable = {
  eyebrow: "Energy Transition",
  title: "Solusi Energi Terbarukan & PLTS",
  body: [
    "Mendukung komitmen industri menuju transisi energi hijau melalui pengadaan komponen Sistem Pembangkit Listrik Tenaga Surya (PLTS) komersial dan industrial.",
    "Kami menyediakan paket komponen handal mulai dari Solar Panel berkualitas tinggi, Inverter Industri, Mounting Systems, hingga Battery Energy Storage System (BESS).",
  ],
  components: [
    { name: "Solar Panel", note: "Modul berkualitas tinggi" },
    { name: "Inverter Industri", note: "Konversi DC ke AC skala industri" },
    { name: "Mounting Systems", note: "Rangka atap & ground-mount" },
    { name: "BESS", note: "Battery Energy Storage System" },
  ],
};

export type CatalogGroup = {
  id: string;
  title: string;
  pillar: Pillar["slug"];
  intro: string;
  /** Path gambar: "/photos/…" (file di public) atau "/media/ID" (unggahan dari CMS). Kosong = tanpa gambar. */
  image: string;
  lines: { name: string; detail: string }[];
};

export const catalog: CatalogGroup[] = [
  {
    id: "pipeline",
    title: "Pipeline & Pipe Accessories",
    pillar: "oil-gas",
    intro: "Komponen perpipaan untuk jalur migas, crossing, dan fasilitas proses.",
    image: "/photos/catalog-pipeline.jpg",
    lines: [
      { name: "Casing Spacer", detail: "Penyangga carrier pipe di dalam casing pada crossing jalan, rel, dan sungai. Diameter & material sesuai proyek." },
      { name: "Casing Insulator", detail: "Isolasi elektrikal dan proteksi gesekan antar pipa." },
      { name: "Pipe Clamp & Support", detail: "Sistem penopang & klem pengikat pipa industri." },
      { name: "Flange & Gasket", detail: "Penyambung pipa & sealing berkualitas tinggi standar migas." },
      { name: "Valves & Fittings", detail: "Gate, ball, check valve, serta elbow & tee fitting." },
      { name: "Fasteners", detail: "High-tensile bolt & nut khusus lingkungan ekstrem." },
    ],
  },
  {
    id: "mechanical",
    title: "Mechanical Equipment",
    pillar: "technical-supplies",
    intro: "Peralatan penggerak dan transmisi untuk operasi pabrik dan fasilitas.",
    image: "/photos/catalog-mechanical.jpg",
    lines: [
      { name: "Pompa industri", detail: "Untuk proses, utilitas, dan transfer fluida." },
      { name: "Kompresor", detail: "Kebutuhan udara tekan dan gas proses." },
      { name: "Motor penggerak", detail: "Motor listrik untuk peralatan berputar." },
      { name: "Sistem transmisi daya", detail: "Transmisi daya mekanis dan komponennya." },
    ],
  },
  {
    id: "electrical",
    title: "Electrical Supplies",
    pillar: "technical-supplies",
    intro: "Distribusi daya dan perlengkapan kontrol untuk plant dan proyek.",
    image: "/photos/catalog-electrical.jpg",
    lines: [
      { name: "Kabel industri", detail: "Kabel daya, kontrol, dan instrumentasi." },
      { name: "Panel distribusi", detail: "Panel daya dan distribusi listrik." },
      { name: "Breaker", detail: "Proteksi rangkaian listrik." },
      { name: "Transformer", detail: "Trafo distribusi dan daya." },
      { name: "Perlengkapan kontrol", detail: "Komponen kontrol dan otomasi." },
    ],
  },
  {
    id: "instrumentation",
    title: "Instrumentation & Tools",
    pillar: "technical-supplies",
    intro: "Alat ukur, instrumen lapangan, dan perkakas kerja.",
    image: "/photos/catalog-instrumentation.jpg",
    lines: [
      { name: "Alat ukur presisi", detail: "Pengukuran dimensi dan parameter proses." },
      { name: "Sensor tekanan", detail: "Pemantauan tekanan pada jalur proses." },
      { name: "Valve actuator", detail: "Penggerak otomatis untuk valve." },
      { name: "Hand tools", detail: "Perkakas tangan untuk pekerjaan lapangan." },
      { name: "Workshop tools", detail: "Perlengkapan dan mesin bengkel kerja." },
    ],
  },
  {
    id: "renewable",
    title: "Renewable Energy (PLTS)",
    pillar: "renewable-energy",
    intro: "Paket komponen PLTS komersial dan industrial.",
    image: "/photos/catalog-renewable.jpg",
    lines: [
      { name: "Solar panel", detail: "Modul surya berkualitas tinggi." },
      { name: "Solar inverter", detail: "Inverter industri untuk sistem on-grid dan hybrid." },
      { name: "Mounting system", detail: "Struktur pemasangan modul di atap maupun lahan." },
      { name: "Komponen elektrikal", detail: "Kabel, proteksi, dan komponen BOS PLTS." },
      { name: "BESS", detail: "Battery Energy Storage System." },
    ],
  },
  {
    id: "general",
    title: "Trade & General Procurement",
    pillar: "trade-procurement",
    intro: "Kebutuhan umum proyek dan operasi dalam satu pintu pengadaan.",
    image: "/photos/catalog-general.jpg",
    lines: [
      { name: "Peralatan teknik", detail: "Peralatan pendukung pekerjaan teknik." },
      { name: "Material proyek", detail: "Material konstruksi dan instalasi." },
      { name: "Spare parts", detail: "Suku cadang mesin dan peralatan." },
      { name: "Safety equipment", detail: "Alat pelindung diri dan keselamatan kerja." },
    ],
  },
];

export const processSteps = [
  { title: "Identifikasi", body: "Analisis spesifikasi & kebutuhan proyek." },
  { title: "Sourcing", body: "Pemilihan vendor & verifikasi produk." },
  { title: "Quality Check", body: "Inspeksi mutu sebelum pengiriman." },
  { title: "Delivery", body: "Pengiriman tepat waktu ke site proyek." },
];

export const values = [
  { title: "One-Stop Procurement", body: "Satu mitra tunggal untuk berbagai macam kebutuhan barang dan peralatan industri." },
  { title: "Technical Sourcing", body: "Pencarian produk tepat sesuai spesifikasi teknis dan standar manufaktur." },
  { title: "Competitive Offer", body: "Harga kompetitif dengan transparansi tanpa mengorbankan kualitas produk." },
  { title: "Fast Response", body: "Kecepatan dan kepastian respon terhadap Request for Quotation (RFQ)." },
];

export const sectors = [
  {
    name: "Oil & Gas Companies",
    needs: "Pipeline accessories, Casing Spacer, Valve & Flange",
    service: "Supply produk khusus migas",
  },
  {
    name: "EPC & Pipeline Contractors",
    needs: "Material proyek, Piping System, Heavy Fasteners",
    service: "Procurement support proyek",
  },
  {
    name: "Manufacturing & Plant",
    needs: "Industrial Spare Parts, Mechanical & Electrical",
    service: "Kontrak supply perawatan (MRO)",
  },
  {
    name: "Mining & Energy",
    needs: "Tools, Instrumentasi & Komponen Solar PLTS",
    service: "Solusi peralatan & transisi energi",
  },
];

export const rfqCategoryOptions = [
  "Pipeline & Pipe Accessories",
  "Casing Spacer / Insulator",
  "Valve, Flange & Fitting",
  "Mechanical Equipment",
  "Electrical Supplies",
  "Instrumentation & Tools",
  "Renewable Energy / PLTS",
  "Material Proyek & Spare Parts",
  "Safety Equipment",
  "Lainnya",
];

export const rfqSectorOptions = [
  "Oil & Gas",
  "EPC / Pipeline Contractor",
  "Manufacturing & Plant",
  "Mining",
  "Energy / Utilities",
  "Konstruksi",
  "Lainnya",
];
