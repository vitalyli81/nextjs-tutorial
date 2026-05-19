// @analytics/page.tsx — the analytics slot overview.
// This file is in a real @analytics folder — Next.js passes it
// as the `analytics` prop to dashboard/layout.tsx automatically.

import Link from "next/link";

export default function AnalyticsOverview() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono text-zinc-400">@analytics/page.tsx</p>
      <div className="grid grid-cols-2 gap-2">
        {[["Revenue", "$12,430"], ["Sessions", "2,140"], ["Bounce", "38%"], ["Conv.", "4.2%"]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-2.5 text-center">
            <p className="text-base font-bold text-zinc-800 dark:text-white">{v}</p>
            <p className="text-[10px] text-zinc-400">{k}</p>
          </div>
        ))}
      </div>
      <Link
        href="/examples/slots/dashboard/analytics-detail"
        className="block text-center text-xs text-blue-500 hover:underline"
      >
        View detail →
      </Link>
    </div>
  );
}
