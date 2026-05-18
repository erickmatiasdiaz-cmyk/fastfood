import { products, type Product } from "@/data/products";
import type { SiteSettings } from "@/lib/siteSettings";

export function getManagedProducts(settings: SiteSettings): Product[] {
  const baseProducts = products
    .filter((product) => !settings.hiddenProductIds.includes(product.id))
    .map((product) => {
      const override = settings.productOverrides[product.id] ?? {};

      return {
        ...product,
        ...override,
        image:
          settings.productImages[product.id] ??
          override.image ??
          product.image,
      };
    });

  return [...baseProducts, ...settings.customProducts];
}

export function getCategories(catalog: Product[]) {
  return Array.from(new Set(catalog.map((product) => product.category)));
}
