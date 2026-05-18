// GenerateMetadataDemo — Client Component that demos generateMetadata().
//
// WHY "use client"?
//   useRouter and useState are client-only APIs.
//   This component collects user input (title, description) and uses
//   useRouter.push() to navigate to the demo-page with those values
//   encoded as query params.
//
// HOW THE DEMO WORKS:
//   1. User types a title and description in the inputs here.
//   2. On button click, router.push() navigates to:
//      /learn/metadata/demo-page?title=...&description=...
//   3. The demo-page's generateMetadata() function reads those searchParams
//      SERVER-SIDE and returns a Metadata object with those values.
//   4. Next.js injects the <title> and <meta name="description"> into <head>
//      BEFORE streaming the HTML to the browser.
//   5. The user can inspect the browser tab and page source to verify.

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateMetadataDemo() {
  const router = useRouter();
  // Controlled inputs — values become query params when navigating
  const [title, setTitle] = useState("My Custom Title");
  const [description, setDescription] = useState("Generated server-side from query params");

  function navigate() {
    // Encode the user-typed values as URL query params
    const params = new URLSearchParams({ title, description });
    // Client-side navigation to the demo page — Next.js calls generateMetadata()
    // on the server before streaming the page HTML
    router.push(`/learn/metadata/demo-page?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {/* title input — becomes the <title> tag via generateMetadata() */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title…"
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {/* description input — becomes <meta name="description"> */}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Meta description…"
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {/* Navigate to demo-page with the typed values as query params */}
      <button
        onClick={navigate}
        className="rounded-lg bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium transition-colors"
      >
        Open demo page with these metadata values →
      </button>
      <p className="text-xs text-zinc-400">
        The demo page calls{" "}
        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">generateMetadata()</code>{" "}
        server-side and injects the values into{" "}
        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;head&gt;</code> before
        streaming HTML. Check the browser tab and page source to verify.
      </p>
    </div>
  );
}
