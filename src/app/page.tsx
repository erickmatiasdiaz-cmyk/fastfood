import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedSection from "@/components/FeaturedSection";
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
        <FeaturedSection />
        <MenuSection />
        <CartDrawer />
        <Toast />
      </main>
    </CartProvider>
  );
}
