import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Include JSON-LD schema - default true */
  schema?: boolean;
}

export default function Breadcrumbs({ items, schema = true }: BreadcrumbsProps) {
  const schemaData = schema
    ? breadcrumbSchema(items.map((it) => ({ name: it.name, url: `https://beyourtools.com${it.href}` })))
    : null;

  return (
    <>
      {schemaData && <JsonLd data={[schemaData]} />}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol
          className="flex flex-wrap items-center gap-1.5 text-xs"
          style={{ color: "var(--text-subtle)" }}
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li
                key={item.href}
                className="flex items-center gap-1.5"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(i + 1)} />
                {isLast ? (
                  <span itemProp="name" style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="focus-ring rounded hover:underline"
                      style={{ color: "var(--text-muted)" }}
                      itemProp="item"
                    >
                      <span itemProp="name">{item.name}</span>
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
