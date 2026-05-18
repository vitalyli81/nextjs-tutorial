// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 10 — Metadata
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • metadata export      — static const; Next.js reads it and injects <title>,
//                            <meta>, <link> tags into <head> automatically
//   • Metadata type        — import from "next"; enables IDE auto-complete for
//                            all metadata fields (openGraph, robots, icons, etc.)
//   • title template       — layout sets a template with %s; child pages fill %s
//   • generateMetadata()   — async function for dynamic metadata (reads params/DB)
//   • opengraph-image.tsx  — file convention for programmatic OG image generation
//   • Deduplication        — generateMetadata() and page.tsx share the fetch cache;
//                            same DB call is deduplicated automatically
//
// This PAGE is a Server Component (no "use client").
// GenerateMetadataDemo is a Client Component — it uses useRouter to navigate
// to the demo-page with user-typed title/description as query params.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { GenerateMetadataDemo } from "./_components/GenerateMetadataDemo";

// Static metadata for THIS page.
// Next.js reads this at build time and injects the tags into <head>.
// The title template in app/layout.tsx turns "Metadata" → "Metadata | Next.js Tutorial".
export const metadata: Metadata = {
  title: "Metadata",
  description: "Static metadata export — title, description, openGraph, and more.",
};

export default function MetadataPage() {
  return (
    <ChapterLayout
      slug="metadata"
      title="Metadata"
      docsHref="https://nextjs.org/docs/app/getting-started/metadata-and-og-images"
    >
      {/* ── Demo 1: Static metadata export ────────────────────────────── */}
      <Demo concept="Static metadata export" title="Export a metadata object — Next.js injects it into <head>">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          When metadata is known at build time, export a{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">metadata</code> const
          from <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">page.tsx</code> or{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">layout.tsx</code>.
          Next.js reads it and generates the correct{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;title&gt;</code>,{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;meta&gt;</code>, and{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;link&gt;</code> tags
          automatically. This page uses it — check the browser tab.
        </p>
        <CodeBlock>{`// page.tsx or layout.tsx — exported const, typed as Metadata from "next"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metadata",                       // → <title>Metadata | Next.js Learn</title>
  description: "Learn about Next.js metadata",  // → <meta name="description" …>
  openGraph: {
    title: "Metadata | My App",
    description: "…",
    images: [{ url: "/og-image.png" }],   // social share card image
    type: "website",
  },
  robots: { index: true, follow: true },   // search engine crawl instructions
  icons: { icon: "/favicon.ico" },         // → <link rel="icon" …>
};
// You NEVER import or call metadata yourself.
// Next.js reads the export at build/request time and injects the tags into <head>.`}
        </CodeBlock>
        <Callout kind="rule">
          Always type <code>metadata</code> as <code>Metadata</code> from{" "}
          <code>&quot;next&quot;</code> — it enables IDE auto-complete for every field
          and catches typos at compile time.
          You never import or call <code>metadata</code> yourself — Next.js reads it automatically.
        </Callout>
      </Demo>

      {/* ── Demo 2: Title template ─────────────────────────────────────── */}
      <Demo concept="Title template" title="Layout sets the template — child pages fill in %s">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Define a <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">template</code> in a
          layout so every child page automatically gets a consistent suffix.
          Check the browser tab on any chapter — the pattern is{" "}
          <strong>&quot;Chapter | Next.js Tutorial&quot;</strong>.
        </p>
        <CodeBlock>{`// app/layout.tsx — sets the template for the ENTIRE app
export const metadata: Metadata = {
  title: {
    template: "%s | Next.js Tutorial",  // %s is replaced by each child's title
    default:  "Next.js Tutorial",       // shown when no child page sets a title
  },
};

// app/learn/metadata/page.tsx — child page supplies %s
export const metadata: Metadata = { title: "Metadata" };

// Result rendered in <head>:
// <title>Metadata | Next.js Tutorial</title>

// A layout can also override the template for its subtree:
// app/blog/layout.tsx
export const metadata: Metadata = {
  title: { template: "%s | Blog", default: "Blog" },
};
// blog pages will now use "Post Title | Blog" instead of "Post Title | Next.js Tutorial"`}
        </CodeBlock>
        <Callout kind="tip">
          Templates cascade — a child layout can override the parent&apos;s template
          for its own subtree. The closest ancestor wins.
        </Callout>
      </Demo>

      {/* ── Demo 3: generateMetadata() — dynamic metadata ─────────────── */}
      <Demo concept="generateMetadata()" title="Dynamic metadata — async function, can fetch from DB or params">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          When metadata depends on URL params or data fetched at request time, export an async{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">generateMetadata</code> function.
          Try the live demo below — type a title and description, then open the demo page
          to see them injected into <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;head&gt;</code>:
        </p>

        {/* GenerateMetadataDemo is a Client Component — uses useRouter + useState
            to navigate to the demo-page with user-typed values as searchParams */}
        <GenerateMetadataDemo />

        <CodeBlock>{`// app/blog/[slug]/page.tsx — dynamic route with DB-driven metadata
import type { Metadata } from "next";

// Same Props type shared by both generateMetadata and the page component
type Props = { params: Promise<{ slug: string }> };

// Runs on the server before the page renders — can await anything
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;   // must await params in Next.js 15
  const post = await db.post.findUnique({ where: { slug } });

  return {
    title:       post?.title ?? "Post not found",
    description: post?.excerpt,
    openGraph: { images: [{ url: post?.coverImage }] },
  };
}

// page component — same params, same data — fetch is deduplicated automatically
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } }); // NOT re-fetched
  return <article>{post?.title}</article>;
}`}
        </CodeBlock>
        <Callout kind="rule">
          <code>generateMetadata()</code> and the page component share the same fetch cache —
          if both call the same database function, the DB is only hit <strong>once</strong>.
          Next.js deduplicates identical requests automatically within a single render.
        </Callout>
      </Demo>

      {/* ── Demo 4: OpenGraph image generation ────────────────────────── */}
      <Demo concept="OpenGraph image" title="Programmatically generate social share images with ImageResponse">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Create an{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">opengraph-image.tsx</code>{" "}
          file next to your page — Next.js generates a PNG from JSX at build time
          (or per-request for dynamic routes). The image URL is automatically wired up
          as the <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">og:image</code> tag.
        </p>
        <CodeBlock>{`// app/blog/[slug]/opengraph-image.tsx — file convention for OG images
import { ImageResponse } from "next/og";

// Dimensions for the generated PNG
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Receives the same params as page.tsx
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });

  // Write JSX — Next.js renders it to a PNG using @vercel/og under the hood
  return new ImageResponse(
    <div style={{ display: "flex", background: "#000", color: "#fff",
                  width: "100%", height: "100%", padding: "60px" }}>
      <h1 style={{ fontSize: 72 }}>{post?.title}</h1>
    </div>,
    size
  );
}
// Resulting URL: /blog/my-post/opengraph-image
// Auto-injected into <head>: <meta property="og:image" content="…" />`}
        </CodeBlock>
        <Callout kind="tip">
          The generated image URL is automatically added to the page&apos;s{" "}
          <code>og:image</code> meta tag — no manual wiring in <code>generateMetadata</code> needed.
          Works for Twitter cards (<code>twitter-image.tsx</code>) too.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "Export <code>const metadata: Metadata = {…}</code> from any <code>page.tsx</code> or <code>layout.tsx</code> — Next.js automatically injects <code>&lt;title&gt;</code>, <code>&lt;meta&gt;</code>, and <code>&lt;link&gt;</code> tags. Always type it as <code>Metadata</code> from <code>'next'</code>.",
        "You never import or call <code>metadata</code> yourself — Next.js reads it at build/request time. It's a framework contract, not a function.",
        "<strong>Title template</strong>: set <code>title: { template: '%s | AppName', default: 'AppName' }</code> in a layout. Child pages provide the <code>%s</code> part. Templates cascade — closest ancestor wins.",
        "When metadata depends on URL params or DB data, export <code>async function generateMetadata({ params, searchParams }): Promise&lt;Metadata&gt;</code> instead of the static const.",
        "<code>generateMetadata()</code> and the page component share the <strong>same fetch cache</strong>: if both query the same data, the DB is only hit once — no duplicate requests.",
        "File convention <code>opengraph-image.tsx</code> next to a page generates a PNG from JSX using <code>ImageResponse</code> from <code>'next/og'</code>. The URL is auto-wired as <code>og:image</code> — no manual metadata entry needed.",
        "Metadata is SEO-critical and must be server-rendered — <code>metadata</code> and <code>generateMetadata</code> only work in Server Components (no <code>'use client'</code> in the same file).",
      ]} />
    </ChapterLayout>
  );
}
