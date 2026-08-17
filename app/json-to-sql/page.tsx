import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToSqlClient from "./JsonToSqlClient";

export const metadata: Metadata = {
  title: "JSON to SQL — Jsonifyr",
  description: "Generate SQL CREATE TABLE and INSERT statements from a JSON array.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → SQL"
      title="JSON to SQL"
      description="Paste a JSON array and get a SQL CREATE TABLE statement plus INSERT rows — types are inferred automatically."
      category="Convert"
      currentSlug="json-to-sql"
    >
      <JsonToSqlClient />
    </ToolLayout>
  );
}
