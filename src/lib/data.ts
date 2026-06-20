import { createClient } from "@/lib/supabase/server";
import {
  fallbackSiteData,
  mapProduct,
  mapPromo,
  mapSiteConfig,
  type ProductRow,
  type PromoRow,
  type SiteData,
  type SiteSettingsRow,
} from "@/lib/siteSettings";

/**
 * Loads everything the public storefront renders, server-side.
 * Anon RLS already restricts this to visible products and enabled promos.
 */
export async function getStorefrontData(): Promise<SiteData> {
  const supabase = await createClient();

  const [settingsRes, productsRes, promosRes] = await Promise.all([
    supabase
      .from("site_settings")
      .select("is_open, status_message, prep_time, hero_image, schedule")
      .eq("id", 1)
      .single(),
    supabase
      .from("products")
      .select(
        "id, name, description, price, category, image, featured, badge, prep_time, is_hidden, sort_order"
      )
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("promos")
      .select("id, enabled, title, description, badge, cta, image, sort_order")
      .eq("enabled", true)
      .order("sort_order", { ascending: true }),
  ]);

  const config = settingsRes.data
    ? mapSiteConfig(settingsRes.data as SiteSettingsRow)
    : fallbackSiteData;

  return {
    ...config,
    products: ((productsRes.data as ProductRow[] | null) ?? []).map(mapProduct),
    promos: ((promosRes.data as PromoRow[] | null) ?? []).map(mapPromo),
  };
}
