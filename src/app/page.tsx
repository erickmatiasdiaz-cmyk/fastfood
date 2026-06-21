import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import BusinessHoursSection from "@/components/BusinessHoursSection";
import FeaturedSection from "@/components/FeaturedSection";
import PromoSection from "@/components/PromoSection";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import { CartProvider } from "@/components/CartProvider";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getStorefrontData } from "@/lib/data";

// Incremental Static Regeneration: the storefront HTML is cached at the edge and
// regenerated at most every 30s, so under load Supabase is queried ~once per
// window instead of once per visitor. Admin changes appear within ~30s.
export const revalidate = 30;

export default async function Home() {
  const data = await getStorefrontData();

  return (
    <SiteSettingsProvider initialData={data}>
      <CartProvider>
        <main className="min-h-screen flex flex-col">
          <Header />
          <Hero />
          <TrustSection />
          <BusinessHoursSection />
          <FeaturedSection />
          <PromoSection />
          <MenuSection />
          <Footer />
          <CartDrawer />
          <Toast />
        </main>
      </CartProvider>
    </SiteSettingsProvider>
  );
}
