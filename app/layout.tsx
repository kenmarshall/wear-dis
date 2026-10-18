import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import { STRINGS } from "@/lib/strings";
import "./tokens.css";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: STRINGS.meta.title,
  description: STRINGS.meta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
