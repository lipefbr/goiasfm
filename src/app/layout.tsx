import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TV Goiás - Notícias do tamanho da verdade",
  description: "Portal de notícias TV Goiás. Cobertura completa de política, economia, cidades, polícia, educação, esporte e mais, 24 horas no ar.",
  keywords: ["TV Goiás", "notícias", "Goiás", "Goiânia", "política", "economia", "esporte"],
  authors: [{ name: "TV Goiás" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "TV Goiás - Notícias do tamanho da verdade",
    description: "Portal de notícias do estado de Goiás",
    siteName: "TV Goiás",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
