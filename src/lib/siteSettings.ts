import type { Product } from "@/data/products";

export type ScheduleDay = {
  label: string;
  open: string;
  close: string;
  closed: boolean;
};

export type Promo = {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  badge: string;
  cta: string;
  image: string;
  sortOrder: number;
};

export type SiteConfig = {
  isOpen: boolean;
  statusMessage: string;
  prepTime: string;
  heroImage: string;
  schedule: ScheduleDay[];
};

/** Everything the storefront needs to render, fetched from Supabase. */
export type SiteData = SiteConfig & {
  products: Product[];
  promos: Promo[];
};

// ---------- Database row shapes (snake_case) ----------

export type ProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  badge: string;
  prep_time: string;
  is_hidden: boolean;
  sort_order: number;
};

export type PromoRow = {
  id: number;
  enabled: boolean;
  title: string;
  description: string;
  badge: string;
  cta: string;
  image: string;
  sort_order: number;
};

export type SiteSettingsRow = {
  is_open: boolean;
  status_message: string;
  prep_time: string;
  hero_image: string;
  schedule: ScheduleDay[];
};

// ---------- Row -> app mappers ----------

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: row.image,
    featured: row.featured,
    badge: row.badge,
    prepTime: row.prep_time,
    isHidden: row.is_hidden,
    sortOrder: row.sort_order,
  };
}

export function mapPromo(row: PromoRow): Promo {
  return {
    id: String(row.id),
    enabled: row.enabled,
    title: row.title,
    description: row.description,
    badge: row.badge,
    cta: row.cta,
    image: row.image,
    sortOrder: row.sort_order,
  };
}

export function mapSiteConfig(row: SiteSettingsRow): SiteConfig {
  return {
    isOpen: row.is_open,
    statusMessage: row.status_message,
    prepTime: row.prep_time,
    heroImage: row.hero_image,
    schedule: row.schedule ?? [],
  };
}

/** Safe fallback used if Supabase is unreachable during SSR. */
export const fallbackSiteData: SiteData = {
  isOpen: true,
  statusMessage: "Abierto ahora",
  prepTime: "15-20 min",
  heroImage: "/hero.png",
  schedule: [],
  products: [],
  promos: [],
};
