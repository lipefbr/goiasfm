import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { db } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Busca a URL do favicon customizado no banco (se existir).
// Se não houver, usa o favicon padrão da TV Goiás (/favicon.png).
// Como o metadata é server-side, podemos acessar o banco direto.
async function getFaviconUrl(): Promise<string> {
  try {
    const setting = await db.setting.findUnique({
      where: { id: "favicon_url" },
    });
    return setting?.value || "/favicon.png";
  } catch {
    return "/favicon.png";
  }
}

async function getSiteTitle(): Promise<string> {
  try {
    const setting = await db.setting.findUnique({
      where: { id: "site_title" },
    });
    return setting?.value || "TV Goiás - Notícias do tamanho da verdade";
  } catch {
    return "TV Goiás - Notícias do tamanho da verdade";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getFaviconUrl();
  const title = await getSiteTitle();

  return {
    title,
    description:
      "Portal de notícias TV Goiás. Cobertura completa de política, economia, cidades, polícia, educação, esporte e mais, 24 horas no ar.",
    keywords: [
      "TV Goiás",
      "notícias",
      "Goiás",
      "Goiânia",
      "política",
      "economia",
      "esporte",
    ],
    authors: [{ name: "TV Goiás" }],
    icons: {
      icon: [
        { url: faviconUrl, type: "image/png", sizes: "256x256" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      title,
      description: "Portal de notícias do estado de Goiás",
      siteName: "TV Goiás",
      type: "website",
      images: [
        {
          url: faviconUrl,
          width: 256,
          height: 256,
          alt: "TV Goiás",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description: "Portal de notícias do estado de Goiás",
      images: [faviconUrl],
    },
    manifest: "/site.webmanifest",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Meta tags adicionais para compatibilidade ampla */}
        <meta name="theme-color" content="#C8102E" />
        <meta name="msapplication-TileColor" content="#C8102E" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
