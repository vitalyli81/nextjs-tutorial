"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-100">
        <h1 className="text-2xl font-bold text-zinc-800">Something went wrong</h1>
        <p className="text-sm text-zinc-500">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-zinc-800 text-white px-5 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
