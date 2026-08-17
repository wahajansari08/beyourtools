import Link from "next/link";
import { categories, toolsByCategory } from "@/lib/tools-config";

export default function Home() {
  return (
    <div>
      <Hero />
      <section id="tools" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {categories.map((category) => {
          const items = toolsByCategory(category);
          return (
            <div key={category} className="mb-12 last:mb-0">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-display text-lg font-semibold text-mist-50">{category}</h2>
                <span className="text-xs text-mist-400">{items.length} tools</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((tool) =>
                  tool.live ? (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="focus-ring group flex flex-col justify-between rounded-lg border border-ink-700 bg-ink-900 p-4 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-[0_0_0_1px_rgba(242,184,75,0.15)]"
                    >
                      <div>
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="font-mono text-[11px] text-teal-400">{"{ }"}</span>
                          <h3 className="text-sm font-semibold text-mist-50">{tool.name}</h3>
                        </div>
                        <p className="text-xs leading-relaxed text-mist-300">{tool.description}</p>
                      </div>
                      <span className="mt-3 text-xs font-medium text-amber-400 opacity-0 transition group-hover:opacity-100">
                        Open tool →
                      </span>
                    </Link>
                  ) : (
                    <div
                      key={tool.slug}
                      className="flex flex-col justify-between rounded-lg border border-dashed border-ink-700 p-4 opacity-60"
                    >
                      <div>
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="font-mono text-[11px] text-mist-400">{"{ }"}</span>
                          <h3 className="text-sm font-semibold text-mist-200">{tool.name}</h3>
                        </div>
                        <p className="text-xs leading-relaxed text-mist-400">{tool.description}</p>
                      </div>
                      <span className="mt-3 text-xs font-medium text-mist-400">Coming soon</span>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-700 bg-grid-fade">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900 px-3 py-1 text-xs text-mist-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Runs fully client-side — nothing leaves your browser
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-mist-50 sm:text-5xl">
              Every JSON tool you reach for,
              <span className="text-amber-400"> in one place.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mist-300">
              Format, validate, diff, and convert JSON without installing anything.
              Jsonifyr is a fast, focused toolbox for developers who live in curly braces.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/json-formatter"
                className="focus-ring rounded-md bg-amber-400 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-amber-500"
              >
                Open JSON Formatter
              </Link>
              <Link
                href="#tools"
                className="focus-ring rounded-md border border-ink-600 px-4 py-2.5 text-sm font-semibold text-mist-100 transition hover:border-ink-500"
              >
                Browse all tools
              </Link>
            </div>
          </div>
          <BracketIllustration />
        </div>
      </div>
    </section>
  );
}

function BracketIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-xl border border-ink-700 bg-ink-900 p-5 shadow-2xl shadow-black/40">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-coral-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal-400/70" />
      </div>
      <pre className="font-mono text-[13px] leading-[1.7em] text-mist-200">
        <span className="text-mist-400">{"{"}</span>
        {"\n  "}
        <span className="text-teal-400">&quot;tool&quot;</span>
        <span className="text-mist-400">: </span>
        <span className="text-amber-400">&quot;jsonifyr&quot;</span>
        <span className="text-mist-400">,</span>
        {"\n  "}
        <span className="text-teal-400">&quot;tools&quot;</span>
        <span className="text-mist-400">: </span>
        <span className="text-mist-400">{"["}</span>
        <span className="text-amber-400">&quot;format&quot;</span>
        <span className="text-mist-400">, </span>
        <span className="text-amber-400">&quot;diff&quot;</span>
        <span className="text-mist-400">, </span>
        <span className="text-amber-400">&quot;convert&quot;</span>
        <span className="text-mist-400">{"]"}</span>
        <span className="text-mist-400">,</span>
        {"\n  "}
        <span className="text-teal-400">&quot;runsOn&quot;</span>
        <span className="text-mist-400">: </span>
        <span className="text-amber-400">&quot;your browser&quot;</span>
        {"\n"}
        <span className="text-mist-400">{"}"}</span>
      </pre>
    </div>
  );
}
