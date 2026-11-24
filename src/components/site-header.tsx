import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-baseline justify-between gap-4">
      <Link
        href="/"
        className="font-mono text-xs tracking-[0.22em] text-route uppercase"
      >
        Encurtador
      </Link>
    </header>
  );
}
