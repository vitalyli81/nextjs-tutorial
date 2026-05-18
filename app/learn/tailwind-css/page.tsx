// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 12 — Tailwind CSS (Deep Dive)
//
// KEY CONCEPTS IN THIS FILE:
//   • Utility-first    — compose small single-purpose classes instead of writing CSS
//   • Responsive       — sm: md: lg: xl: 2xl: breakpoint prefixes (mobile-first)
//   • Dark mode        — dark: prefix; configured via darkMode: 'class' in config
//   • States           — hover: focus: active: disabled: peer-: group-: prefixes
//   • Custom values    — arbitrary values with brackets: w-[347px] text-[#1a1a1a]
//   • @apply           — use Tailwind utilities inside CSS files (sparingly)
//   • tailwind.config  — extend theme (colors, fonts, spacing, breakpoints)
//   • clsx / cn        — conditionally join class names cleanly
//   • Common patterns  — flex layouts, card, button, badge, responsive grid
//
// This PAGE is a Server Component — all demos are pure HTML/CSS, no interactivity.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";

export const metadata: Metadata = { title: "Tailwind CSS" };

export default function TailwindCssPage() {
  return (
    <ChapterLayout
      slug="tailwind-css"
      title="Tailwind CSS"
      docsHref="https://tailwindcss.com/docs"
    >
      {/* ── Demo 1: Utility-first fundamentals ────────────────────────── */}
      <Demo concept="Utility-first" title="One class = one style rule — compose in JSX, not in a CSS file">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Every Tailwind class maps to a single CSS rule. You build UIs by combining
          many small classes rather than writing custom CSS. Tailwind scans your source
          at build time and ships <strong>only the classes you use</strong>.
        </p>

        {/* Live examples of common utilities */}
        <div className="space-y-4">
          {/* Spacing */}
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-mono">Spacing — p, m, gap, space-y</p>
            <div className="flex gap-2 items-center flex-wrap">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono text-blue-700 dark:text-blue-300">p-2</div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono text-blue-700 dark:text-blue-300">p-4</div>
              <div className="p-8 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono text-blue-700 dark:text-blue-300">p-8</div>
              <div className="px-4 py-2 bg-blue-200 dark:bg-blue-900/50 rounded text-xs font-mono text-blue-800 dark:text-blue-200">px-4 py-2</div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-mono">Typography — text-*, font-*, leading-*, tracking-*</p>
            <div className="space-y-1">
              <p className="text-sm font-normal text-zinc-700 dark:text-zinc-300">text-sm font-normal</p>
              <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100">text-base font-semibold</p>
              <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">text-2xl font-bold tracking-tight</p>
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-mono">Colors — bg-*, text-*, border-* with scale 50–950</p>
            <div className="flex gap-1 flex-wrap">
              {["50","100","200","300","400","500","600","700","800","900","950"].map((shade) => (
                <div
                  key={shade}
                  className="w-8 h-8 rounded flex items-center justify-center text-[10px] font-mono"
                  style={{ backgroundColor: `rgb(var(--tw-color-blue-${shade}, 59 130 246))` }}
                >
                  <span className={`${Number(shade) < 400 ? "text-blue-900" : "text-blue-100"} text-[9px]`}>{shade}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">bg-blue-500</div>
              <div className="bg-emerald-500 text-white px-2 py-1 rounded text-xs">bg-emerald-500</div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">bg-red-500</div>
              <div className="bg-amber-400 text-amber-900 px-2 py-1 rounded text-xs">bg-amber-400</div>
              <div className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">bg-zinc-800</div>
            </div>
          </div>
        </div>
        <CodeBlock>{`{/* Padding: p=all, px=horizontal, py=vertical, pt/pr/pb/pl=sides */}
{/* Scale: 1 = 0.25rem, 2 = 0.5rem, 4 = 1rem, 8 = 2rem, 16 = 4rem */}
<div className="p-4 px-6 py-2 mt-4 mb-8 space-y-4 gap-3">

{/* Typography */}
<p className="text-sm font-medium leading-relaxed tracking-tight text-zinc-600">

{/* Colors: color-shade — shade runs 50 (light) to 950 (dark) */}
<div className="bg-blue-500 text-white border border-blue-700">
<div className="bg-zinc-100 dark:bg-zinc-800">   {/* adapts to dark mode */}`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 2: Responsive design ─────────────────────────────────── */}
      <Demo concept="Responsive — sm: md: lg: xl:" title="Mobile-first breakpoint prefixes">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Tailwind is <strong>mobile-first</strong>: unprefixed classes apply at all sizes.
          Prefixed classes apply at that breakpoint and above. Resize the window to see the
          grid below change columns.
        </p>

        {/* Live responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {["A","B","C","D"].map((l) => (
            <div key={l} className="h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {l}
            </div>
          ))}
        </div>

        <CodeBlock>{`{/* Breakpoints (min-width):
    sm  = 640px    (phone landscape / small tablet)
    md  = 768px    (tablet)
    lg  = 1024px   (laptop)
    xl  = 1280px   (desktop)
    2xl = 1536px   (wide screen) */}

{/* Grid: 1 column by default, 2 on sm+, 4 on lg+ */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

{/* Typography: small on mobile, larger on desktop */}
<h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold">

{/* Hide/show elements per breakpoint */}
<nav className="hidden sm:flex">    {/* visible on sm+ */}
<button className="sm:hidden">     {/* visible only on mobile */}

{/* Padding changes at each breakpoint */}
<div className="p-4 md:p-8 lg:p-16">`}
        </CodeBlock>
        <Callout kind="rule">
          Tailwind is <strong>mobile-first</strong>: unprefixed classes apply to all breakpoints.
          Prefixed classes (<code>sm:</code>, <code>lg:</code>) apply from that size upward.
          Design your mobile layout first, then add prefixes to override at larger screens.
        </Callout>
      </Demo>

      {/* ── Demo 3: Dark mode ─────────────────────────────────────────── */}
      <Demo concept="Dark mode — dark:" title="Prefix any utility with dark: to apply it in dark mode">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Add <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">dark:</code> before any
          utility to apply it when dark mode is active. The card below adapts to the OS theme:
        </p>

        {/* Live dark-mode adaptive card */}
        <div className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 space-y-2">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Adaptive card</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            This card changes colors based on your OS dark mode setting.
          </p>
          <div className="flex gap-2">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">light: blue-100</span>
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-xs">dark: emerald-900/30</span>
          </div>
        </div>

        <CodeBlock>{`{/* Dark mode is configured in tailwind.config.ts:
    darkMode: 'class'  → add class="dark" to <html> to activate
    darkMode: 'media'  → follows OS preference automatically */}

{/* Pair each light color with a dark: variant: */}
<div className="bg-white dark:bg-zinc-900">         {/* background */}
<p   className="text-zinc-900 dark:text-white">      {/* text */}
<div className="border-zinc-200 dark:border-zinc-700"> {/* border */}

{/* Opacity modifier — /30 means 30% opacity */}
<div className="bg-blue-500/20 dark:bg-blue-900/30">

{/* Always specify both light and dark for every color you set */}
{/* Missing dark: means it stays the same in dark mode */}`}
        </CodeBlock>
        <Callout kind="tip">
          This project uses <code>darkMode: &apos;class&apos;</code> — dark mode activates when the
          root <code>&lt;html&gt;</code> has the <code>dark</code> class. Your OS preference sets
          it automatically via the <code>prefers-color-scheme</code> media query wired in the
          root layout.
        </Callout>
      </Demo>

      {/* ── Demo 4: State variants ────────────────────────────────────── */}
      <Demo concept="State variants — hover: focus: disabled: group-:" title="Apply styles conditionally based on element state">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Prefix any utility with a state variant to apply it only in that state.
          Hover over or focus the elements below:
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          {/* hover + active + transition */}
          <button className="rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 text-sm font-medium transition-all cursor-pointer">
            hover: active:
          </button>
          {/* focus ring */}
          <input
            readOnly
            defaultValue="focus me"
            className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {/* disabled */}
          <button disabled className="rounded-lg bg-zinc-400 text-white px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
            disabled:
          </button>
          {/* group-hover — parent hover affects child */}
          <div className="group rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 cursor-pointer hover:border-blue-400 transition-colors">
            <p className="text-sm text-zinc-500 group-hover:text-blue-600 transition-colors">group-hover child</p>
          </div>
        </div>

        <CodeBlock>{`{/* Common state prefixes: */}
hover:bg-blue-600          {/* mouse over */}
focus:ring-2 focus:ring-blue-500  {/* keyboard/click focus */}
active:scale-95            {/* click press */}
disabled:opacity-50 disabled:cursor-not-allowed

{/* Group — apply to parent with "group", target child with "group-hover:" */}
<div className="group border hover:border-blue-400">
  <p className="text-zinc-500 group-hover:text-blue-600">
    changes when PARENT is hovered
  </p>
</div>

{/* Peer — affect a sibling based on another sibling's state */}
<input className="peer" type="checkbox" />
<label className="peer-checked:text-blue-500">Checked!</label>

{/* Transition — always pair with transition-* for smooth animations */}
<button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200">`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 5: Arbitrary values + @apply ─────────────────────────── */}
      <Demo concept="Arbitrary values + @apply" title="Escape hatches for one-off values">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Need a value not in the default scale? Use square brackets for arbitrary values.
          Need to reuse a group of utilities? Use <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@apply</code> in a CSS file.
        </p>
        <CodeBlock>{`{/* Arbitrary values — any utility can accept a custom value in brackets */}
<div className="w-[347px] h-[200px]">          {/* exact pixels */}
<div className="top-[117px] left-[calc(50%-4rem)]">  {/* calc expressions */}
<p  className="text-[#1a1a2e]">                {/* hex color */}
<div className="grid grid-cols-[1fr_2fr_1fr]"> {/* custom grid template */}
<div className="bg-[url('/hero.jpg')]">        {/* background image */}

{/* @apply — extract repeated utility groups into a CSS class */}
/* globals.css */
.btn-primary {
  @apply rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2
         text-sm font-medium transition-colors;
}
/* Use in JSX: */
<button className="btn-primary">Click me</button>

{/* Caveat: @apply reduces the benefits of utility-first (harder to see styles
   in JSX). Reserve it for truly repeated patterns like .btn, .badge, .input */}`}
        </CodeBlock>
        <Callout kind="warning">
          Use <code>@apply</code> sparingly — it reintroduces the CSS layer you were trying to
          avoid. Prefer extracting a React component (<code>Button</code>, <code>Badge</code>)
          that encapsulates the classes instead. Components compose better than CSS classes.
        </Callout>
      </Demo>

      {/* ── Demo 6: tailwind.config — extending the theme ─────────────── */}
      <Demo concept="tailwind.config.ts — theme extension" title="Add custom colors, fonts, spacing, and breakpoints">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          The default Tailwind theme covers most needs, but you can extend or override
          it in <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">tailwind.config.ts</code>.
          Use <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">extend</code> to ADD to
          the default scale (not replace it).
        </p>
        <CodeBlock>{`// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  // darkMode: 'class' → toggle dark mode by adding class="dark" to <html>
  darkMode: "class",

  // content: files Tailwind scans for class names (tree-shakes unused classes)
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],

  theme: {
    extend: {
      // Custom brand colors available as bg-brand-500, text-brand-600, etc.
      colors: {
        brand: {
          50:  "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a5f",
        },
      },

      // Custom font family — used after setting the CSS variable in layout.tsx
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        mono:  ["var(--font-geist-mono)", "monospace"],
      },

      // Custom breakpoint
      screens: {
        "3xl": "1920px",
      },

      // Custom spacing value: p-18, m-18, gap-18, etc.
      spacing: {
        "18": "4.5rem",
      },
    },
  },
} satisfies Config;`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 7: clsx / cn pattern ─────────────────────────────────── */}
      <Demo concept="clsx / cn — conditional classes" title="Join class strings cleanly, avoid template literal soup">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          When class names depend on props or state, template literals get messy.
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded"> clsx</code> (or the{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">cn</code> helper from shadcn)
          handles conditional logic cleanly:
        </p>
        <CodeBlock>{`// Install: npm install clsx tailwind-merge
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = clsx + twMerge: merges classes AND resolves Tailwind conflicts
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ❌ Messy template literal — hard to read, easy to add unwanted spaces
<button className={\`rounded-lg px-4 py-2 \${primary ? "bg-blue-500" : "bg-zinc-200"} \${disabled ? "opacity-50 cursor-not-allowed" : ""}\`}>

// ✓ Clean with clsx — accepts objects, arrays, and strings
<button
  className={cn(
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
    primary   ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800",
    disabled  && "opacity-50 cursor-not-allowed",
  )}
>

// twMerge resolves Tailwind conflicts — last value wins:
cn("p-4", "p-6")       // → "p-6"       (p-4 is removed, not concatenated)
cn("px-4", "px-6")     // → "px-6"`}
        </CodeBlock>
        <Callout kind="tip">
          Install both <code>clsx</code> and <code>tailwind-merge</code>. Wrap them in a{" "}
          <code>cn()</code> helper (a one-liner in <code>lib/utils.ts</code>) — this is the
          standard pattern used by shadcn/ui and most modern Next.js projects.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "Tailwind is <strong>utility-first</strong>: one class = one CSS rule. Compose many small classes in JSX instead of writing custom CSS. Only used classes ship to production.",
        "<strong>Mobile-first</strong>: unprefixed classes apply to all screen sizes. Prefixes apply at that size and up: <code>sm:640px</code> <code>md:768px</code> <code>lg:1024px</code> <code>xl:1280px</code> <code>2xl:1536px</code>.",
        "<strong>Dark mode</strong>: prefix any utility with <code>dark:</code>. Set <code>darkMode: 'class'</code> in config — add <code>dark</code> class to <code>&lt;html&gt;</code> to activate. Always pair light and dark variants.",
        "<strong>State variants</strong>: <code>hover:</code> <code>focus:</code> <code>active:</code> <code>disabled:</code> — prefix any utility. Use <code>group</code> on a parent and <code>group-hover:</code> on children. Always add <code>transition-*</code> for smooth changes.",
        "<strong>Arbitrary values</strong>: escape the scale with brackets — <code>w-[347px]</code> <code>text-[#1a2b3c]</code> <code>grid-cols-[1fr_2fr]</code>. Use sparingly — prefer the default scale.",
        "Extend the theme in <code>tailwind.config.ts</code> under <code>theme.extend</code> — adds to the default scale. Use <code>theme</code> (without extend) only to fully replace defaults.",
        "Use <code>clsx</code> + <code>tailwind-merge</code> via a <code>cn()</code> helper for conditional classes. <code>twMerge</code> removes conflicting utilities (e.g. <code>p-4 p-6</code> → <code>p-6</code>).",
        "Avoid <code>@apply</code> except for high-reuse patterns like <code>.btn</code> or <code>.badge</code>. Prefer extracting a React component instead — it composes better.",
      ]} />
    </ChapterLayout>
  );
}
