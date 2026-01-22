import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZZP Compliance",
  description: "Monitor ZZP naleving met geautomatiseerde risicobeoordelingen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
