"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { generateJson } from "@/lib/generators/generator";

const TEMPLATES: Record<string, string> = {
  users: JSON.stringify(
    [
      {
        $repeat: 5,
        $template: {
          id: "{{uuid}}",
          name: "{{name}}",
          email: "{{email}}",
          age: "{{integer(18,65)}}",
          active: "{{boolean}}",
          joined: "{{date}}",
        },
      },
    ],
    null,
    2
  ),
  product: JSON.stringify(
    {
      id: "{{uuid}}",
      name: "{{loremWord}}",
      price: "{{float(1,999)}}",
      inStock: "{{boolean}}",
      color: "{{color}}",
      tags: ["{{loremWord}}", "{{loremWord}}"],
    },
    null,
    2
  ),
  post: JSON.stringify(
    {
      id: "{{uuid}}",
      title: "{{sentence}}",
      author: "{{name}}",
      publishedAt: "{{datetime}}",
      status: "{{status}}",
      body: "{{sentence}}",
    },
    null,
    2
  ),
};

export default function JsonGeneratorClient() {
  const [template, setTemplate] = useState<"users" | "product" | "post">("users");

  const transform = useCallback(
    (input: string) => {
      const result = generateJson(input);
      return { output: result.output, error: result.error };
    },
    []
  );

  return (
    <div className="space-y-3">
      <TextTransformTool
        inputLabel="Template"
        outputLabel="Generated JSON"
        placeholder={TEMPLATES.users}
        defaultValue={TEMPLATES[template]}
        transform={transform}
        downloadFilename="generated.json"
        downloadMime="application/json"
        toolbar={
          <SegmentedControl
            label="Example"
            value={template}
            onChange={(v) => setTemplate(v as "users" | "product" | "post")}
            options={[
              { value: "users", label: "Users list" },
              { value: "product", label: "Product" },
              { value: "post", label: "Blog post" },
            ]}
          />
        }
      />

      {/* Placeholder reference */}
      <details className="rounded-lg border border-ink-700 bg-ink-900">
        <summary className="cursor-pointer px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wide text-mist-400 hover:text-mist-200">
          Available Placeholders
        </summary>
        <div className="grid gap-x-6 gap-y-1 px-3.5 pb-3 pt-1 text-[12px] sm:grid-cols-2">
          {[
            ["{{name}}", "Full name (e.g. Alice Smith)"],
            ["{{firstName}}", "First name only"],
            ["{{lastName}}", "Last name only"],
            ["{{email}}", "Email address"],
            ["{{uuid}}", "UUID v4"],
            ["{{date}}", "Date (YYYY-MM-DD)"],
            ["{{datetime}}", "ISO 8601 datetime"],
            ["{{boolean}}", "true or false"],
            ["{{integer(min,max)}}", "Random integer in range"],
            ["{{float(min,max)}}", "Random float in range"],
            ["{{color}}", "A color name"],
            ["{{status}}", "active / inactive / pending / archived"],
            ["{{sentence}}", "Lorem ipsum sentence"],
            ["{{loremWord}}", "Single lorem ipsum word"],
            ["{{url}}", "A URL"],
          ].map(([ph, desc]) => (
            <div key={ph} className="flex gap-2 py-0.5">
              <code className="w-44 shrink-0 font-mono text-amber-400">{ph}</code>
              <span className="text-mist-400">{desc}</span>
            </div>
          ))}
        </div>
        <p className="px-3.5 pb-3 text-[12px] text-mist-500">
          Use{" "}
          <code className="font-mono text-amber-400">
            {"[{\"$repeat\": N, \"$template\": {...}}]"}
          </code>{" "}
          to repeat an object N times.
        </p>
      </details>
    </div>
  );
}
