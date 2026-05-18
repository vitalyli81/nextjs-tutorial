# Next.js App Router — Complete Reference

> Version used in this project: **Next.js 16** · React **19** · TypeScript **5**

---

## Table of Contents

1. [What is the App Router?](#1-what-is-the-app-router)
2. [File-System Routing](#2-file-system-routing)
3. [Special File Conventions](#3-special-file-conventions)
4. [Server Components vs Client Components](#4-server-components-vs-client-components)
5. [Layouts](#5-layouts)
6. [Fetching Data](#6-fetching-data)
7. [Streaming with Suspense](#7-streaming-with-suspense)
8. [Server Actions & Mutations](#8-server-actions--mutations)
9. [Route Handlers (API Routes)](#9-route-handlers-api-routes)
10. [Navigation](#10-navigation)
11. [Dynamic Routes](#11-dynamic-routes)
12. [Error Handling](#12-error-handling)
13. [Metadata & SEO](#13-metadata--seo)
14. [Fonts](#14-fonts)
15. [Images](#15-images)
16. [CSS & Styling](#16-css--styling)
17. [Middleware](#17-middleware)
18. [Configuration (next.config.ts)](#18-configuration-nextconfigts)
19. [Performance Patterns](#19-performance-patterns)
20. [Project Structure in this Repo](#20-project-structure-in-this-repo)

---

## 1. What is the App Router?

The **App Router** (introduced in Next.js 13, stable in 14) is Next.js's primary routing system built on top of React Server Components. It replaces the old `pages/` directory.

Key philosophy:
- Everything is a **Server Component by default** — code runs on the server, HTML ships to the browser.
- Add `"use client"` only where you need interactivity (state, events, browser APIs).
- Collocate files: routes, components, tests, and styles live together in `app/`.

```
Old (Pages Router)   →   New (App Router)
pages/index.tsx      →   app/page.tsx
pages/api/…          →   app/api/…/route.ts
_app.tsx             →   app/layout.tsx
getServerSideProps   →   async Server Component
getStaticProps       →   async Server Component + generateStaticParams
```

---

## 2. File-System Routing

Every **folder** inside `app/` that contains a `page.tsx` becomes a URL route.

```
app/
  page.tsx                    → /
  about/
    page.tsx                  → /about
  blog/
    page.tsx                  → /blog
    [slug]/
      page.tsx                → /blog/:slug          (dynamic)
  dashboard/
    (auth)/                   → route group — NO URL segment
      login/page.tsx          → /dashboard/login
    [...slug]/
      page.tsx                → /dashboard/a/b/c    (catch-all)
    [[...slug]]/
      page.tsx                → /dashboard or /dashboard/a/b (optional catch-all)
```

### Route Groups `(name)`

Wrap folders in parentheses to group routes **without adding a URL segment**. Useful for:
- Sharing a layout between some routes but not others.
- Organizing files without affecting URLs.

```
app/
  (marketing)/
    layout.tsx     ← wraps / and /about, NOT /dashboard
    page.tsx       → /
    about/page.tsx → /about
  (app)/
    layout.tsx     ← wraps /dashboard only
    dashboard/page.tsx → /dashboard
```

### Private Folders `_name`

Prefix a folder with `_` to opt it out of routing entirely. Files inside are never treated as routes.

```
app/
  _components/   ← never a route, even if it has a page.tsx
  _lib/
  _data/
```

---

## 3. Special File Conventions

These filenames have meaning to Next.js. Place them inside any route segment folder.

| File | Purpose |
|---|---|
| `page.tsx` | The UI for this route. Required to make the folder a public route. |
| `layout.tsx` | Wraps child routes. Persists across navigation — does not re-mount. |
| `loading.tsx` | Shown while the route is loading (automatic `<Suspense>` wrapper). |
| `error.tsx` | Caught render errors in this segment. **Must be `"use client"`**. |
| `not-found.tsx` | Rendered when `notFound()` is called. Gets HTTP 404. |
| `global-error.tsx` | Root-level error boundary. Replaces the entire page UI. |
| `route.ts` | API endpoint (Route Handler). Cannot coexist with `page.tsx`. |
| `template.tsx` | Like `layout.tsx` but **re-mounts** on every navigation. |
| `default.tsx` | Fallback for parallel routes when no active state matches. |
| `opengraph-image.tsx` | Generates OG image from JSX using `ImageResponse`. |
| `twitter-image.tsx` | Generates Twitter card image from JSX. |
| `favicon.ico` | App favicon (place at `app/` root). |
| `sitemap.ts` | Returns a `MetadataRoute.Sitemap` array; generates `/sitemap.xml`. |
| `robots.ts` | Returns a `MetadataRoute.Robots` object; generates `/robots.txt`. |

---

## 4. Server Components vs Client Components

### Server Components (default)

- No `"use client"` directive needed — **all components are Server Components by default**.
- Run **on the server** at request time (or build time for static routes).
- **Cannot use**: `useState`, `useEffect`, `onClick`, or any browser API.
- **Can**: be `async`, query databases directly, read `process.env` secrets, reduce JS bundle size.

```tsx
// app/dashboard/page.tsx — Server Component
export default async function Dashboard() {
  // Direct DB access — never exposed to the browser
  const user = await db.user.findFirst({ where: { id: 1 } });
  const apiKey = process.env.INTERNAL_API_KEY; // safe — runs server-side only

  return <h1>Welcome, {user.name}</h1>;
}
```

### Client Components

Add `"use client"` at the **top of the file** (before imports). This marks a **bundle boundary** — the file and all its imports become part of the client-side JavaScript bundle.

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Decision Guide

| Need | Use |
|---|---|
| Fetch data from DB / API | Server Component |
| Read `process.env` secrets | Server Component |
| SEO-critical static content | Server Component |
| `useState` / `useReducer` | Client Component |
| `useEffect` / lifecycle hooks | Client Component |
| Event handlers (`onClick`, `onChange`) | Client Component |
| Browser APIs (`window`, `localStorage`) | Client Component |
| Custom hooks that use the above | Client Component |

### Props Across the Boundary

Props passed from a Server Component to a Client Component must be **JSON-serializable**:

```tsx
// ✓ Allowed
<ClientComp count={42} label="hello" items={[1,2,3]} obj={{ a: true }} />

// ✗ Not allowed — will throw
<ClientComp fn={() => {}} date={new Date()} instance={new MyClass()} />
```

### Interleaving — Children / Slot Pattern

You **cannot import** a Server Component inside a `"use client"` file. Instead, pass server-rendered output as `children` from a Server Component parent:

```tsx
// page.tsx (Server Component)
<ClientWrapper>
  <ServerBox />   {/* rendered on server, passed as opaque HTML to client */}
</ClientWrapper>

// ClientWrapper.tsx ("use client")
export function ClientWrapper({ children }) {
  const [open, setOpen] = useState(true);
  return <div>{open && children}</div>; // can show/hide but can't re-render ServerBox
}
```

---

## 5. Layouts

A `layout.tsx` wraps all routes in its segment and **persists across navigation** (does not re-mount).

```tsx
// app/layout.tsx — ROOT LAYOUT (required)
// Must render <html> and <body>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Title Template — Metadata Inheritance

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: "%s | My App",  // child pages fill in %s
    default: "My App",
  },
};

// app/about/page.tsx
export const metadata = { title: "About" };
// Result: <title>About | My App</title>
```

### Nested Layouts

```
app/
  layout.tsx         ← root layout (html + body + NavBar)
  learn/
    layout.tsx       ← adds sidebar for all /learn/* routes
    page.tsx
    fetching-data/
      page.tsx       ← gets root layout + learn layout
```

---

## 6. Fetching Data

### In a Server Component — just `await`

```tsx
export default async function Page() {
  // Runs on the server — no useEffect, no useState, no loading state
  const data = await fetch("https://api.example.com/posts");
  const posts = await data.json();

  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

### Parallel Fetching with `Promise.all`

Never chain sequential `await` for independent requests:

```tsx
// ❌ Sequential: 300ms + 500ms = 800ms total
const user  = await getUser();
const posts = await getPosts();

// ✓ Parallel: max(300ms, 500ms) = 500ms total
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

### Request Deduplication

Next.js automatically deduplicates identical `fetch()` calls within a single render. If `generateMetadata()` and the page both call `getPost(slug)`, the DB is only queried once.

### `searchParams` and `params` in Next.js 15+

In Next.js 15, `params` and `searchParams` are **Promises** — must be awaited:

```tsx
// app/blog/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  // ...
}
```

---

## 7. Streaming with Suspense

### `loading.tsx` — Route-Level Skeleton

Place `loading.tsx` next to `page.tsx`. Next.js automatically wraps the page in `<Suspense>` and shows this file while the page awaits data.

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading…</div>;
}
```

**Bonus**: `loading.tsx` enables **partial prefetch** — when a `<Link>` enters the viewport, Next.js prefetches the layout + this skeleton, making navigation feel instant.

### Granular Suspense Boundaries

Wrap individual async components in `<Suspense>` to stream them independently:

```tsx
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div>
      {/* UserCard (300ms) and StatsPanel (500ms) resolve independently */}
      <Suspense fallback={<Skeleton />}>
        <UserCard />      {/* resolves at 300ms */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <StatsPanel />    {/* resolves at 500ms */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <PostList />      {/* resolves at 800ms — doesn't block the others */}
      </Suspense>
    </div>
  );
}
```

---

## 8. Server Actions & Mutations

Server Actions are `async` functions marked with `"use server"`. Next.js creates an encrypted POST endpoint for each one automatically.

### File-Level Directive

```ts
// _actions/posts.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevState: State, formData: FormData): Promise<State> {
  const title = formData.get("title") as string;

  // Always validate on the server — inputs are untrusted
  if (!title?.trim()) {
    return { error: "Title is required" };
  }

  await db.post.create({ data: { title } });

  // Option A: bust the cache and re-render
  revalidatePath("/blog");
  return { success: true };

  // Option B: navigate away (throws internally — don't wrap in try/catch)
  // redirect("/blog");
}
```

### `useActionState` in a Client Component

```tsx
"use client";
import { useActionState } from "react";
import { createPost } from "./_actions/posts";

export function PostForm({ initial }: { initial: State }) {
  // Signature: useActionState(action, initialState)
  // Returns: [latestState, actionFn, isPending]
  const [state, action, pending] = useActionState(createPost, initial);

  return (
    <form action={action}>
      <input name="title" required />
      <button disabled={pending}>{pending ? "Saving…" : "Create"}</button>
      {state.error && <p aria-live="polite">{state.error}</p>}
    </form>
  );
}
```

### Server Action Lifecycle

```
User submits form
  → Next.js intercepts (or browser sends native POST if no JS)
  → Server Action runs on server
  → Returns new state
  → useActionState updates the UI (pending → false)
  → Optionally: revalidatePath() busts cache, redirect() navigates
```

### `revalidatePath` vs `revalidateTag`

```ts
import { revalidatePath, revalidateTag } from "next/cache";

revalidatePath("/blog");          // bust cache for one specific path
revalidatePath("/blog", "layout"); // bust cache for layout of a path
revalidateTag("blog-posts");       // bust all fetches tagged "blog-posts"

// Tag a fetch:
fetch("/api/posts", { next: { tags: ["blog-posts"] } });
```

---

## 9. Route Handlers (API Routes)

Create a `route.ts` file inside `app/`. Export named async functions for each HTTP method.

```ts
// app/api/posts/route.ts  →  /api/posts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("q") ?? "";
  const posts = await db.post.findMany({ where: { title: { contains: search } } });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  const post = await db.post.create({ data: { title: body.title } });
  return NextResponse.json({ post }, { status: 201 });
}
```

### Dynamic Route Handler

```ts
// app/api/posts/[id]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // params is a Promise in Next.js 15
) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id: Number(id) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}
```

### `NextRequest` / `NextResponse` API

```ts
// Reading from the request
req.nextUrl.searchParams.get("key")   // ?key=value
req.nextUrl.pathname                  // "/api/posts"
await req.json()                      // parse JSON body
await req.formData()                  // parse form body
req.headers.get("Authorization")      // read header
req.cookies.get("session")?.value     // read cookie

// Building responses
NextResponse.json({ data }, { status: 200 })
NextResponse.redirect(new URL("/login", req.url))
new NextResponse("text", { status: 200, headers: { "Content-Type": "text/plain" } })
new NextResponse(null, { status: 204 })  // no content
```

### Route Handlers vs Server Actions

| | Route Handler | Server Action |
|---|---|---|
| Use when | External clients (mobile, third-party, webhooks) | Only your own Next.js UI |
| Called via | Any HTTP client / fetch | React form action / `startTransition` |
| Progressive enhancement | Manual | Built-in |
| Auth / CSRF | Manual | Automatic (encrypted endpoint) |

---

## 10. Navigation

### `<Link>` Component

```tsx
import Link from "next/link";

// Basic
<Link href="/about">About</Link>

// Dynamic route
<Link href={`/blog/${post.slug}`}>Read more</Link>

// With query params
<Link href={{ pathname: "/search", query: { q: "next.js" } }}>Search</Link>

// Disable prefetch (rare — e.g., very large pages)
<Link href="/heavy-page" prefetch={false}>…</Link>

// Replace history entry instead of pushing
<Link href="/profile" replace>Profile</Link>
```

**Prefetch behavior:**
- Static routes: prefetched on hover (full page).
- Dynamic routes: prefetched when `<Link>` enters the viewport (layout + `loading.tsx` skeleton only).
- Set `prefetch={false}` to opt out.

### `useRouter` (Client Component only)

```tsx
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/dashboard");      // navigate + push to history
router.replace("/login");       // navigate + replace history entry
router.back();                  // go back
router.forward();               // go forward
router.refresh();               // re-fetch server data for current route
router.prefetch("/heavy");      // manually prefetch a route
```

### `usePathname` — Current URL Path

```tsx
"use client";
import { usePathname } from "next/navigation";

const pathname = usePathname(); // "/learn/fetching-data"
const isActive = pathname === "/learn/fetching-data";
```

### `useSearchParams` — Query String

```tsx
"use client";
import { useSearchParams, Suspense } from "react";

// IMPORTANT: useSearchParams must be inside a <Suspense> boundary
function SearchUI() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  // ...
}

export function SearchWrapper() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SearchUI />
    </Suspense>
  );
}
```

### `redirect` — Server-Side Redirect

```ts
import { redirect } from "next/navigation";

// Inside a Server Component or Server Action
if (!user) redirect("/login");

// redirect() throws internally — never wrap in try/catch
// Use it AFTER any cleanup (DB writes, etc.) is done
```

---

## 11. Dynamic Routes

### `[param]` — Single Segment

```tsx
// app/blog/[slug]/page.tsx
type Props = { params: Promise<{ slug: string }> };

export default async function Post({ params }: Props) {
  const { slug } = await params; // await required in Next.js 15
  return <h1>{slug}</h1>;
}

// Generate static params at build time (optional — for SSG)
export async function generateStaticParams() {
  const posts = await db.post.findMany();
  return posts.map(p => ({ slug: p.slug }));
}
```

### `[...slug]` — Catch-All

Matches `/a`, `/a/b`, `/a/b/c` — `params.slug` is an array.

```tsx
// app/docs/[...slug]/page.tsx
const { slug } = await params; // slug = ["getting-started", "installation"]
```

### `[[...slug]]` — Optional Catch-All

Also matches the route with no slug at all (`/docs`).

---

## 12. Error Handling

### `error.tsx` — Segment Error Boundary

```tsx
// app/dashboard/error.tsx
"use client"; // REQUIRED — error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // digest = server-generated error ID
  reset: () => void;                  // re-renders the segment
}) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Scope rules:**
- `error.tsx` catches errors in sibling `page.tsx` and child segments.
- It does **not** catch errors in the sibling `layout.tsx` — those bubble up.
- `global-error.tsx` at the app root catches root layout errors.

### `notFound()` — Programmatic 404

```tsx
import { notFound } from "next/navigation";

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });

  if (!post) notFound(); // renders nearest not-found.tsx, stops execution

  return <article>{post.title}</article>;
}
```

### Error Bubble-Up Hierarchy

```
app/
  global-error.tsx         ← catches root layout.tsx errors
  dashboard/
    error.tsx              ← catches dashboard/page.tsx errors
    layout.tsx             ← errors here bubble UP to global-error.tsx
    page.tsx               ← errors caught by dashboard/error.tsx
    settings/
      page.tsx             ← errors bubble up to dashboard/error.tsx (no local error.tsx)
```

---

## 13. Metadata & SEO

### Static Export

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page",                          // <title>
  description: "Page description",           // <meta name="description">
  keywords: ["nextjs", "react"],
  openGraph: {
    title: "My Page",
    description: "…",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Page",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://example.com/my-page",
  },
};
```

### Dynamic `generateMetadata`

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });

  return {
    title: post?.title ?? "Not found",
    description: post?.excerpt,
    openGraph: { images: [{ url: post?.coverImage ?? "/default-og.png" }] },
  };
}
```

### OG Image Generation

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000" }}>
      <h1 style={{ color: "#fff", fontSize: 72 }}>{slug}</h1>
    </div>,
    size
  );
}
```

---

## 14. Fonts

```tsx
// app/layout.tsx — module level (required)
import { Inter, Fira_Code } from "next/font/google";

// Method 1: className — apply directly to elements
const inter = Inter({ subsets: ["latin"], display: "swap" });
<p className={inter.className}>…</p>

// Method 2: CSS variable — use in Tailwind / globals.css
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
<html className={inter.variable}>  {/* then: font-family: var(--font-inter) */}

// Local font
import localFont from "next/font/local";
const myFont = localFont({ src: "./fonts/MyFont.woff2" });
```

**What `next/font` does:**
- Downloads font files at **build time** from Google.
- Self-hosts them on your domain — no Google requests at runtime.
- Eliminates layout shift (CLS) — the font arrives with the page.
- Automatically sets `font-display: swap`.

---

## 15. Images

```tsx
import Image from "next/image";

// Local image — width/height inferred from file
import logo from "./public/logo.png";
<Image src={logo} alt="Logo" />

// Remote image — width/height required; domain must be whitelisted
<Image src="https://example.com/photo.jpg" alt="Photo" width={800} height={600} />

// Fill parent container (parent must be position: relative + sized)
<div className="relative h-64 w-full">
  <Image src={hero} alt="Hero" fill className="object-cover" />
</div>

// Above-the-fold hero — disable lazy loading for better LCP
<Image src={hero} alt="Hero" priority />

// Responsive hints — saves bandwidth on mobile
<Image src={photo} alt="…" width={800} height={600}
  sizes="(max-width: 768px) 100vw, 50vw" />
```

**What `next/image` does automatically:**
- Lazy loading (skip with `priority`).
- WebP / AVIF conversion.
- Responsive `srcset` generation.
- Blur placeholder for local images.
- Caches resized images on the server.

**Remote domains must be whitelisted in `next.config.ts`:**

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};
```

---

## 16. CSS & Styling

### Tailwind CSS (default in this project)

```tsx
<button className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2
                   text-sm font-medium transition-colors disabled:opacity-50">
```

- Configure in `tailwind.config.ts`.
- Dark mode: `darkMode: "class"` → add `class="dark"` to `<html>`.
- Responsive: `sm:` `md:` `lg:` `xl:` (mobile-first).

### CSS Modules

```tsx
// button.module.css
.btn { border-radius: 8px; padding: 0.5rem 1rem; }
.primary { background: #3b82f6; color: #fff; }

// button.tsx
import styles from "./button.module.css";
<button className={`${styles.btn} ${styles.primary}`}>Click</button>
```

Class names are hashed at build time → zero naming conflicts.

### `globals.css`

Import **once** in `app/layout.tsx`. Contains Tailwind directives and base styles.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --brand: #6366f1; }
body { font-family: var(--font-inter); }
```

---

## 17. Middleware

`middleware.ts` at the project root runs before every request. Use it for auth, redirects, A/B testing, locale detection.

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

---

## 18. Configuration (`next.config.ts`)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow remote images from specific domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  // Redirect old URLs
  async redirects() {
    return [
      { source: "/old-path", destination: "/new-path", permanent: true },
    ];
  },

  // Rewrite URL (proxy)
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: "https://upstream.com/:path*" },
    ];
  },

  // Custom response headers
  async headers() {
    return [
      { source: "/:path*", headers: [{ key: "X-Frame-Options", value: "DENY" }] },
    ];
  },

  // Environment variables exposed to the browser (prefix with NEXT_PUBLIC_)
  // env: { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL },
};

export default nextConfig;
```

---

## 19. Performance Patterns

### Parallel Data Fetching
```tsx
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

### Granular Suspense Boundaries
Wrap each independently-loading section in its own `<Suspense>`. Sections stream as they resolve.

### Place `"use client"` Deep
Keep layouts and pages as Server Components. Only interactive leaves need `"use client"`. Smaller client bundle = faster hydration.

### Prefer `<Link>` Over `<a>`
`<Link>` prefetches routes automatically. `<a>` causes a full page reload.

### Use `next/image` Always
Automatic lazy loading, WebP conversion, and responsive sizing — never use `<img>` for images you control.

### `loading.tsx` Unlocks Partial Prefetch
With `loading.tsx`, Next.js prefetches the layout + skeleton for dynamic routes when `<Link>` enters the viewport. Navigation feels instant even before data arrives.

### Avoid Sequential `await` for Independent Requests
Chain of `await` calls is a waterfall. `Promise.all` runs them in parallel.

---

## 20. Project Structure in this Repo

```
my-app/
├── app/
│   ├── layout.tsx                    ← Root layout (html, body, NavBar, fonts)
│   ├── page.tsx                      ← Home page (/)
│   ├── global-error.tsx              ← Root error boundary
│   ├── not-found.tsx                 ← Global 404 page
│   ├── globals.css                   ← Tailwind directives + base styles
│   │
│   ├── _components/
│   │   └── NavBar.tsx                ← Global sticky top nav ("use client")
│   │
│   ├── _store/
│   │   └── todoStore.ts              ← Zustand store for the Todo app
│   │
│   ├── api/
│   │   ├── learn-demo/route.ts       ← GET + POST demo endpoint
│   │   └── posts/route.ts            ← Posts API endpoint
│   │
│   ├── learn/
│   │   ├── layout.tsx                ← Sidebar layout for /learn/*
│   │   ├── page.tsx                  ← /learn index (chapter list)
│   │   ├── _components/              ← Shared UI: Demo, ChapterLayout, CheatSheet…
│   │   ├── _data/chapters.ts         ← Chapter list (single source of truth)
│   │   ├── layouts-and-pages/        ← Chapter 1
│   │   ├── linking-and-navigating/   ← Chapter 2
│   │   ├── server-and-client/        ← Chapter 3
│   │   ├── fetching-data/            ← Chapter 4
│   │   ├── mutating-data/            ← Chapter 5 (Server Actions)
│   │   ├── error-handling/           ← Chapter 6
│   │   ├── route-handlers/           ← Chapter 7
│   │   ├── css/                      ← Chapter 8
│   │   ├── fonts-and-images/         ← Chapter 9
│   │   ├── metadata/                 ← Chapter 10
│   │   ├── state-management/         ← Chapter 11 (Zustand vs Context)
│   │   └── tailwind-css/             ← Chapter 12
│   │
│   ├── todo/                         ← Mini App: Todo (Zustand + persist)
│   ├── tictactoe/                    ← Mini App: Tic-Tac-Toe (minimax AI)
│   ├── feed/                         ← Mini App: Infinite Feed (virtualization)
│   └── checkboxes/                   ← Mini App: Checkbox Tree (tree algorithms)
│
├── docs/
│   ├── nextjs.md                     ← This file
│   ├── zustand.md                    ← Zustand complete reference
│   └── tailwind.md                   ← Tailwind CSS complete reference
│
├── public/                           ← Static assets
├── next.config.ts                    ← Next.js configuration
├── tailwind.config.ts                ← Tailwind configuration
├── tsconfig.json                     ← TypeScript configuration
└── package.json
```

---

## Quick Reference — Most Common Mistakes

| Mistake | Fix |
|---|---|
| `useState` in a Server Component | Add `"use client"` to the file |
| Passing a `Date` or function as a prop to a Client Component | Serialize first: `.toISOString()`, stringify |
| Importing a Server Component inside a `"use client"` file | Pass it as `children` from a Server Component parent |
| Not awaiting `params` / `searchParams` | In Next.js 15 both are Promises — always `await` them |
| `redirect()` inside `try/catch` | Move it outside the `try` block — it throws internally |
| Global CSS imported in a component file | Import `globals.css` only in `layout.tsx` or `page.tsx` |
| `useSearchParams()` without `<Suspense>` | Wrap the component using it in `<Suspense>` |
| Sequential `await` for independent requests | Use `Promise.all([a(), b()])` |
| Using `<img>` instead of `next/image` | Use `<Image>` from `"next/image"` |
| Font constructor inside a component | Move to module level (top of file) |
