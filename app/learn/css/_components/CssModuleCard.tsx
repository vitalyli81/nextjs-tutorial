// CssModuleCard — demonstrates CSS Modules in a Server Component.
//
// HOW CSS MODULES WORK:
//   1. Name your CSS file with ".module.css" suffix.
//   2. Import it — Next.js returns a plain JS object where each key is a
//      class name from the CSS file and each value is the hashed output name.
//   3. Apply classes via the styles object: className={styles.card}
//   4. Combine multiple classes with template literals or clsx/classnames.
//
// WHY SERVER COMPONENT?
//   This component has no interactivity — no useState, no event handlers.
//   CSS Modules work identically in Server and Client Components.
//   Keeping it a Server Component avoids adding it to the JS bundle.

import styles from "./module-demo.module.css";

export function CssModuleCard() {
  return (
    <div className="space-y-3">
      {/* Combining two module classes: .card (base) + .primary (variant) */}
      <div className={`${styles.card} ${styles.primary}`}>
        CSS Module — <code>.primary</code> variant
      </div>

      {/* .card + .secondary variant — same base class, different color scheme */}
      <div className={`${styles.card} ${styles.secondary}`}>
        CSS Module — <code>.secondary</code> variant
      </div>

      {/* Standalone .pill class — shows a different shape entirely */}
      <div>
        <span className={styles.pill}>pill class</span>
      </div>

      {/* Explains what the compiled output looks like in the browser */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-2">
        Class names are hashed at build time: <br />
        {/* .primary in source → ._primary_abc12_1 in compiled HTML */}
        <span className="text-purple-500">.primary</span>{" "}
        →{" "}
        <span className="text-zinc-400">._primary_abc12_1</span>
      </p>
    </div>
  );
}
