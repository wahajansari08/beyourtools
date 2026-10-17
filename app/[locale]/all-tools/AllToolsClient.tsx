"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export interface ToolItem {
  slug: string;
  href: string;
  name: string;
  description: string;
}

export interface ToolGroup {
  key: string;
  title: string;
  tools: ToolItem[];
}

export default function AllToolsClient({ groups, total }: { groups: ToolGroup[]; total: number }) {
  const t = useTranslations("allTools");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        tools: g.tools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            tool.slug.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.tools.length > 0);
  }, [groups, query]);

  const shown = filtered.reduce((n, g) => n + g.tools.length, 0);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-md">
          <span className="sr-only">{t("searchLabel")}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="focus-ring w-full rounded-xl border px-4 py-2.5 text-sm"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          />
        </label>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }} aria-live="polite">
          {t("showing", { shown, total })}
        </p>
      </div>

      {shown === 0 ? (
        <p className="mt-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          {t("noResults", { query: query.trim() })}
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {filtered.map((group) => (
            <section key={group.key} aria-label={group.title}>
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {group.title}
                </h2>
                <span className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>
                  {group.tools.length}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={tool.href}
                      aria-label={t("openTool", { name: tool.name })}
                      className="focus-ring group flex h-full flex-col rounded-xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                    >
                      <span className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                        {tool.name}
                      </span>
                      {tool.description ? (
                        <span className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                          {tool.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
