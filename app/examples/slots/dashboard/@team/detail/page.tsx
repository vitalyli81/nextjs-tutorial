// @team/detail/page.tsx — rendered in the @team slot when the user navigates
// to /dashboard/team-detail. The @analytics slot is unaffected.

import Link from "next/link";

export default async function TeamDetail() {
  // Simulate a slow fetch — this slot shows loading.tsx while @analytics stays live
  await new Promise(r => setTimeout(r, 800));

  const members = [
    { name: "Alice",  role: "Engineering", prs: 12, reviews: 34, merged: 11 },
    { name: "Bob",    role: "Engineering", prs: 8,  reviews: 21, merged: 7  },
    { name: "Carol",  role: "Design",      prs: 3,  reviews: 9,  merged: 3  },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono text-zinc-400">@team/detail/page.tsx</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
            <th className="text-left pb-1.5 font-medium">Member</th>
            <th className="text-right pb-1.5 font-medium">PRs</th>
            <th className="text-right pb-1.5 font-medium">Reviews</th>
            <th className="text-right pb-1.5 font-medium">Merged</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
          {members.map(m => (
            <tr key={m.name}>
              <td className="py-1.5 text-zinc-700 dark:text-zinc-200 font-medium">{m.name}</td>
              <td className="py-1.5 text-right text-zinc-800 dark:text-white">{m.prs}</td>
              <td className="py-1.5 text-right text-zinc-500">{m.reviews}</td>
              <td className="py-1.5 text-right text-purple-500">{m.merged}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/examples/slots/dashboard" className="block text-center text-xs text-purple-500 hover:underline">
        ← back to overview
      </Link>
    </div>
  );
}
