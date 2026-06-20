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

// Always render with fresh data so admin changes appear immediately.
export const dynamic = "force-dynamic";

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
