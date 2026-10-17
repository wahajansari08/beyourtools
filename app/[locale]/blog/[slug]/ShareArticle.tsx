"use client";

import { useState } from "react";
import Btn from "@/components/Btn";

interface ShareArticleProps {
  url: string;
  title: string;
}

interface ShareTarget {
  name: string;
  buildUrl: (url: string, title: string) => string;
}

const shareTargets: ShareTarget[] = [
  { name: "Facebook", buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: "X", buildUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: "LinkedIn", buildUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { name: "Reddit", buildUrl: (url, title) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: "WhatsApp", buildUrl: (url, title) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}` },
  { name: "Telegram", buildUrl: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: "Pinterest", buildUrl: (url, title) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}` },
  { name: "Bluesky", buildUrl: (url, title) => `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}` },
  { name: "Threads", buildUrl: (url, title) => `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${url}`)}` },
  { name: "Mastodon", buildUrl: (url, title) => `https://mastodon.social/share?text=${encodeURIComponent(`${title} ${url}`)}` },
  { name: "Hacker News", buildUrl: (url, title) => `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}` },
  { name: "Tumblr", buildUrl: (url, title) => `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: "VK", buildUrl: (url, title) => `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: "Email", buildUrl: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
  { name: "SMS", buildUrl: (url, title) => `sms:?&body=${encodeURIComponent(`${title} ${url}`)}` },
];

export default function ShareArticle({ url, title }: ShareArticleProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function share(target: ShareTarget) {
    window.open(target.buildUrl(url, title), "share-window", "width=680,height=620,noopener,noreferrer");
    setOpen(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="relative shrink-0">
      <Btn variant="secondary" size="sm" className="hover:-translate-y-0.5" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((value) => !value)}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M15 13a2.5 2.5 0 0 0-1.96.95l-5.2-2.9a2.48 2.48 0 0 0 0-2.1l5.2-2.9A2.5 2.5 0 1 0 12.5 4c0 .2.03.4.08.59l-5.2 2.9a2.5 2.5 0 1 0 0 5.02l5.2 2.9A2.5 2.5 0 1 0 15 13Z" />
        </svg>
        Share
      </Btn>

      {open && (
        <div
          role="menu"
          aria-label="Share this article"
          className="absolute right-0 z-10 mt-2 grid w-64 grid-cols-2 gap-1 rounded-xl border p-2 shadow-lg"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          {shareTargets.map((target) => (
            <Btn variant="ghost" size="sm" key={target.name} role="menuitem" className="w-full px-2.5 py-2 text-left" onClick={() => share(target)}>{target.name}</Btn>
          ))}
          <Btn variant="secondary" size="sm" role="menuitem" className="col-span-2 mt-1 px-2.5 py-2 text-center" onClick={copyLink}>{copied ? "Link copied" : "Copy link"}</Btn>
        </div>
      )}
    </div>
  );
}
