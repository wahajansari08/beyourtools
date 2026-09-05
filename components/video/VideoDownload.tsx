"use client";

import { useEffect, useRef } from "react";
import { formatBytes } from "@/lib/video/ffmpeg";
import Btn from "@/components/Btn";

interface VideoDownloadProps {
  blob: Blob;
  filename: string;
  label?: string;
  onReset: () => void;
}

export default function VideoDownload({ blob, filename, label = "Download", onReset }: VideoDownloadProps) {
  const urlRef = useRef("");

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  const download = () => {
    const a = document.createElement("a");
    a.href = urlRef.current;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Btn variant="primary" onClick={download}>
          <span aria-hidden="true">↓</span>
        {label}
        <span className="text-xs opacity-75">({formatBytes(blob.size)})</span>
        </Btn>
      <Btn variant="secondary" onClick={onReset}>
          Process another file
        </Btn>
    </div>
  );
}

