import "@web/theme/styles.css";
import "@workspace/ui/globals.css";

import { Navbar } from "@web/components/navbar";
import { Providers } from "@web/components/providers";
import { ToastContainer } from "@web/components/toast-container";
import { inter, spaceGrotesk } from "@web/theme/fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opti Parquet - Optimisez votre pose de parquet",
  description:
    "Outil gratuit de calepinage de parquet pour optimiser votre pose à l'anglaise. Réduisez les chutes et visualisez votre disposition.",
  keywords: [
    "parquet",
    "calepinage",
    "pose parquet",
    "optimisation parquet",
    "calcul parquet",
    "pose à l'anglaise",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
