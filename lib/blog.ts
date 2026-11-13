import { batch1 } from "./blog-posts/batch1";
import { batch2 } from "./blog-posts/batch2";
import { batch3 } from "./blog-posts/batch3";
import { batch4 } from "./blog-posts/batch4";
import { batch5 } from "./blog-posts/batch5";
import { batch6 } from "./blog-posts/batch6";
import { batch7 } from "./blog-posts/batch7";
import { batch8 } from "./blog-posts/batch8";
import { batch9 } from "./blog-posts/batch9";
import { batch10 } from "./blog-posts/batch10";
import { batch11 } from "./blog-posts/batch11";
import { batch12 } from "./blog-posts/batch12";
import { batch13 } from "./blog-posts/batch13";
import { batch14 } from "./blog-posts/batch14";
import { batch15 } from "./blog-posts/batch15";
import { batch16 } from "./blog-posts/batch16";
import { batch17 } from "./blog-posts/batch17";
import { batch18 } from "./blog-posts/batch18";
import { batch19 } from "./blog-posts/batch19";
import { batch20 } from "./blog-posts/batch20";
import { batch21 } from "./blog-posts/batch21";
import { batch22 } from "./blog-posts/batch22";
import { batch23 } from "./blog-posts/batch23";
import { batch24 } from "./blog-posts/batch24";
import { batch25 } from "./blog-posts/batch25";
import { batch26 } from "./blog-posts/batch26";

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle?: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
}

/** Site author identity (E-E-A-T byline). All posts are written by the founder. */
export const SITE_AUTHOR = {
  name: "Wahaj Ansari",
  role: "Founder & Editor",
  url: "https://wahaj.pk",
} as const;

export const blogPosts: BlogPost[] = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
  ...batch6,
  ...batch7,
  ...batch8,
  ...batch9,
  ...batch10,
  ...batch11,
  ...batch12,
  ...batch13,
  ...batch14,
  ...batch15,
  ...batch16,
  ...batch17,
  ...batch18,
  ...batch19,
  ...batch20,
  ...batch21,
  ...batch22,
  ...batch23,
  ...batch24,
  ...batch25,
  ...batch26,
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRecentPosts(count = 3, excludeSlug?: string): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== excludeSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function getPostsByCategory(category: string, limit = 6, excludeSlug?: string): BlogPost[] {
  return blogPosts
    .filter((p) => p.category === category && p.slug !== excludeSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
