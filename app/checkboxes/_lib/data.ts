import type { RawNode } from "./tree";

// Multi-level nested sample data  –  4 levels deep
export const RAW_TREE: RawNode[] = [
  {
    id: "frontend",
    label: "Frontend",
    children: [
      {
        id: "react",
        label: "React",
        children: [
          { id: "hooks", label: "Hooks", children: [
            { id: "useState", label: "useState" },
            { id: "useEffect", label: "useEffect" },
            { id: "useRef", label: "useRef" },
          ]},
          { id: "context", label: "Context API" },
          { id: "suspense", label: "Suspense" },
        ],
      },
      {
        id: "nextjs",
        label: "Next.js",
        children: [
          { id: "approuter", label: "App Router", children: [
            { id: "layouts", label: "Layouts" },
            { id: "pages", label: "Pages" },
            { id: "loading", label: "Loading UI" },
          ]},
          { id: "serveractions", label: "Server Actions" },
          { id: "rsc", label: "Server Components" },
        ],
      },
      {
        id: "css",
        label: "CSS",
        children: [
          { id: "tailwind", label: "Tailwind CSS" },
          { id: "cssmodules", label: "CSS Modules" },
        ],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    children: [
      {
        id: "node",
        label: "Node.js",
        children: [
          { id: "express", label: "Express" },
          { id: "fastify", label: "Fastify" },
        ],
      },
      {
        id: "databases",
        label: "Databases",
        children: [
          { id: "postgres", label: "PostgreSQL" },
          { id: "redis", label: "Redis" },
          { id: "sqlite", label: "SQLite" },
        ],
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    children: [
      { id: "docker", label: "Docker" },
      { id: "ci", label: "CI / CD", children: [
        { id: "github-actions", label: "GitHub Actions" },
        { id: "vercel", label: "Vercel" },
      ]},
    ],
  },
];
