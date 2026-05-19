// ─────────────────────────────────────────────────────────────────────────────
// _data/chapters.ts — Single source of truth for the chapter list.
//
// WHY A SEPARATE FILE?
//   This array is used in four places:
//     1. learn/layout.tsx      — sidebar nav (renders all chapter links)
//     2. ChapterLayout.tsx     — prev/next navigation between chapters
//     3. learn/page.tsx        — chapter index cards on the /learn landing page
//     4. NavBar.tsx            — "Learn" dropdown menu in the top nav
//
//   Keeping it here avoids duplication and ensures all four are always in sync.
//   If you add a new chapter, add it here and it appears everywhere automatically.
//
// NAMING CONVENTION:
//   slug — matches the folder name under app/learn/ (URL segment)
//   title — displayed in the sidebar, nav dropdown, and chapter index cards
// ─────────────────────────────────────────────────────────────────────────────

export const chapters = [
  { slug: "project-structure",      title: "1. Project Structure"    },
  { slug: "layouts-and-pages",      title: "2. Layouts & Pages"      },
  { slug: "linking-and-navigating", title: "3. Linking & Navigating" },
  { slug: "server-and-client",      title: "4. Server & Client"      },
  { slug: "fetching-data",          title: "5. Fetching Data"        },
  { slug: "mutating-data",          title: "6. Mutating Data"        },
  { slug: "error-handling",         title: "7. Error Handling"       },
  { slug: "route-handlers",         title: "8. Route Handlers"       },
  { slug: "css",                    title: "9. CSS"                  },
  { slug: "fonts-and-images",       title: "10. Fonts & Images"      },
  { slug: "metadata",               title: "11. Metadata"            },
  { slug: "state-management",       title: "12. State Management"    },
  { slug: "tailwind-css",           title: "13. Tailwind CSS"        },
  { slug: "typescript",             title: "14. TypeScript"          },
];
