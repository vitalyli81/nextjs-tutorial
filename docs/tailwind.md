# Tailwind CSS — Complete Reference

> Version used in this project: **Tailwind CSS 4** · PostCSS · TypeScript

---

## Table of Contents

1. [What is Tailwind?](#1-what-is-tailwind)
2. [Installation & Setup](#2-installation--setup)
3. [Core Concepts](#3-core-concepts)
4. [Spacing — Padding, Margin, Gap](#4-spacing--padding-margin-gap)
5. [Sizing — Width, Height](#5-sizing--width-height)
6. [Typography](#6-typography)
7. [Colors](#7-colors)
8. [Flexbox](#8-flexbox)
9. [Grid](#9-grid)
10. [Borders & Rings](#10-borders--rings)
11. [Shadows & Opacity](#11-shadows--opacity)
12. [Backgrounds & Gradients](#12-backgrounds--gradients)
13. [Responsive Design](#13-responsive-design)
14. [Dark Mode](#14-dark-mode)
15. [State Variants](#15-state-variants)
16. [Transitions & Animations](#16-transitions--animations)
17. [Arbitrary Values](#17-arbitrary-values)
18. [Configuration (tailwind.config.ts)](#18-configuration-tailwindconfigts)
19. [@apply — CSS Escape Hatch](#19-apply--css-escape-hatch)
20. [clsx + tailwind-merge Pattern](#20-clsx--tailwind-merge-pattern)
21. [Component Patterns](#21-component-patterns)
22. [Tailwind in Next.js](#22-tailwind-in-nextjs)
23. [Common Mistakes](#23-common-mistakes)

---

## 1. What is Tailwind?

Tailwind CSS is a **utility-first CSS framework**. Instead of writing custom CSS classes with many properties, you compose many small single-purpose utility classes directly in your HTML/JSX.

```tsx
// Traditional CSS approach
// button.css: .btn-primary { border-radius: 8px; background: #3b82f6; color: white; padding: 8px 16px; … }
<button className="btn-primary">Click me</button>

// Tailwind approach — no CSS file needed
<button className="rounded-lg bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600 transition-colors">
  Click me
</button>
```

**Why Tailwind wins at scale:**
- No naming collisions — utility classes are global and atomic.
- Styles are co-located with markup — no file-switching.
- Automatic dead-code elimination — only used classes ship to production.
- Consistent design system — spacing, color, and type scales enforce visual consistency.
- Dark mode, responsive, and state variants with zero extra CSS.

---

## 2. Installation & Setup

### In a New Next.js Project

```bash
npx create-next-app@latest my-app  # select Tailwind CSS when prompted
```

### Manual Installation (Tailwind v4 + PostCSS)

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

**`postcss.config.mjs`:**
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**`app/globals.css`:**
```css
@import "tailwindcss";
/* OR for v3 compatibility: */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`tailwind.config.ts`** (v3 — still common):
```ts
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
} satisfies Config;
```

---

## 3. Core Concepts

### Utility-First

Every class does one thing. Compose many to build any design.

```
rounded-lg       → border-radius: 0.5rem
bg-blue-500      → background-color: #3b82f6
text-white       → color: #ffffff
px-4             → padding-left: 1rem; padding-right: 1rem
py-2             → padding-top: 0.5rem; padding-bottom: 0.5rem
font-medium      → font-weight: 500
hover:bg-blue-600 → on hover: background-color: #2563eb
transition-colors → transition: color, background-color, … 150ms ease
```

### The Scale

Most Tailwind numbers map to `n × 0.25rem`:

```
0 = 0         1 = 0.25rem   2 = 0.5rem    3 = 0.75rem
4 = 1rem      5 = 1.25rem   6 = 1.5rem    8 = 2rem
10 = 2.5rem   12 = 3rem     16 = 4rem     20 = 5rem
24 = 6rem     32 = 8rem     40 = 10rem    48 = 12rem
64 = 16rem    80 = 20rem    96 = 24rem
```

### Build-Time Purging

Tailwind scans your source files for class names and removes all unused ones. Only classes that appear as complete strings in your source ship to production.

```tsx
// ✓ Full class name — included in bundle
<div className="bg-blue-500">

// ✗ Dynamic class — REMOVED from bundle (Tailwind can't see it at scan time)
<div className={`bg-${color}-500`}>

// ✓ Correct way to handle dynamic classes — use a lookup map
const colorMap = { blue: "bg-blue-500", red: "bg-red-500" };
<div className={colorMap[color]}>
```

---

## 4. Spacing — Padding, Margin, Gap

```tsx
{/* Padding */}
p-4          {/* all sides: 1rem */}
px-4         {/* horizontal: left + right */}
py-2         {/* vertical: top + bottom */}
pt-4 pb-2    {/* top, bottom individually */}
pl-6 pr-2    {/* left, right individually */}

{/* Margin */}
m-4          {/* all sides */}
mx-auto      {/* horizontal auto (center a block element) */}
my-8         {/* vertical */}
mt-4 mb-2    {/* top, bottom */}
-mt-4        {/* negative margin */}

{/* Gap (flex and grid children) */}
gap-4        {/* all directions */}
gap-x-4      {/* horizontal gap only */}
gap-y-2      {/* vertical gap only */}

{/* Space between (flex children — adds margin, not gap) */}
space-x-4    {/* horizontal space between children */}
space-y-2    {/* vertical space between children */}
```

---

## 5. Sizing — Width, Height

```tsx
{/* Width */}
w-full       {/* 100% */}
w-screen     {/* 100vw */}
w-auto       {/* auto */}
w-1/2        {/* 50% */}
w-1/3 w-2/3  {/* 33.3%, 66.6% */}
w-64         {/* 16rem (fixed) */}
w-fit        {/* fit-content */}
w-max        {/* max-content */}
w-min        {/* min-content */}
min-w-0      {/* min-width: 0 — critical in flex to prevent overflow */}
max-w-xl     {/* max-width: 36rem */}
max-w-3xl    {/* max-width: 48rem */}
max-w-6xl    {/* max-width: 72rem */}
max-w-prose  {/* max-width: 65ch — ideal for reading */}

{/* Height */}
h-full       {/* 100% */}
h-screen     {/* 100vh */}
h-14         {/* 3.5rem — used for the NavBar in this project */}
h-px         {/* 1px */}
min-h-screen {/* min-height: 100vh */}
min-h-0      {/* min-height: 0 — needed in flex column for scrolling */}
```

---

## 6. Typography

```tsx
{/* Size */}
text-xs      {/* 0.75rem */}
text-sm      {/* 0.875rem */}
text-base    {/* 1rem */}
text-lg      {/* 1.125rem */}
text-xl      {/* 1.25rem */}
text-2xl     {/* 1.5rem */}
text-3xl     {/* 1.875rem */}
text-4xl     {/* 2.25rem */}
text-5xl     {/* 3rem */}

{/* Weight */}
font-light    {/* 300 */}
font-normal   {/* 400 */}
font-medium   {/* 500 */}
font-semibold {/* 600 */}
font-bold     {/* 700 */}
font-extrabold {/* 800 */}

{/* Line height */}
leading-none    {/* 1 */}
leading-tight   {/* 1.25 */}
leading-snug    {/* 1.375 */}
leading-normal  {/* 1.5 */}
leading-relaxed {/* 1.625 */}
leading-loose   {/* 2 */}

{/* Letter spacing */}
tracking-tighter {/* -0.05em */}
tracking-tight   {/* -0.025em */}
tracking-normal  {/* 0 */}
tracking-wide    {/* 0.025em */}
tracking-wider   {/* 0.05em */}
tracking-widest  {/* 0.1em */}

{/* Alignment, decoration, transform */}
text-left text-center text-right text-justify
uppercase lowercase capitalize normal-case
underline line-through no-underline
italic not-italic

{/* Truncate long text */}
truncate           {/* overflow hidden + ellipsis + nowrap */}
overflow-hidden    {/* clip text */}
whitespace-nowrap  {/* prevent wrapping */}
break-words        {/* break long words */}

{/* Font family (configured in tailwind.config.ts) */}
font-mono   {/* monospace */}
font-sans   {/* sans-serif (default) */}
font-serif  {/* serif */}
```

---

## 7. Colors

Tailwind provides a comprehensive color palette. Each color has shades 50 (lightest) to 950 (darkest).

```tsx
{/* Background */}
bg-white bg-black bg-transparent
bg-zinc-50 bg-zinc-100 bg-zinc-800 bg-zinc-900 bg-zinc-950

{/* Text */}
text-white text-black
text-zinc-400 text-zinc-600 text-zinc-800

{/* Border */}
border-zinc-200 border-zinc-700

{/* Full color palette: */}
{/* slate gray zinc neutral stone
    red orange amber yellow lime
    green emerald teal cyan sky blue
    indigo violet purple fuchsia pink rose */}

{/* Opacity modifier — /N appends opacity */}
bg-blue-500/20      {/* background with 20% opacity */}
bg-blue-900/30      {/* dark background overlay */}
text-zinc-500/80    {/* slightly transparent text */}
border-white/10     {/* very subtle white border */}

{/* Gradient */}
bg-gradient-to-r from-blue-500 to-indigo-600
bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600
```

---

## 8. Flexbox

```tsx
{/* Container */}
flex            {/* display: flex */}
inline-flex     {/* display: inline-flex */}

{/* Direction */}
flex-row        {/* default — left to right */}
flex-col        {/* top to bottom */}
flex-row-reverse
flex-col-reverse

{/* Justify (main axis) */}
justify-start   justify-center   justify-end
justify-between {/* space between items */}
justify-around  {/* space around items */}
justify-evenly

{/* Align (cross axis) */}
items-start    items-center    items-end
items-stretch  {/* default — fill cross axis */}
items-baseline

{/* Flex item sizing */}
flex-1          {/* flex: 1 1 0 — takes available space */}
flex-auto       {/* flex: 1 1 auto */}
flex-none       {/* flex: none — doesn't grow or shrink */}
flex-initial    {/* flex: 0 1 auto */}
flex-[2]        {/* custom flex value */}
grow            {/* flex-grow: 1 */}
shrink-0        {/* flex-shrink: 0 — won't shrink below its natural size */}

{/* Wrap */}
flex-wrap       {/* wrap to next line */}
flex-nowrap     {/* default — stay on one line */}
flex-wrap-reverse

{/* Self alignment (individual item override) */}
self-auto self-start self-center self-end self-stretch

{/* Gap between children */}
gap-4 gap-x-4 gap-y-2
```

**Common flex patterns:**

```tsx
{/* Center everything */}
<div className="flex items-center justify-center">

{/* Navbar: logo left, links right */}
<header className="flex items-center justify-between">

{/* Card: icon left, text right */}
<div className="flex items-start gap-4">
  <Icon />
  <div className="min-w-0">  {/* min-w-0 prevents text overflow in flex */}
    <p className="truncate">Long title…</p>
  </div>
</div>

{/* Stretch a child to fill remaining space */}
<div className="flex">
  <aside className="w-56 shrink-0">…</aside>
  <main className="flex-1 min-w-0">…</main>  {/* takes remaining width */}
</div>
```

---

## 9. Grid

```tsx
{/* Container */}
grid            {/* display: grid */}

{/* Columns */}
grid-cols-1     {/* 1 column */}
grid-cols-2     {/* 2 equal columns */}
grid-cols-3     {/* 3 equal columns */}
grid-cols-4
grid-cols-12
grid-cols-none  {/* no columns defined */}

{/* Custom template */}
grid-cols-[1fr_2fr_1fr]    {/* arbitrary: sidebar / main / sidebar */}
grid-cols-[200px_1fr]      {/* fixed sidebar + flexible main */}

{/* Gap */}
gap-4 gap-x-6 gap-y-3

{/* Row span / Column span */}
col-span-2      {/* span 2 columns */}
col-span-full   {/* span all columns */}
row-span-2

{/* Placement */}
col-start-2     {/* start at column line 2 */}
col-end-4       {/* end at column line 4 */}
```

**Common grid patterns:**

```tsx
{/* Responsive grid — 1 col mobile, 2 tablet, 4 desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

{/* Auto-fit cards — fill available space, min 280px each */}
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">

{/* Two-column layout with fixed sidebar */}
<div className="grid grid-cols-[16rem_1fr]">
  <aside>Sidebar</aside>
  <main>Content</main>
</div>
```

---

## 10. Borders & Rings

```tsx
{/* Border */}
border          {/* border-width: 1px (all sides) */}
border-2        {/* 2px */}
border-t        {/* top only */}
border-b        {/* bottom only */}
border-x        {/* left + right */}
border-0        {/* remove border */}

border-zinc-200      {/* border color */}
border-transparent

{/* Border radius */}
rounded          {/* 0.25rem */}
rounded-md       {/* 0.375rem */}
rounded-lg       {/* 0.5rem */}
rounded-xl       {/* 0.75rem */}
rounded-2xl      {/* 1rem */}
rounded-full     {/* 9999px — circle / pill */}
rounded-none     {/* 0 */}

{/* Outline ring — for focus states */}
ring-2           {/* box-shadow ring 2px */}
ring-4
ring-blue-500    {/* ring color */}
ring-offset-2    {/* gap between ring and element */}
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2

{/* Remove default outline when using ring */}
outline-none     {/* typically paired with ring on focus */}
```

---

## 11. Shadows & Opacity

```tsx
{/* Shadow */}
shadow-sm        {/* subtle */}
shadow           {/* default */}
shadow-md
shadow-lg        {/* used on dropdown panels */}
shadow-xl
shadow-2xl       {/* very pronounced */}
shadow-none      {/* remove shadow */}
shadow-inner     {/* inward shadow */}

{/* Colored shadow (Tailwind v3+) */}
shadow-lg shadow-blue-500/30

{/* Opacity (element transparency) */}
opacity-0        {/* invisible */}
opacity-50       {/* 50% */}
opacity-75
opacity-100      {/* fully visible */}

{/* Disabled state — combine with pointer-events */}
disabled:opacity-50 disabled:cursor-not-allowed

{/* Backdrop blur — frosted glass */}
backdrop-blur    {/* blur behind element */}
backdrop-blur-sm
backdrop-blur-md
bg-white/90 dark:bg-zinc-900/90 backdrop-blur  {/* frosted glass nav */}
```

---

## 12. Backgrounds & Gradients

```tsx
{/* Solid background */}
bg-white bg-black bg-transparent
bg-zinc-50 bg-zinc-900

{/* Background opacity */}
bg-blue-500/20    {/* 20% opacity */}

{/* Gradient */}
bg-gradient-to-r               {/* left to right */}
bg-gradient-to-br              {/* bottom-right diagonal */}
bg-gradient-to-b               {/* top to bottom */}
from-blue-500                  {/* start color */}
via-purple-500                 {/* middle color (optional) */}
to-indigo-600                  {/* end color */}

{/* Example: hero gradient button */}
<button className="bg-gradient-to-r from-sky-400 to-blue-600 text-white px-6 py-3 rounded-xl">

{/* Background image — set via arbitrary value */}
<div className="bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat">
```

---

## 13. Responsive Design

Tailwind is **mobile-first**: unprefixed classes apply at all sizes; prefixed classes apply from that breakpoint up.

### Breakpoints

| Prefix | Min-width | Typical device |
|---|---|---|
| (none) | 0px | All — mobile first |
| `sm:` | 640px | Phone landscape / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Wide screen |

### Examples

```tsx
{/* Font size: sm on mobile, larger on bigger screens */}
<h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold">

{/* Show/hide elements */}
<nav className="hidden sm:flex">           {/* hidden on mobile, shown sm+ */}
<button className="sm:hidden">            {/* shown only on mobile */}

{/* Grid: 1 col → 2 col → 4 col */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

{/* Padding increases on larger screens */}
<div className="p-4 md:p-8 lg:p-16">

{/* Stack on mobile, side-by-side on tablet */}
<div className="flex flex-col sm:flex-row gap-4">
```

### Max-Width Containers

```tsx
{/* Center content with max width */}
<main className="max-w-3xl mx-auto px-4">   {/* article / blog post */}
<main className="max-w-6xl mx-auto px-4">   {/* wide dashboard */}
<main className="max-w-prose mx-auto px-4"> {/* reading-optimized text */}
```

---

## 14. Dark Mode

### Setup

```ts
// tailwind.config.ts
export default {
  darkMode: "class",  // activate by adding class="dark" to <html>
  // darkMode: "media", // activate via OS preference (prefers-color-scheme)
};
```

### Usage

```tsx
{/* Always write both light and dark variants: */}
<div className="bg-white dark:bg-zinc-900">
<p   className="text-zinc-800 dark:text-white">
<div className="border-zinc-200 dark:border-zinc-700">

{/* With opacity modifier */}
<div className="bg-blue-100 dark:bg-blue-900/30">

{/* Toggle dark mode programmatically */}
document.documentElement.classList.toggle("dark");
```

### Pattern — Dark Mode in This Project

```tsx
// app/layout.tsx — font variables applied to <html>
<html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

// globals.css — respects OS preference at load time
@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
}
```

---

## 15. State Variants

Apply styles conditionally based on element state:

```tsx
{/* Pseudo-classes */}
hover:bg-blue-600          {/* :hover */}
focus:ring-2               {/* :focus */}
focus-visible:ring-2       {/* :focus-visible — keyboard only */}
active:scale-95            {/* :active (click) */}
disabled:opacity-50        {/* :disabled */}
disabled:cursor-not-allowed
checked:bg-blue-500        {/* :checked (checkbox, radio) */}
placeholder:text-zinc-400  {/* ::placeholder */}
first:pt-0                 {/* :first-child */}
last:pb-0                  {/* :last-child */}
odd:bg-zinc-50             {/* :nth-child(odd) */}
even:bg-white              {/* :nth-child(even) */}
empty:hidden               {/* :empty */}

{/* Group — parent hover affects descendants */}
<div className="group rounded-lg border hover:border-blue-400 cursor-pointer">
  <p className="text-zinc-500 group-hover:text-blue-600 transition-colors">
    This changes when the PARENT is hovered
  </p>
  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
    Revealed on parent hover
  </span>
</div>

{/* Peer — sibling state affects another sibling */}
<input id="check" type="checkbox" className="peer sr-only" />
<label
  htmlFor="check"
  className="px-4 py-2 rounded cursor-pointer bg-zinc-100 peer-checked:bg-blue-500 peer-checked:text-white"
>
  Toggle me
</label>

{/* ARIA state variants */}
aria-expanded:rotate-180   {/* rotate chevron when dropdown is open */}
aria-checked:bg-blue-500   {/* style based on aria-checked attribute */}
data-[state=open]:block    {/* data attribute (used by Radix UI, etc.) */}
```

---

## 16. Transitions & Animations

```tsx
{/* Always pair with transition-* for smooth changes */}
transition-colors          {/* smooth color changes */}
transition-all             {/* all properties */}
transition-transform       {/* only transform */}
transition-opacity

{/* Duration */}
duration-150    {/* 150ms — default */}
duration-200
duration-300
duration-500

{/* Easing */}
ease-linear
ease-in
ease-out
ease-in-out    {/* default */}

{/* Delay */}
delay-100   delay-200   delay-300

{/* Transforms */}
scale-95    scale-100   scale-105   {/* resize */}
rotate-180  rotate-90               {/* rotate */}
translate-x-1  -translate-y-1       {/* shift */}

{/* Built-in animations */}
animate-spin      {/* continuous 360° rotation — loading spinners */}
animate-ping      {/* expand + fade — notification badge */}
animate-pulse     {/* fade in/out — skeleton screens */}
animate-bounce    {/* bounce up/down */}

{/* Skeleton screen */}
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
</div>

{/* Loading spinner */}
<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
```

---

## 17. Arbitrary Values

Escape the default scale for one-off values:

```tsx
{/* Any utility + [value] */}
w-[347px]
h-[calc(100vh-3.5rem)]     {/* used for the sidebar in this project */}
top-[117px]
text-[0.8rem]
text-[#1a1a2e]
bg-[#ff0000]
border-[3px]
p-[1.375rem]

{/* Grid templates */}
grid-cols-[1fr_2fr_1fr]    {/* spaces → underscores in multi-word values */}
grid-cols-[200px_1fr]
grid-rows-[auto_1fr_auto]

{/* Background image */}
bg-[url('/path/to/image.jpg')]

{/* CSS variables */}
text-[var(--brand-color)]
bg-[var(--surface)]

{/* Negative values */}
-mt-[10px]
-translate-x-[4px]
```

---

## 18. Configuration (`tailwind.config.ts`)

```ts
import type { Config } from "tailwindcss";

export default {
  // How dark mode activates
  darkMode: "class",  // "class" or "media"

  // Files Tailwind scans for class names
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",      // if using Pages Router
  ],

  theme: {
    // extend: ADD to the default scale (don't replace it)
    extend: {
      // Custom brand colors
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",   // primary
          600: "#2563eb",   // hover
          900: "#1e3a5f",
        },
        // Semantic aliases
        surface: {
          DEFAULT: "#ffffff",
          dark:    "#09090b",
        },
      },

      // Custom font families (used after setting CSS vars in layout.tsx)
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        mono:  ["var(--font-geist-mono)", "monospace"],
      },

      // Custom spacing values (p-18, m-18, gap-18, etc.)
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },

      // Custom border radius
      borderRadius: {
        "4xl": "2rem",
      },

      // Custom breakpoints
      screens: {
        "xs":  "480px",
        "3xl": "1920px",
      },

      // Custom max-width
      maxWidth: {
        "8xl": "88rem",
      },

      // Custom animation
      keyframes: {
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },

  plugins: [
    // require("@tailwindcss/forms"),        // better form element styles
    // require("@tailwindcss/typography"),   // rich text prose styling
    // require("@tailwindcss/aspect-ratio"), // aspect ratio utilities
  ],
} satisfies Config;
```

---

## 19. `@apply` — CSS Escape Hatch

`@apply` extracts Tailwind utilities into a CSS class. Use sparingly.

```css
/* globals.css */

/* ✓ Good — repeated patterns with many utilities */
.btn {
  @apply rounded-lg px-4 py-2 text-sm font-medium transition-colors;
}
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white;
}
.btn-secondary {
  @apply border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700;
}

.badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
}
.badge-blue  { @apply bg-blue-100 text-blue-800; }
.badge-green { @apply bg-green-100 text-green-800; }

/* ✗ Avoid — single or rarely used classes don't benefit from @apply */
.my-heading { @apply text-2xl font-bold; }  /* just use className directly */
```

**When to use `@apply`:**
- High-reuse patterns used across many files (`.btn`, `.badge`, `.input`, `.card`)
- Third-party content you can't add classes to (Markdown, CMS output)

**When NOT to use `@apply`:**
- Single-component styles — extract a React component instead
- One-off variants — use inline classes
- Complex conditional styling — use `clsx`

---

## 20. clsx + tailwind-merge Pattern

The standard pattern for conditional classes in React projects:

```bash
npm install clsx tailwind-merge
```

```ts
// lib/utils.ts — create once, import everywhere
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = clsx (conditional joining) + twMerge (conflict resolution)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// Usage
import { cn } from "@/lib/utils";

// Conditional classes — clean and readable
<button
  className={cn(
    // Base classes always applied
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
    // Conditional variants
    variant === "primary"   && "bg-blue-500 hover:bg-blue-600 text-white",
    variant === "secondary" && "border border-zinc-300 bg-white hover:bg-zinc-50",
    variant === "ghost"     && "hover:bg-zinc-100 text-zinc-700",
    // Disabled state
    disabled && "opacity-50 cursor-not-allowed",
    // External className prop (passed from parent)
    className
  )}
>

// twMerge resolves Tailwind conflicts:
cn("p-4", "p-6")          // → "p-6"    (p-4 removed)
cn("text-sm", "text-lg")  // → "text-lg"
cn("px-4 py-2", "p-6")    // → "p-6"    (px/py removed, p wins)
cn("bg-red-500", "bg-blue-500")  // → "bg-blue-500"
```

**Why `twMerge` matters:**

Without it, conflicting Tailwind classes both appear in the string. The browser applies the last one defined in the stylesheet (not the last one in your string), which is unpredictable.

```tsx
// Without twMerge — both classes appear, browser picks one unpredictably
className="p-4 p-6"   // could be 1rem or 1.5rem depending on stylesheet order

// With twMerge — always last-specified wins
twMerge("p-4 p-6")   // → "p-6" — deterministic
```

---

## 21. Component Patterns

### Button

```tsx
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        // Size variants
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        // Color variants
        variant === "primary"   && "bg-blue-500 hover:bg-blue-600 text-white",
        variant === "secondary" && "border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200",
        variant === "ghost"     && "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200",
        variant === "danger"    && "bg-red-500 hover:bg-red-600 text-white",
        // Disabled
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Card

```tsx
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl border border-zinc-200 dark:border-zinc-700",
      "bg-white dark:bg-zinc-900",
      "p-6 shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}
```

### Badge

```tsx
const badgeVariants = {
  blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  red:    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  zinc:   "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
};

function Badge({ children, variant = "zinc" }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      badgeVariants[variant]
    )}>
      {children}
    </span>
  );
}
```

### Input

```tsx
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-zinc-300 dark:border-zinc-600",
        "bg-white dark:bg-zinc-800",
        "px-3 py-2 text-sm text-zinc-800 dark:text-white",
        "placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
```

### Loading Skeleton

```tsx
function Skeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"
          style={{ width: `${60 + (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}
```

---

## 22. Tailwind in Next.js

### globals.css — Import in Root Layout

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Or for Tailwind v4: */
@import "tailwindcss";

/* Custom CSS variables */
:root {
  --brand: #6366f1;
}

/* Dark mode base styles */
body {
  @apply bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100;
}
```

```tsx
// app/layout.tsx — import globals.css once here
import "./globals.css";
```

### Font Variables with Tailwind

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

<html className={inter.variable}>  // expose as CSS variable

// tailwind.config.ts
fontFamily: {
  inter: ["var(--font-inter)", "sans-serif"],
}

// Usage
<p className="font-inter">Styled with Inter</p>
```

### Tailwind v3 vs v4 in Next.js

| | Tailwind v3 | Tailwind v4 |
|---|---|---|
| Config file | `tailwind.config.ts` | Optional — can configure in CSS |
| Directives | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| PostCSS plugin | `tailwindcss` | `@tailwindcss/postcss` |
| JIT | Default | Only mode |

---

## 23. Common Mistakes

| Mistake | Fix |
|---|---|
| Dynamic class: `bg-${color}-500` | Use a lookup object: `const map = { blue: "bg-blue-500" }` |
| Conflicting classes: `p-4 p-6` | Use `tailwind-merge` — `twMerge("p-4", "p-6")` → `"p-6"` |
| No dark: variant | Always pair light + dark: `bg-white dark:bg-zinc-900` |
| Flex overflow — text spills out | Add `min-w-0` to the flex child containing text |
| `focus:ring` without `outline-none` | Pair them: `focus:outline-none focus:ring-2` |
| Transition without `transition-*` class | Add `transition-colors` or `transition-all` for smooth state changes |
| `opacity-50` without `pointer-events-none` | For non-interactive disabled states add both |
| Long class strings hard to read | Extract to a component or use `cn()` with multi-line object syntax |
| `@apply` everywhere | Prefer React components for reuse — `@apply` only for global patterns |
| Not specifying `content` in config | Tailwind can't find class names if content paths are wrong → empty CSS |
