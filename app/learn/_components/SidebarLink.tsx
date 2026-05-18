// SidebarLink — a single nav item in the /learn sidebar.
//
// Why "use client"?
//   usePathname() is a client-side hook — it reads the current URL from the
//   browser router. We keep this as a small isolated Client Component so the
//   parent LearnLayout stays a Server Component (cheaper, no JS bundle impact).
//
// Pattern: "client island" — a tiny interactive wrapper inside a server tree.
//
// Active state: compares usePathname() with the href prop. When they match
// the link gets a blue highlight so the user always knows where they are.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  // usePathname() returns the current URL path, e.g. "/learn/fetching-data"
  // It re-renders this component whenever the route changes.
  const pathname = usePathname();

  // Exact match — "/learn/fetching-data" === "/learn/fetching-data"
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          // Active: blue tinted background + blue text
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
          // Inactive: muted text, subtle hover background
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
      }`}
    >
      {children}
    </Link>
  );
}
