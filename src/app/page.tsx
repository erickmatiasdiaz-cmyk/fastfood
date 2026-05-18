import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import BusinessHoursSection from "@/components/BusinessHoursSection";
import FeaturedSection from "@/components/FeaturedSection";
import PromoSection from "@/components/PromoSection";
import MenuSection from "@/components/MenuSection";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import { CartProvider } from "@/components/CartProvider";



export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen flex flex-col">
        <Header />
        <Hero />
        <TrustSection />
        <BusinessHoursSection />
        <FeaturedSection />
        <PromoSection />
        <MenuSection />
        <CartDrawer />
        <Toast />
      </main>
    </CartProvider>
  );
}
