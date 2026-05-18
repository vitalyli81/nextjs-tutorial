// Pure data layer — imported by both the RSC page (direct call) and the
// Route Handler (paginated API). Keeping the logic here avoids the
// anti-pattern of a Server Component fetching its own Route Handler over HTTP.

export type Post = {
  id: number;
  title: string;
  body: string;
  author: string;
};

export const TOTAL_POSTS = 200;
export const PAGE_SIZE = 20;

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

export function makePost(id: number): Post {
  return {
    id,
    title: `Post #${id} — ${adjectives[id % adjectives.length]} ${nouns[id % nouns.length]}`,
    body: sentences[id % sentences.length],
    author: authors[id % authors.length],
  };
}

export type PostsPage = {
  posts: Post[];
  nextPage: number | null;
};

// Returns one page of posts. nextPage is null when the last page is reached.
export function getPostsPage(page: number): PostsPage {
  const from = (page - 1) * PAGE_SIZE;
  const to = Math.min(from + PAGE_SIZE, TOTAL_POSTS);
  const posts = Array.from({ length: to - from }, (_, i) => makePost(from + i + 1));
  return { posts, nextPage: to < TOTAL_POSTS ? page + 1 : null };
}
