import type { Metadata } from "next"

const BRAND = " | Dhruv Agrawat"

/**
 * Keep titles within ~60 characters in search results: short titles get the
 * " | Dhruv Agrawat" suffix from the root layout, long ones stand on their own.
 */
export function seoTitle(title: string): Metadata["title"] {
  return title.length + BRAND.length > 60 ? { absolute: title } : title
}
