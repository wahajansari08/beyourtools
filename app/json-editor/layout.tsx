import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Editor - BeYourTools",
  description: "Edit JSON directly and see a live, structured preview update as you type.",
  alternates: { canonical: "https://beyourtools.com/json-editor" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
