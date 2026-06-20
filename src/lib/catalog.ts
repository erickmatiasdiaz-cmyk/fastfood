import type { Product } from "@/data/products";
import type { SiteData } from "@/lib/siteSettings";

/** Products to show in the storefront (already filtered/ordered by Supabase). */
export function getManagedProducts(data: SiteData): Product[] {
  return data.products;
}

export function getCategories(catalog: Product[]) {
  return Array.from(new Set(catalog.map((product) => product.category)));
}
