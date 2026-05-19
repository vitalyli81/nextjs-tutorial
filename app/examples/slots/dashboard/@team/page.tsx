// @team/page.tsx — the team slot overview.

import Link from "next/link";

const members = [
  { name: "Alice",  role: "Engineering", prs: 12, color: "bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200" },
  { name: "Bob",    role: "Engineering", prs: 8,  color: "bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200" },
  { name: "Carol",  role: "Design",      prs: 3,  color: "bg-pink-200 dark:bg-pink-800 text-pink-700 dark:text-pink-200" },
];

export default function TeamOverview() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono text-zinc-400">@team/page.tsx</p>
      <div className="space-y-2">
        {members.map(m => (
          <div key={m.name} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${m.color}`}>
              {m.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 dark:text-white">{m.name}</p>
              <p className="text-[10px] text-zinc-400">{m.role}</p>
            </div>
            <span className="text-xs text-zinc-500">{m.prs} PRs</span>
          </div>
        ))}
      </div>
      <Link href="/examples/slots/dashboard/team-detail" className="block text-center text-xs text-purple-500 hover:underline">
        View detail →
      </Link>
    </div>
  );
}
