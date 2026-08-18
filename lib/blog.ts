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

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
}

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
