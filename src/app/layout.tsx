import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../css/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JRA競馬場の週末天気予報",
  description: "日本の主要競馬場の土曜・日曜の天気予報",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
