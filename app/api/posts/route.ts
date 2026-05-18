import { NextRequest, NextResponse } from "next/server";

export type Post = {
  id: number;
  title: string;
  body: string;
  author: string;
};

const TOTAL = 200;
const PAGE_SIZE = 20;

function makePost(id: number): Post {
  return {
    id,
    title: `Post #${id} — ${adjectives[id % adjectives.length]} ${nouns[id % nouns.length]}`,
    body: sentences[id % sentences.length],
    author: authors[id % authors.length],
  };
}

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = Math.min(from + PAGE_SIZE, TOTAL);

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 600));

  const posts = Array.from({ length: to - from }, (_, i) => makePost(from + i + 1));
  return NextResponse.json({ posts, nextPage: to < TOTAL ? page + 1 : null });
}

const adjectives = ["Amazing", "Bold", "Curious", "Dazzling", "Elegant", "Fearless", "Gentle", "Happy", "Inspired", "Joyful"];
const nouns = ["Journey", "Vision", "Discovery", "Adventure", "Insight", "Moment", "Story", "Dream", "Challenge", "Horizon"];
const sentences = [
  "Exploring new ideas and pushing boundaries every single day.",
  "The world is full of surprises waiting to be uncovered.",
  "Every line of code is a small step toward something greater.",
  "Curiosity is the engine of achievement.",
  "Great things never come from comfort zones.",
];
const authors = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Henry"];
