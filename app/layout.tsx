import type { Metadata } from "next";
import "./normalize.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ienai space",
  description: "Technical test for ienai space",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
