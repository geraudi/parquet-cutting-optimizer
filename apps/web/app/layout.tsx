import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@web/components/providers";
import { ToastContainer } from "@web/components/toast-container";
import Image from "next/image";
import Link from "next/link";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mr-4 hidden md:flex">
              <Link href="/" className="mx-6 flex items-center space-x-2">
                <Image
                  src="/parquet-logo-2.svg"
                  alt="Parquet logo"
                  width={32}
                  height={32}
                />
                <span className="hidden font-bold sm:inline-block">
                  Parquet layout
                </span>
              </Link>
            </div>
          </header>

          <main className="flex min-h-screen flex-col items-center justify-between">
            {children}
          </main>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
