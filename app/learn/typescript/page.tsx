// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 14 — TypeScript
//
// KEY CONCEPTS IN THIS FILE:
//   • Primitive types      — string, number, boolean, null, undefined
//   • Union & literal      — "a" | "b", string | null
//   • Type vs interface    — when to use each
//   • Generics             — reusable types with type parameters
//   • Utility types        — Partial, Required, Pick, Omit, Record, ReturnType
//   • React + TypeScript   — typing props, events, refs, and hooks
//   • Type narrowing       — typeof, in, instanceof, discriminated unions
//   • as const & satisfies — tighten inference without losing type info
//
// This PAGE is a Server Component — pure reference content, no interactivity.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";

export const metadata: Metadata = { title: "TypeScript" };

export default function TypeScriptPage() {
  return (
    <ChapterLayout
      slug="typescript"
      title="TypeScript"
      docsHref="https://www.typescriptlang.org/docs/"
    >

      {/* ── Demo 1: Primitives, arrays, objects ───────────────────────── */}
      <Demo concept="Primitives · Arrays · Objects" title="The basic building blocks of TypeScript types">
        <CodeBlock>{`// ── Primitives ─────────────────────────────────────────────────
let name:    string  = "Alice";
let age:     number  = 30;
let active:  boolean = true;
let nothing: null    = null;
let missing: undefined = undefined;

// ── Arrays ──────────────────────────────────────────────────────
let ids: number[]        = [1, 2, 3];   // preferred syntax
let ids: Array<number>   = [1, 2, 3];   // generic syntax — identical

// ── Objects / inline type annotation ────────────────────────────
let user: { id: number; name: string; role?: string } = {
  id: 1,
  name: "Alice",
  // role is optional (?) — may be omitted
};

// ── Tuple — fixed-length array with known types at each index ───
let point: [number, number] = [10, 20];
let entry: [string, number] = ["Alice", 30];`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 2: Union, literal, type aliases ──────────────────────── */}
      <Demo concept="Union · Literal · Type alias" title="Combining types and giving them names">
        <CodeBlock>{`// ── Union — value can be one of several types ───────────────────
let id: string | number = 42;
id = "abc";                    // also valid

// ── Literal — restrict to exact values ──────────────────────────
type Direction  = "north" | "south" | "east" | "west";
type StatusCode = 200 | 400 | 404 | 500;

// ── Type alias — name for any type expression ────────────────────
type UserId = string | number;
type Point  = { x: number; y: number };

// ── Optional (?) vs nullable (| null) ───────────────────────────
type A = { name?: string };          // name may be absent (undefined)
type B = { name: string | null };    // name must be present but can be null
// These are different — ? is "may not exist", | null is "exists but empty"`}
        </CodeBlock>
        <Callout kind="tip">
          Prefer <code>string | null</code> over <code>string?</code> when the field is always
          present in the object but can be empty — it makes the intent explicit and avoids
          accidental <code>undefined</code> access.
        </Callout>
      </Demo>

      {/* ── Demo 3: Interface vs type ─────────────────────────────────── */}
      <Demo concept="interface vs type" title="Two ways to describe object shapes — know when to use each">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          Both can describe an object shape, but they have different strengths.
          The short rule: <strong>use <code>interface</code> when you&apos;re describing a thing</strong> (a component, a model, a contract),
          and <strong>use <code>type</code> when you&apos;re computing or combining types</strong>.
        </p>
        <CodeBlock>{`// ── interface — for object shapes and component props ───────────
// ✅ Use when: you have a named entity (User, ButtonProps, ApiResponse)
//    or when other interfaces might extend it later.
interface User {
  id: number;
  name: string;
  email?: string;
}

// interface can be extended — great for building on a base shape:
interface Admin extends User {
  permissions: string[];
}

// ── type — for everything else ───────────────────────────────────
// ✅ Use when: the type is a union, tuple, function signature,
//    or a transformation of another type (Partial<T>, Pick<T,K>…).
type UserId   = string | number;          // union — interface can't do this
type Point    = [number, number];         // tuple — interface can't do this
type Callback = (id: number) => void;     // function type
type Maybe<T> = T | null | undefined;     // generic alias / wrapper

// ── Side-by-side comparison ──────────────────────────────────────
//                        interface   type
// Object shape           ✅          ✅
// extends / implements   ✅          ❌ (use & intersection instead)
// Union  (A | B)         ❌          ✅
// Tuple  ([A, B])        ❌          ✅
// Function type          ❌          ✅
// Mapped / conditional   ❌          ✅
// Reopen & merge decls   ✅          ❌ (type aliases are closed)`}
        </CodeBlock>
        <Callout kind="rule">
          Use <code>interface</code> for component props and object shapes — it gives better
          error messages and supports <code>extends</code>. Use <code>type</code> for unions,
          tuples, function signatures, and anything <code>interface</code> can&apos;t express.
        </Callout>
      </Demo>

      {/* ── Demo 4: Generics ──────────────────────────────────────────── */}
      <Demo concept="Generics" title="Write once, type correctly for any type">
        <CodeBlock>{`// ── Basic generic function ───────────────────────────────────────
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first([1, 2, 3]);       // → number | undefined
first(["a", "b"]);      // → string | undefined

// ── Generic interface ─────────────────────────────────────────────
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}
type UserResponse = ApiResponse<User>;   // data is User
type PostsResponse = ApiResponse<Post[]>; // data is Post[]

// ── Constraints — T must have these fields ───────────────────────
function getLabel<T extends { label: string }>(item: T): string {
  return item.label;
}

// ── Default type parameter ────────────────────────────────────────
interface Box<T = string> {
  value: T;
}
const box: Box = { value: "hello" };    // T defaults to string`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 5: Utility types ─────────────────────────────────────── */}
      <Demo concept="Utility types" title="Built-in helpers that transform existing types">
        <CodeBlock>{`interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Partial<T>   — all fields become optional (great for update payloads)
type UserUpdate = Partial<User>;
// → { id?: number; name?: string; email?: string; role?: ... }

// Required<T>  — all optional fields become required
// Pick<T, K>   — keep only the listed keys
type UserPreview = Pick<User, "id" | "name">;
// → { id: number; name: string }

// Omit<T, K>   — remove the listed keys
type PublicUser = Omit<User, "email" | "role">;
// → { id: number; name: string }

// Record<K, V> — object type with keys K and values V
type RoleMap = Record<"admin" | "user", string[]>;
// → { admin: string[]; user: string[] }

// ReturnType<T> — extract what a function returns
function fetchUser() { return { id: 1, name: "Alice" }; }
type FetchedUser = ReturnType<typeof fetchUser>;
// → { id: number; name: string }

// NonNullable<T> — remove null and undefined from a union
type SafeId = NonNullable<number | null | undefined>; // → number`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 6: React + TypeScript ────────────────────────────────── */}
      <Demo concept="React + TypeScript" title="Typing props, events, refs, and hooks">
        <CodeBlock>{`// ── Component props ─────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  children?: React.ReactNode;   // any renderable content
}

export function Button({ label, onClick, variant = "primary", disabled }: ButtonProps) { … }

// ── Event handlers ───────────────────────────────────────────────
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
}
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}
function handleClick(e: React.MouseEvent<HTMLButtonElement>) { … }
function handleKey(e: React.KeyboardEvent<HTMLInputElement>) { … }

// ── useRef ───────────────────────────────────────────────────────
const inputRef  = useRef<HTMLInputElement>(null);   // DOM element
const timerRef  = useRef<ReturnType<typeof setTimeout>>(null); // mutable value

// ── useState ─────────────────────────────────────────────────────
const [user, setUser]   = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// ── Server Component props (Next.js) ─────────────────────────────
// In Next.js 15, params and searchParams are Promises:
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
}`}
        </CodeBlock>
        <Callout kind="tip">
          Use <code>React.ReactNode</code> for <code>children</code> (anything renderable) and{" "}
          <code>React.ReactElement</code> when you need a single JSX element specifically.
          <code>ReactNode</code> is almost always the right choice.
        </Callout>
      </Demo>

      {/* ── Demo 7: Type narrowing ────────────────────────────────────── */}
      <Demo concept="Type narrowing" title="Help TypeScript understand which type you're working with">
        <CodeBlock>{`// ── typeof — for primitives ──────────────────────────────────────
function format(value: string | number) {
  if (typeof value === "string") return value.toUpperCase(); // string here
  return value.toFixed(2);                                   // number here
}

// ── in — check if a key exists on an object ──────────────────────
interface Dog { bark: () => void }
interface Cat { meow: () => void }
function speak(animal: Dog | Cat) {
  if ("bark" in animal) animal.bark(); // Dog here
  else animal.meow();                  // Cat here
}

// ── Discriminated union — the most reliable narrowing pattern ────
type Result =
  | { status: "ok";    data: User }
  | { status: "error"; message: string };

function handle(result: Result) {
  if (result.status === "ok") {
    console.log(result.data.name); // data is available
  } else {
    console.log(result.message);   // message is available
  }
}

// ── Nullish narrowing ─────────────────────────────────────────────
function greet(name: string | null) {
  if (!name) return "Hello, stranger";
  return \`Hello, \${name}\`; // name is string here
}`}
        </CodeBlock>
        <Callout kind="rule">
          Prefer <strong>discriminated unions</strong> (a shared <code>status</code> or{" "}
          <code>type</code> field) over <code>instanceof</code> checks. They work with plain
          objects, serialize to JSON, and give TypeScript the most precise narrowing.
        </Callout>
      </Demo>

      {/* ── Demo 8: as const & satisfies ──────────────────────────────── */}
      <Demo concept="as const · satisfies" title="Lock down inference without losing type information">
        <CodeBlock>{`// ── as const — make every value a literal, freeze the shape ────────
const ROLES = ["admin", "user", "guest"] as const;
// Without as const: string[]
// With as const:    readonly ["admin", "user", "guest"]

type Role = typeof ROLES[number]; // → "admin" | "user" | "guest"

const CONFIG = {
  host: "localhost",
  port: 3000,
} as const;
// CONFIG.port is 3000 (literal), not number

// ── satisfies — validate against a type but keep the narrow type ──
// Problem with a plain type annotation:
const palette: Record<string, string> = { primary: "#3b82f6" };
palette.primary; // → string (lost the literal)

// satisfies preserves the narrow type AND checks the shape:
const palette = {
  primary: "#3b82f6",
  secondary: "#6366f1",
} satisfies Record<string, string>;
palette.primary; // → "#3b82f6" (literal preserved!)

// Real-world use: chapters list where slug must stay as a literal
const chapters = [
  { slug: "fetching-data", title: "Fetching Data" },
] as const;
type Slug = typeof chapters[number]["slug"]; // → "fetching-data"`}
        </CodeBlock>
        <Callout kind="tip">
          Use <code>as const</code> when you need literal types from data (enums, config,
          lookup tables). Use <code>satisfies</code> when you want to validate a value matches
          a type <em>without</em> widening the inferred type — the best of both worlds.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "<strong>Primitives</strong>: <code>string</code> <code>number</code> <code>boolean</code> <code>null</code> <code>undefined</code>. Arrays: <code>string[]</code> or <code>Array&lt;string&gt;</code>. Optional field: <code>name?: string</code> (may be absent). Nullable field: <code>name: string | null</code> (present but empty).",
        "<strong>Union</strong>: <code>string | number</code> — value is one of several types. <strong>Literal</strong>: <code>'admin' | 'user'</code> — restrict to exact values. Use literal unions instead of enums for simple sets of constants.",
        "<strong>interface</strong> when describing a named entity (props, models, contracts) — supports <code>extends</code> and gives better error messages. <strong>type</strong> when computing or combining types: unions <code>A | B</code>, tuples <code>[A, B]</code>, function signatures, and mapped/conditional types. When in doubt: <em>interface for things, type for formulas</em>.",
        "<strong>Generics</strong>: <code>function first&lt;T&gt;(arr: T[]): T</code> — write once, infer correctly for any type. Constrain with <code>extends</code>: <code>&lt;T extends { id: number }&gt;</code>.",
        "<strong>Utility types</strong>: <code>Partial&lt;T&gt;</code> all optional · <code>Pick&lt;T, K&gt;</code> keep keys · <code>Omit&lt;T, K&gt;</code> drop keys · <code>Record&lt;K, V&gt;</code> key-value map · <code>NonNullable&lt;T&gt;</code> strip null · <code>ReturnType&lt;typeof fn&gt;</code> extract return type.",
        "<strong>React props</strong>: use <code>interface</code> named <code>XxxProps</code>. Children: <code>React.ReactNode</code>. Events: <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code> <code>React.FormEvent&lt;HTMLFormElement&gt;</code>. Refs: <code>useRef&lt;HTMLDivElement&gt;(null)</code>.",
        "<strong>Type narrowing</strong>: <code>typeof x === 'string'</code> for primitives · <code>'key' in obj</code> for objects · discriminated unions (shared <code>status</code> field) for the most reliable narrowing. TypeScript removes impossible branches automatically.",
        "<code>as const</code> freezes a value to its literal types — use for config objects and lookup arrays. <code>satisfies</code> validates against a type without widening inference — use when you need both validation AND the narrow type.",
      ]} />
    </ChapterLayout>
  );
}
