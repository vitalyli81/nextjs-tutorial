// @modal/default.tsx — renders null when no interception is active.
// Without this file Next.js throws on direct navigation to /photos/[id]
// because the @modal slot has no matching page for that URL.

export default function ModalDefault() {
  return null;
}
