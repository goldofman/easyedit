import type { Metadata, Viewport } from "next";
import { Kulim_Park, Syne_Mono } from "next/font/google";
import "./globals.css";
import { Logo } from "./Logo";
import PlausibleProvider from "next-plausible";
import { Toaster } from "@/components/ui/sonner";
import { PlusIcon } from "./components/PlusIcon";

const kulimPark = Kulim_Park({
  variable: "--font-kulim-park",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
});

const syneMono = Syne_Mono({
  variable: "--font-syne-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const title = "EdMyPic - Edit your pictures with an AI using prompts";
const description = "The easiest way to edit images with AI in one prompt.";
const url = "https://edmypic.com/";
const ogimage = "https://edmypic.com/og-image.png";
const sitename = "edmypic.com";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kulimPark.variable} ${syneMono.variable}`}>
      <head>
        <PlausibleProvider domain="edmypic.com" />
      </head>
      <body className="flex min-h-screen w-full flex-col antialiased">
        <header className="relative flex p-4 text-center text-white">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/"
            className="absolute left-1/2 flex grow -translate-x-1/2 items-center gap-2 text-lg max-md:hidden"
          >
            <Logo />
            EdMyPic With AI
          </a>

          <div className="absolute top-4 right-4 flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-8 cursor-pointer items-center gap-2 rounded border-[0.5px] border-gray-700 bg-gray-900 px-3.5 text-gray-200 transition hover:bg-gray-800 md:flex"
            >
              <PlusIcon />
              New Image
            </a>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center overflow-auto pt-4 md:pb-12">
          <div className="w-full">{children}</div>
        </main>

        <Toaster />

        <footer className="flex flex-col items-center p-4 max-md:gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-gray-400">
            Powered by{" "}
            <a
              href="https://x.com/hjevago"
              target="_blank"
              className="text-gray-200 underline underline-offset-2"
            >
              Jevago
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
