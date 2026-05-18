// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 8 — CSS
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • Tailwind CSS         — utility-first; classes applied directly in JSX;
//                            Next.js includes it by default via create-next-app
//   • CSS Modules          — .module.css files; class names are hashed at build
//                            time to prevent global naming collisions
//   • globals.css          — imported once in root layout.tsx; applies everywhere;
//                            contains @tailwind directives and base styles
//
// This PAGE is a Server Component (no "use client").
// CssModuleCard is also a Server Component — it just renders JSX with
// module CSS imports, no interactivity needed.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { CssModuleCard } from "./_components/CssModuleCard";

export const metadata: Metadata = { title: "CSS" };

export default function CssPage() {
  return (
    <ChapterLayout
      slug="css"
      title="CSS"
      docsHref="https://nextjs.org/docs/app/getting-started/css"
    >
      {/* ── Demo 1: Tailwind CSS ───────────────────────────────────────── */}
      <Demo concept="Tailwind CSS" title="Utility classes — style directly in JSX, no CSS files needed">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Tailwind scans your source files at build time and ships <strong>only the classes you use</strong>.
          No runtime stylesheet generation, no naming conflicts, and tree-shaking is automatic.
          Style elements by composing small utility classes directly in your JSX.
        </p>
        {/* Live example: gradient box styled entirely with Tailwind utility classes */}
        <div className="space-y-3">
          <div className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-5 py-3 text-sm font-medium shadow-lg">
            className=&quot;rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-5 py-3&quot;
          </div>
          {/* Each chip shows a single Tailwind utility class */}
          <div className="flex gap-2 flex-wrap">
            {["rounded-xl", "shadow-lg", "border", "p-4", "text-sm", "font-bold", "dark:bg-zinc-800"].map((cls) => (
              <span
                key={cls}
                className="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 text-xs font-mono"
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
        <CodeBlock>{`// No separate CSS file needed — compose utilities directly in JSX:
<button className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-4 py-2
                   text-sm font-medium transition-colors">
  Click me
</button>

// Dark mode variant — prefix with dark:
<div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
  Adapts to the OS/user color scheme
</div>

// Responsive breakpoints — sm:, md:, lg:, xl:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>`}
        </CodeBlock>
        <Callout kind="rule">
          Tailwind is configured in <code>tailwind.config.ts</code> and loaded via{" "}
          <code>globals.css</code>. Next.js includes it by default when you select it during{" "}
          <code>create-next-app</code>. Dark mode is set to <code>class</code> strategy
          — add the <code>dark</code> class to <code>&lt;html&gt;</code> to activate it.
        </Callout>
      </Demo>

      {/* ── Demo 2: CSS Modules ────────────────────────────────────────── */}
      <Demo concept="CSS Modules" title="Scoped styles via .module.css — class names are hashed to avoid collisions">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          CSS Modules are locally scoped by default. A class named{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">.card</code> in one module
          never conflicts with <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">.card</code> in
          another — Next.js hashes each class name at build time.
          The cards below are styled with <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">module-demo.module.css</code>:
        </p>

        {/* CssModuleCard uses CSS Module imports — see _components/CssModuleCard.tsx */}
        <CssModuleCard />

        <CodeBlock>{`// ── module-demo.module.css ─────────────────────────────────────
.card {
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.15s ease;
}
.card:hover { transform: translateY(-2px); }  /* pseudo-selectors work normally */

.primary  { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
.secondary { background: #f1f5f9; color: #334155; }

// ── CssModuleCard.tsx ──────────────────────────────────────────
import styles from "./module-demo.module.css";  // import the module

// Access classes as properties of the styles object:
<div className={styles.card}>default card</div>

// Combine multiple classes with template literals:
<div className={\`\${styles.card} \${styles.primary}\`}>primary</div>

// Compiled output — class names are hashed to guarantee uniqueness:
// <div class="_card_abc12_1 _primary_abc12_4">…</div>`}
        </CodeBlock>
        <Callout kind="tip">
          CSS Modules work great alongside Tailwind. Use <strong>Tailwind</strong> for spacing,
          layout, typography, and colors. Use <strong>CSS Modules</strong> for complex
          component-specific styles: animations, pseudo-selectors, keyframes, or anything
          awkward to express with utility classes.
        </Callout>
      </Demo>

      {/* ── Demo 3: globals.css ────────────────────────────────────────── */}
      <Demo concept="globals.css" title="Imported once in the root layout — applies to every page">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Global styles (CSS resets, custom properties, base typography) go in{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">app/globals.css</code>.
          Import it <strong>once</strong> in the root <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">layout.tsx</code> —
          it automatically applies to every page in your app.
        </p>
        <CodeBlock>{`// app/globals.css
@tailwind base;        /* Tailwind's reset + base element styles */
@tailwind components;  /* component utilities (rarely customized) */
@tailwind utilities;   /* all the utility classes (rounded, flex, etc.) */

/* Your custom global styles — CSS variables, base resets, fonts */
:root {
  --brand:      #6366f1;
  --brand-dark: #8b5cf6;
}

/* Base typography tied to the Inter font loaded in layout.tsx */
body {
  font-family: var(--font-inter);
}

// app/layout.tsx — import once here, works everywhere
import "./globals.css";`}
        </CodeBlock>
        <Callout kind="warning">
          Global CSS files can only be imported in <code>layout.tsx</code> or <code>page.tsx</code> files,
          not in arbitrary component files. For component-scoped styles, use CSS Modules or
          inline Tailwind utilities.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "<strong>Tailwind CSS</strong>: apply utility classes directly in JSX (<code>className</code>). Next.js tree-shakes unused classes at build time — only used classes ship to the browser.",
        "Tailwind dark mode: prefix classes with <code>dark:</code> (e.g. <code>dark:bg-zinc-800</code>). Configured via <code>darkMode: 'class'</code> in <code>tailwind.config.ts</code> — add <code>dark</code> class to <code>&lt;html&gt;</code> to activate.",
        "Tailwind responsive breakpoints: prefix with <code>sm:</code>, <code>md:</code>, <code>lg:</code>, <code>xl:</code>. Mobile-first — unprefixed styles apply to all sizes.",
        "<strong>CSS Modules</strong>: name files <code>*.module.css</code>. Import as <code>import styles from './name.module.css'</code>. Use classes as <code>className={styles.card}</code>.",
        "CSS Module class names are <strong>hashed at build time</strong> (e.g. <code>.card</code> → <code>._card_abc12_1</code>) — zero risk of global naming collisions.",
        "<strong>globals.css</strong>: put base styles, CSS resets, and Tailwind directives here. Import it <strong>once</strong> in <code>app/layout.tsx</code> — it applies to every route automatically.",
        "Global CSS files can only be imported in <code>layout.tsx</code> or <code>page.tsx</code>, not in component files. Use CSS Modules for component-scoped styles.",
      ]} />
    </ChapterLayout>
  );
}
