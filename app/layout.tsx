import React from "react";
import "@/app/globals.css";

export const metadata = {
  title: "Incident Tracker",
  description: "Production-ready incident management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
