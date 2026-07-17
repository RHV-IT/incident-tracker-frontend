import React from "react";
import "@/app/globals.css";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";
import { InlineScript } from "@/components/inline-script";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
});

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
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript
          html={`(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster closeButton position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
