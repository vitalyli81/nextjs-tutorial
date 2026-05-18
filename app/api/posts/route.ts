// Route Handler — handles GET /api/posts?page=N
// Called by the client-side VirtualFeed when the user scrolls near the bottom.
// Page 1 is never fetched here; the RSC page calls getPostsPage() directly.

import { NextRequest, NextResponse } from "next/server";
import { getPostsPage } from "../../feed/_lib/posts";

// Re-export Post so VirtualFeed can import the type from one place.
export type { Post } from "../../feed/_lib/posts";

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1);

  // Simulate network latency so the loading spinner is visible in demos.
  await new Promise((r) => setTimeout(r, 600));

  return NextResponse.json(getPostsPage(page));
}
