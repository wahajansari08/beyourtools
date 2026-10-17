import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation primitives. Link/useRouter/usePathname automatically
// prefix non-English locales (e.g. /es/blog) and leave English URLs untouched.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
