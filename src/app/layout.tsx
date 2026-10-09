import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/cms";
import "./globals.css";

const instrument = localFont({
  src: [
    {
      path: "../fonts/InstrumentSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/InstrumentSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/InstrumentSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = localFont({
  src: [
    {
      path: "../fonts/IBMPlexMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getContent("company");
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "PT. Meta Inti Persada — Pengadaan Industri, Oil & Gas, dan EBT",
      template: "%s — PT. Meta Inti Persada",
    },
    description:
      "Mitra pengadaan peralatan industri dan Oil & Gas di Indonesia: casing spacer, pipeline accessories, valve & flange, peralatan teknik, dan komponen PLTS.",
    keywords: [
      "casing spacer",
      "casing insulator",
      "pengadaan migas",
      "procurement oil and gas",
      "pipeline accessories",
      "valve flange gasket",
      "komponen PLTS",
      "supplier industri Jakarta",
    ],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: company.name,
      title: "PT. Meta Inti Persada",
      description: company.positioning,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#1b2533",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${instrument.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh" suppressHydrationWarning>
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten
        </a>
        <Header />
        <main id="konten">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
