import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import MarkdownPreviewerClient from "./MarkdownPreviewerClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("markdown-previewer")!);

export default function Page() {
  const tool = getGeneralTool("markdown-previewer");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<MarkdownPreviewerClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "markdown-previewer", __enMetadata);
}
