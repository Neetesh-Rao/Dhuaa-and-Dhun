import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "धुआँ और धुन — Dhuaan Aur Dhun",
  description:
    "A living digital poster: street-side smoke, old music and people listening together.",
};

export const viewport: Viewport = {
  themeColor: "#1a0d0b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#1a0d0b] text-white antialiased selection:bg-[#e2432f]/40">
        {children}
      </body>
    </html>
  );
}
