import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-400 font-mono text-sm font-bold text-ink-950">
            {"{ }"}
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-mist-50">
            Jsonifyr
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-mist-300">
          <Link href="/#tools" className="focus-ring rounded hover:text-mist-50">
            JSON tools
          </Link>
          <Link href="/image-converter" className="focus-ring rounded hover:text-mist-50">
            Image Converter
          </Link>
          <Link href="/pdf-tools" className="focus-ring rounded hover:text-mist-50">
            PDF Tools
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded hover:text-mist-50"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
