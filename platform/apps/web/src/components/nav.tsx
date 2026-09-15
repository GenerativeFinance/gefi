import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/models", label: "Models" },
  { href: "/workspace", label: "Workspace" },
  { href: "/federation", label: "Federation" },
  { href: "/privacy", label: "Privacy" },
];

export function Nav() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-cyan-300">
          GeFi
        </Link>
        <nav className="flex gap-4 text-sm text-slate-300">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
