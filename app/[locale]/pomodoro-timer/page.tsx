import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import PomodoroTimerClient from "./PomodoroTimerClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("pomodoro-timer")!);

export default function Page() {
  const tool = getGeneralTool("pomodoro-timer");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<PomodoroTimerClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "pomodoro-timer", __enMetadata);
}
