import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ColorPickerClient from "./ColorPickerClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("color-picker");

const __enMetadata: Metadata = designToolMetadata(tool);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "color-picker", __enMetadata);
}

export default function ColorPickerClientPage() {
  return <DesignToolPageShell tool={tool} client={<ColorPickerClient />} />;
}
