import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import UrlEncoderDecoderClient from "./UrlEncoderDecoderClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("url-encoder-decoder")!);

export default function Page() {
  const tool = getGeneralTool("url-encoder-decoder");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<UrlEncoderDecoderClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "url-encoder-decoder", __enMetadata);
}
