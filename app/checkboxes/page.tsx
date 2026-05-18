import CheckboxApp from "./_components/CheckboxApp";

export default function CheckboxesPage() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center pt-20 pb-10 px-4">
      <div className="w-full max-w-lg mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Checkbox Tree</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Nested checkboxes · indeterminate state · O(1) read · O(depth) write
        </p>
      </div>
      <CheckboxApp />
    </main>
  );
}
