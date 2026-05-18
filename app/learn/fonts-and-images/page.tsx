// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 9 — Fonts & Images
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • next/font/google    — downloads Google Fonts at build time, self-hosted
//                           on your domain; zero layout shift, no Google requests
//   • font.className      — apply the font to any element via its generated class
//   • font.variable       — expose the font as a CSS custom property for Tailwind
//   • next/image (local)  — import the file; width/height inferred automatically
//   • next/image (remote) — requires remotePatterns in next.config.ts; width/height
//                           must be specified manually
//   • fill                — image fills its positioned parent container
//   • priority            — disables lazy loading for above-the-fold images (LCP)
//   • sizes               — helps browser pick the right image variant per breakpoint
//
// IMPORTANT — font constructors run at MODULE LEVEL (top of file), never inside
// a component function. Next.js processes them at build time, not runtime.
//
// This PAGE is a Server Component (no "use client").
// Fonts and Images are both handled at build/request time on the server.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Image from "next/image";
import { Fira_Code, Playfair_Display } from "next/font/google";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
// Local image import — Next.js reads width/height from the file at build time
import nextLogo from "../../../public/next.svg";

export const metadata: Metadata = { title: "Fonts & Images" };

// ── Font setup — MODULE LEVEL (required) ──────────────────────────────────
// next/font/google downloads font files at build time and serves them from
// your own domain. No runtime request to Google, no CORS issues.
// display: "swap" — shows fallback text until the font loads (prevents invisible text)
const playfair = Playfair_Display({
  subsets: ["latin"],  // only download the Latin character subset
  weight: ["400", "700"],
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function FontsAndImagesPage() {
  return (
    <ChapterLayout
      slug="fonts-and-images"
      title="Fonts & Images"
      docsHref="https://nextjs.org/docs/app/getting-started/fonts"
    >
      {/* ── Demo 1: next/font/google ────────────────────────────────────── */}
      <Demo concept="next/font/google" title="Google Fonts — self-hosted at build time, zero layout shift">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Next.js downloads font files at build time and serves them from your own domain.
          No runtime request to Google, no CORS issues, and <strong>zero layout shift</strong> —
          the browser never needs to swap fonts after the page loads.
        </p>
        <div className="space-y-4">
          {/* Apply the font by spreading font.className onto any element */}
          <div>
            <p className="text-xs text-zinc-400 mb-1 font-mono">Playfair Display (serif)</p>
            <p className={`${playfair.className} text-2xl text-zinc-800 dark:text-zinc-100`}>
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 mb-1 font-mono">Fira Code (monospace)</p>
            <p className={`${firaCode.className} text-sm text-zinc-700 dark:text-zinc-300`}>
              {"const greet = (name: string) => `Hello, ${name}!`;"}
            </p>
          </div>
        </div>
        <CodeBlock>{`// ── Two ways to use next/font/google ─────────────────────────

// Method 1: className — apply directly to an element
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],  // reduce download size — only include needed chars
  weight: ["400", "700"],
  display: "swap",     // show fallback until font loads (prevents FOIT)
});

<p className={playfair.className}>Styled with Playfair Display</p>

// Method 2: variable — expose as CSS custom property (useful with Tailwind)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Add the variable class to <html> so all children can access the CSS var:
<html className={inter.variable}>…</html>

// Then in globals.css:  body { font-family: var(--font-inter); }
// Or in tailwind.config.ts:  fontFamily: { inter: ["var(--font-inter)"] }`}
        </CodeBlock>
        <Callout kind="rule">
          Call font constructors at the <strong>module level</strong> (top of the file),
          never inside a component function. Next.js processes them at build time.
          Calling them inside a component would re-run on every render and defeat the optimization.
        </Callout>
      </Demo>

      {/* ── Demo 2: next/image — local file ────────────────────────────── */}
      <Demo concept="next/image — local" title="Local images: import the file — width/height inferred automatically">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Static import gives TypeScript the width/height at build time.
              className="dark:invert" inverts the SVG colors in dark mode. */}
          <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 inline-block">
            <Image
              src={nextLogo}
              alt="Next.js logo"
              width={120}
              height={40}
              className="dark:invert"
            />
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono space-y-1">
            <p className="text-zinc-400">// local SVG via static import</p>
            <p>import logo from &quot;../public/next.svg&quot;</p>
            <p className="pt-1">&lt;Image src={"{logo}"} alt=&quot;…&quot; /&gt;</p>
            <p className="pt-1 text-green-500">width + height inferred from file ✓</p>
          </div>
        </div>
        <CodeBlock>{`// Statically import the image file — TypeScript knows width/height at build time
import nextLogo from "../public/next.svg";

<Image
  src={nextLogo}    // ← static import (not a string URL)
  alt="Next.js logo"
  width={120}       // optional with static import — inferred from file
  height={40}
  priority          // add for above-the-fold images to improve LCP
/>`}
        </CodeBlock>
        <Callout kind="tip">
          Importing a local image statically gives TypeScript the width and height — you don&apos;t
          need to specify them manually (though you may override them).
          Next.js also generates a low-quality blur placeholder automatically for local images.
        </Callout>
      </Demo>

      {/* ── Demo 3: next/image — remote URL ────────────────────────────── */}
      <Demo concept="next/image — remote" title="Remote images: add the domain to next.config.ts first">
        <div className="space-y-3">
          {/* Remote images from picsum.photos — allowed via remotePatterns in next.config.ts */}
          <div className="flex gap-3 flex-wrap">
            {[200, 201, 202].map((seed) => (
              <div key={seed} className="rounded-xl overflow-hidden">
                <Image
                  src={`https://picsum.photos/seed/${seed}/160/100`}
                  alt={`Random photo ${seed}`}
                  width={160}   // required for remote images — no static import to infer from
                  height={100}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <CodeBlock>{`// Step 1 — whitelist the domain in next.config.ts:
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      // Add one entry per external image domain you use
    ],
  },
};

// Step 2 — use <Image> with a string URL:
<Image
  src="https://picsum.photos/seed/200/160/100"
  alt="Random photo"
  width={160}   // REQUIRED for remote — can't be inferred
  height={100}
/>`}
          </CodeBlock>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Next.js automatically proxies, resizes, and converts remote images to WebP/AVIF
            on the first request, then caches them for subsequent visitors.
          </p>
        </div>
      </Demo>

      {/* ── Demo 4: Key props ──────────────────────────────────────────── */}
      <Demo concept="Key props" title="fill, priority, sizes — the three you'll use most">
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 space-y-2">
            {/* fill — image fills a positioned parent */}
            <p>
              <code className="bg-zinc-100 dark:bg-zinc-700 px-1 rounded font-mono text-xs">fill</code>{" "}
              — image fills its parent container. Parent must have{" "}
              <code className="bg-zinc-100 dark:bg-zinc-700 px-1 rounded font-mono text-xs">position: relative</code>{" "}
              and explicit dimensions. Great for hero sections and aspect-ratio crops.
            </p>
            {/* priority — skip lazy loading for LCP images */}
            <p>
              <code className="bg-zinc-100 dark:bg-zinc-700 px-1 rounded font-mono text-xs">priority</code>{" "}
              — disables lazy loading. Use for above-the-fold hero images to improve LCP
              (Largest Contentful Paint) score.
            </p>
            {/* sizes — hints for responsive image selection */}
            <p>
              <code className="bg-zinc-100 dark:bg-zinc-700 px-1 rounded font-mono text-xs">sizes</code>{" "}
              — tells the browser which image variant to download at each viewport width.
              Saves significant bandwidth on mobile.
            </p>
          </div>
        </div>
        <CodeBlock>{`// Hero image — fill parent, load eagerly, hint sizes per breakpoint
<div className="relative h-64 w-full">   {/* parent must be relative + sized */}
  <Image
    src={hero}
    alt="Hero"
    fill                                 {/* fills the parent div */}
    priority                             {/* eager load — improves LCP */}
    sizes="(max-width: 768px) 100vw, 50vw" {/* mobile=full, desktop=half */}
    className="object-cover"            {/* CSS object-fit on the <img> */}
  />
</div>`}
        </CodeBlock>
        <Callout kind="warning">
          Never use a plain <code>&lt;img&gt;</code> tag for images you control.{" "}
          <code>&lt;Image&gt;</code> handles lazy loading, automatic WebP/AVIF conversion,
          responsive sizing, and blur placeholders automatically.
          A raw <code>&lt;img&gt;</code> does none of that.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "<strong>next/font/google</strong>: call the font constructor at module level (top of file), pass <code>subsets</code> + <code>weight</code> + <code>display: 'swap'</code>. Fonts are downloaded at build time and self-hosted — no Google requests at runtime.",
        "Apply fonts via <code>font.className</code> on any element, or via <code>font.variable</code> as a CSS custom property. The <code>variable</code> approach works well with Tailwind's <code>fontFamily</code> config.",
        "Font constructors must be called at <strong>module level</strong>, not inside component functions. They run at build time, not on every render.",
        "<strong>next/image local</strong>: <code>import img from './file.png'</code> — Next.js infers width/height. Blur placeholder generated automatically.",
        "<strong>next/image remote</strong>: must whitelist the domain in <code>next.config.ts</code> under <code>images.remotePatterns</code>. Must provide <code>width</code> and <code>height</code> manually.",
        "Use <code>priority</code> on above-the-fold images (hero, LCP element) to disable lazy loading. Use <code>fill</code> on images that should stretch to fill a positioned parent. Use <code>sizes</code> to save bandwidth on mobile.",
        "Always use <code>&lt;Image&gt;</code> from <code>next/image</code> instead of <code>&lt;img&gt;</code> — it handles lazy loading, WebP/AVIF conversion, responsive sizing, and blur placeholders automatically.",
      ]} />
    </ChapterLayout>
  );
}
