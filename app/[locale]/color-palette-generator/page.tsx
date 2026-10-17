import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ColorPaletteClient from "./ColorPaletteClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("color-palette-generator");

const __enMetadata: Metadata = designToolMetadata(tool);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "color-palette-generator", __enMetadata);
}

export default function ColorPaletteClientPage() {
  return <DesignToolPageShell tool={tool} client={<ColorPaletteClient />} />;
}
