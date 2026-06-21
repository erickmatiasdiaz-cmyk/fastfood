import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
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

// Cookieless anon client for public storefront reads. The public catalog needs
// no session (RLS exposes only visible products / enabled promos / settings to
// the anon role), so avoiding `cookies()` keeps the page statically cacheable
// (ISR) instead of forcing a dynamic render + Supabase round-trip per request.
const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Loads everything the public storefront renders. Anon RLS already restricts
 * this to visible products and enabled promos. Cached via ISR (see the page's
 * `revalidate`), so admin changes appear within the revalidation window.
 */
export async function getStorefrontData(): Promise<SiteData> {
  const [settingsRes, productsRes, promosRes] = await Promise.all([
    publicClient
      .from("site_settings")
      .select("is_open, status_message, prep_time, hero_image, schedule")
      .eq("id", 1)
      .single(),
    publicClient
      .from("products")
      .select(
        "id, name, description, price, category, image, featured, badge, prep_time, is_hidden, sort_order"
      )
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true }),
    publicClient
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
