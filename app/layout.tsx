// Fix: Added React import to resolve the 'React' namespace for React.ReactNode
import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Distillery Checklists",
  description: "Operational quality and safety controls for distillery staff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}