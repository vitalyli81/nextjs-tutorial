// @analytics/detail/page.tsx — rendered in the @analytics slot when the
// user navigates to /dashboard/analytics-detail. The @team slot is unaffected.

import Link from "next/link";

export default async function AnalyticsDetail() {
  // Simulate a slow data fetch — watch this slot show loading.tsx
  // while @team stays fully interactive
  await new Promise(r => setTimeout(r, 800));

  const rows = [
    { page: "/home",       views: 4820, bounce: "31%" },
    { page: "/pricing",    views: 2310, bounce: "42%" },
    { page: "/docs",       views: 1840, bounce: "28%" },
    { page: "/blog",       views: 1200, bounce: "55%" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono text-zinc-400">@analytics/detail/page.tsx</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
            <th className="text-left pb-1.5 font-medium">Page</th>
            <th className="text-right pb-1.5 font-medium">Views</th>
            <th className="text-right pb-1.5 font-medium">Bounce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
          {rows.map(r => (
            <tr key={r.page}>
              <td className="py-1.5 text-zinc-600 dark:text-zinc-300 font-mono">{r.page}</td>
              <td className="py-1.5 text-right text-zinc-800 dark:text-white font-medium">{r.views.toLocaleString()}</td>
              <td className="py-1.5 text-right text-zinc-500">{r.bounce}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/examples/slots/dashboard" className="block text-center text-xs text-blue-500 hover:underline">
        ← back to overview
      </Link>
    </div>
  );
}
