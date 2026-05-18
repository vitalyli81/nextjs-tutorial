# TypeScript — Complete Reference

> Version used in this project: **TypeScript 5** · strict mode · Next.js App Router

---

## Table of Contents

1. [Primitives, Arrays, Objects](#1-primitives-arrays-objects)
2. [Union, Literal, Type Alias](#2-union-literal-type-alias)
3. [interface vs type](#3-interface-vs-type)
4. [Generics](#4-generics)
5. [Utility Types](#5-utility-types)
6. [React + TypeScript](#6-react--typescript)
7. [Type Narrowing](#7-type-narrowing)
8. [as const & satisfies](#8-as-const--satisfies)
9. [Common Mistakes](#9-common-mistakes)

---

## 1. Primitives, Arrays, Objects

TypeScript adds a type annotation after the variable name with `:`.

```ts
// Primitives
let name:    string    = "Alice";
let age:     number    = 30;
let active:  boolean   = true;
let nothing: null      = null;
let missing: undefined = undefined;

// Arrays — two syntaxes, identical meaning
let ids: number[]      = [1, 2, 3];   // preferred
let ids: Array<number> = [1, 2, 3];   // generic form

// Inline object annotation
let user: { id: number; name: string; role?: string } = {
  id: 1,
  name: "Alice",
  // role is optional — may be omitted
};

// Tuple — fixed-length array with a known type at each position
let point: [number, number] = [10, 20];
let entry: [string, number] = ["Alice", 30];
```

**When to annotate vs let TypeScript infer:**

- Infer when the value is obvious: `const name = "Alice"` → TypeScript already knows it's `string`.
- Annotate when the initial value is `null`, `[]`, or `{}` — TypeScript can't infer the final type from an empty value.
- Always annotate function parameters and return types in public APIs.

---

## 2. Union, Literal, Type Alias

### Union — value is one of several types

```ts
let id: string | number = 42;
id = "abc";  // also valid
```

### Literal — restrict to exact values

```ts
type Direction  = "north" | "south" | "east" | "west";
type StatusCode = 200 | 400 | 404 | 500;
```

Use literal unions instead of enums for simple sets of constants. They serialize to JSON, are easier to read, and don't produce extra JavaScript output.

### Type alias — name for any type expression

```ts
type UserId = string | number;
type Point  = { x: number; y: number };
```

### Optional `?` vs nullable `| null`

```ts
type A = { name?: string };        // name may be absent (undefined)
type B = { name: string | null };  // name must be present, but can be null
```

These are different:
- `?` means the key might not exist on the object at all.
- `| null` means the key is always there, but the value can be empty.

Prefer `| null` when the field is always present — it makes intent explicit and surfaces errors earlier.

---

## 3. interface vs type

Both can describe an object shape. The rule: **`interface` for things, `type` for formulas**.

### interface — for named entities and object shapes

Use `interface` when you're describing a *thing*: a component's props, a data model, an API response shape, a class contract. It supports `extends` and gives better error messages.

```ts
interface User {
  id: number;
  name: string;
  email?: string;
}

// Extend a base shape
interface Admin extends User {
  permissions: string[];
}
```

### type — for everything else

Use `type` when you're *computing or combining* types: unions, intersections, tuples, function signatures, mapped/conditional types, utility wrappers.

```ts
type UserId   = string | number;         // union — interface can't do this
type Point    = [number, number];        // tuple — interface can't do this
type Callback = (id: number) => void;    // function type
type Maybe<T> = T | null | undefined;    // generic alias
```

### Side-by-side comparison

|                         | `interface` | `type`                        |
|-------------------------|-------------|-------------------------------|
| Object shape            | ✅          | ✅                            |
| `extends` / `implements`| ✅          | ❌ (use `&` intersection)     |
| Union (`A \| B`)        | ❌          | ✅                            |
| Tuple (`[A, B]`)        | ❌          | ✅                            |
| Function type           | ❌          | ✅                            |
| Mapped / conditional    | ❌          | ✅                            |
| Re-open & merge decls   | ✅          | ❌ (type aliases are closed)  |

**Rule of thumb:**
- Component props → `interface ButtonProps`
- Data models → `interface User`
- Unions, tuples, functions → `type`
- Utility wrappers → `type Maybe<T> = T | null`

---

## 4. Generics

Generics let you write code once and have it type-check correctly for any type.

```ts
// Generic function — T is inferred from the argument
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first([1, 2, 3]);   // → number | undefined
first(["a", "b"]);  // → string | undefined

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}
type UserResponse  = ApiResponse<User>;    // data is User
type PostsResponse = ApiResponse<Post[]>;  // data is Post[]

// Constraints — require T to have certain fields
function getLabel<T extends { label: string }>(item: T): string {
  return item.label;
}

// Default type parameter
interface Box<T = string> {
  value: T;
}
const box: Box = { value: "hello" };  // T defaults to string
```

### When to use generics

- When you're writing a utility function that works on any type (`first`, `last`, `groupBy`).
- When you have a container or wrapper type where the inner type varies (`ApiResponse<T>`, `Box<T>`).
- When you want to preserve the relationship between input and output types.

Don't reach for generics just to avoid repeating a type name — a union or overload is often simpler.

---

## 5. Utility Types

TypeScript ships built-in helpers that transform existing types. All are in the standard library — no import needed.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}
```

| Utility | What it does | Common use |
|---|---|---|
| `Partial<T>` | All fields become optional | Update / PATCH payloads |
| `Required<T>` | All optional fields become required | Ensuring a fully-filled object |
| `Pick<T, K>` | Keep only listed keys | View models, API responses |
| `Omit<T, K>` | Remove listed keys | Hiding sensitive fields |
| `Record<K, V>` | Object with keys K and values V | Lookup maps, dictionaries |
| `ReturnType<typeof fn>` | Extract what a function returns | Avoid duplicating return types |
| `NonNullable<T>` | Remove `null` and `undefined` | Narrowing after a null check |
| `Readonly<T>` | All fields become readonly | Immutable config objects |
| `Parameters<typeof fn>` | Tuple of function parameter types | Re-using argument types |

```ts
// Partial — great for update payloads
type UserUpdate = Partial<User>;
// → { id?: number; name?: string; email?: string; role?: ... }

// Pick — keep only what you need
type UserPreview = Pick<User, "id" | "name">;
// → { id: number; name: string }

// Omit — drop what you don't want to expose
type PublicUser = Omit<User, "email" | "role">;
// → { id: number; name: string }

// Record — typed key-value map
type RoleMap = Record<"admin" | "user", string[]>;
// → { admin: string[]; user: string[] }

// ReturnType — extract the return type without duplicating it
function fetchUser() { return { id: 1, name: "Alice" }; }
type FetchedUser = ReturnType<typeof fetchUser>;
// → { id: number; name: string }

// NonNullable — strip null/undefined from a union
type SafeId = NonNullable<number | null | undefined>;
// → number
```

---

## 6. React + TypeScript

### Component props

Name the interface `XxxProps` and place it directly above the component.

```ts
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  children?: React.ReactNode;  // any renderable content
}

export function Button({ label, onClick, variant = "primary", disabled }: ButtonProps) {
  // …
}
```

**`React.ReactNode` vs `React.ReactElement`:**
- `ReactNode` — anything React can render: JSX, string, number, array, `null`. Use for `children`.
- `ReactElement` — a single JSX element specifically (not strings, not null). Use only when you need to call `.props` on the child.
- When in doubt: `ReactNode`.

### Event handlers

The generic is the HTML element the event is fired on.

```ts
function handleChange(e: React.ChangeEvent<HTMLInputElement>)  { e.target.value }
function handleSubmit(e: React.FormEvent<HTMLFormElement>)      { e.preventDefault() }
function handleClick(e: React.MouseEvent<HTMLButtonElement>)   { }
function handleKey(e: React.KeyboardEvent<HTMLInputElement>)   { e.key }
```

### useRef

```ts
// DOM ref — pass null as initial value
const inputRef = useRef<HTMLInputElement>(null);

// Mutable value ref (not a DOM element)
const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
```

### useState

Provide the type when TypeScript can't infer it from the initial value.

```ts
const [user, setUser]   = useState<User | null>(null);  // null doesn't tell TS what User is
const [items, setItems] = useState<string[]>([]);        // empty array has no element type
const [count, setCount] = useState(0);                   // inferred as number — no annotation needed
```

### Next.js page props (App Router, Next.js 15)

In Next.js 15 `params` and `searchParams` are Promises.

```ts
interface PageProps {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
}
```

---

## 7. Type Narrowing

TypeScript tracks which type a variable has inside each branch of a conditional.

### `typeof` — for primitives

```ts
function format(value: string | number) {
  if (typeof value === "string") return value.toUpperCase();  // string here
  return value.toFixed(2);                                    // number here
}
```

### `in` — check if a key exists

```ts
interface Dog { bark: () => void }
interface Cat { meow: () => void }

function speak(animal: Dog | Cat) {
  if ("bark" in animal) animal.bark();  // Dog here
  else                  animal.meow(); // Cat here
}
```

### Discriminated unions — the most reliable pattern

Add a shared literal field (`status`, `type`, `kind`) to each branch. TypeScript narrows automatically.

```ts
type Result =
  | { status: "ok";    data: User }
  | { status: "error"; message: string };

function handle(result: Result) {
  if (result.status === "ok") {
    console.log(result.data.name);   // data available
  } else {
    console.log(result.message);     // message available
  }
}
```

**Why prefer discriminated unions over `instanceof`:**
- Work with plain objects — no class required.
- Serialize to JSON naturally.
- TypeScript gives exhaustive narrowing and catches missing branches.

### Nullish narrowing

```ts
function greet(name: string | null) {
  if (!name) return "Hello, stranger";
  return `Hello, ${name}`;  // name is string here
}
```

### Type predicates — custom narrowing functions

```ts
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

if (isUser(data)) {
  console.log(data.id);  // data is User here
}
```

---

## 8. `as const` & `satisfies`

### `as const` — freeze to literal types

Without `as const`, TypeScript widens array/object values to their base type (`string`, `number`). With `as const`, every value becomes its exact literal type and the structure becomes `readonly`.

```ts
// Without: string[]
// With:    readonly ["admin", "user", "guest"]
const ROLES = ["admin", "user", "guest"] as const;

// Derive a union from the array
type Role = typeof ROLES[number];  // → "admin" | "user" | "guest"

// Object — all values become literals
const CONFIG = { host: "localhost", port: 3000 } as const;
// CONFIG.port is 3000 (literal), not number
```

**When to use `as const`:**
- Config objects, lookup tables, route arrays, enum-like constant lists.
- Any time you need to derive a union type from runtime data.

### `satisfies` — validate without widening

A plain type annotation (`const x: SomeType = …`) widens the inferred type to `SomeType`, losing the specific literal values. `satisfies` validates the shape against a type *without* widening.

```ts
// Problem — annotation widens to Record<string, string>:
const palette: Record<string, string> = { primary: "#3b82f6" };
palette.primary;  // → string (literal lost)

// satisfies — validates AND preserves the literal type:
const palette = {
  primary:   "#3b82f6",
  secondary: "#6366f1",
} satisfies Record<string, string>;
palette.primary;  // → "#3b82f6" (literal preserved!)
```

**When to use `satisfies`:**
- When you want TypeScript to check that a value matches a type, but still want to use the specific values (autocomplete, literal types) afterwards.
- Common with Tailwind config, Next.js config, chapter lists, theme tokens.

### Combining both

```ts
const chapters = [
  { slug: "fetching-data", title: "Fetching Data" },
  { slug: "mutating-data", title: "Mutating Data" },
] as const;

type Slug = typeof chapters[number]["slug"];
// → "fetching-data" | "mutating-data"
```

---

## 9. Common Mistakes

| Mistake | Fix |
|---|---|
| `any` everywhere | Use `unknown` for truly unknown values — it forces a type check before use |
| Annotating what TypeScript already infers | `const name: string = "Alice"` → just `const name = "Alice"` |
| `interface` for a union | `interface Result = A \| B` doesn't work — use `type Result = A \| B` |
| `type` for component props | Works, but `interface ButtonProps` gives better error messages and is easier to extend |
| Optional `?` when you mean nullable | `name?: string` allows the key to be absent; `name: string \| null` requires it to be present |
| `as` to silence errors | `as SomeType` suppresses the error but doesn't fix it — use a type guard or narrow properly |
| Non-null assertion `!` on every access | `user!.name` hides a real null risk — narrow with `if (user)` instead |
| Forgetting to `await params` in Next.js 15 | `params` is a Promise in App Router — always `const { slug } = await params` |
| `useState([])` without a type | TypeScript infers `never[]` — annotate: `useState<string[]>([])` |
| `useRef<HTMLDivElement>()` without `null` | DOM refs must be initialized with `null`: `useRef<HTMLDivElement>(null)` |
