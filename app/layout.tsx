// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx — ROOT LAYOUT
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • Root layout      — THE required file at app/ root; wraps every route in
//                        the app with <html> and <body>
//   • Fonts            — next/font/google; Geist fonts self-hosted at build time,
//                        exposed as CSS variables (--font-geist-sans / --font-geist-mono)
//   • globals.css      — imported ONCE here; Tailwind directives + base styles
//   • metadata export  — root-level Metadata; sets title template and default
//                        for all pages; child page metadata overrides %s in template
//   • NavBar           — rendered here so it appears on every route in the app
//
// IMPORTANT: Root layout CANNOT be a Client Component — it must be a Server
// Component because it wraps the entire app. Interactive children (NavBar) use
// "use client" while the layout itself stays on the server.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // loaded ONCE here — applies globally to every route
import { NavBar } from "./_components/NavBar";

// ── Fonts — module level (required by next/font) ──────────────────────────
// next/font/google downloads Geist at build time and serves from your domain.
// variable: "..." → exposes the font as a CSS custom property on <html>.
// Used in globals.css:  font-family: var(--font-geist-sans)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Root metadata — sets the title template for the entire app ────────────
// template: "%s | Next.js Tutorial" — child pages provide %s
// default: "Next.js Tutorial"       — shown if a page exports no title
export const metadata: Metadata = {
  title: {
    template: "%s | Next.js Tutorial",
    default: "Next.js Tutorial",
  },
  description: "Learn Next.js App Router concepts with interactive demos and mini app examples.",
};

// ── Root layout component ─────────────────────────────────────────────────
// children = whatever page.tsx (or nested layout) matches the current URL
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="en" — required for accessibility and SEO
    // Font variables on <html> so all descendants can use var(--font-geist-sans)
    // antialiased — Tailwind utility for smooth font rendering
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* min-h-full + flex-col — lets the body fill the viewport vertically */}
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        {/* NavBar is rendered on EVERY route because it lives in the root layout */}
        <NavBar />
        {/* children is the page content — swapped out per route, layout persists */}
        {children}
      </body>
    </html>
  );
}
