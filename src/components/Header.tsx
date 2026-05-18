"use client";

import {
  Clock3,
  LockKeyhole,
  MapPin,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function Header() {
  const { cart, toggleCart, getTotal, getItemCount } = useCart();
  const { settings } = useSiteSettings();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7efe3]/95 text-[#17130f] shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-900/20">
            <UtensilsCrossed size={21} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-black uppercase leading-none tracking-wide">
              Punto Mordida
            </p>
            <p className="hidden text-xs font-medium text-black/55 sm:block">
              Fuente de soda para retirar
            </p>
          </div>
        </div>

        <nav aria-label="Secciones" className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <a href="#favoritos" className="transition hover:text-red-600">
            Favoritos
          </a>
          <a href="#menu" className="transition hover:text-red-600">
            Menu
          </a>
          <a href="#retiro" className="transition hover:text-red-600">
            Retiro
          </a>
          <Link href="/admin" className="transition hover:text-red-600">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div
            className={`hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-sm lg:flex ${
              settings.isOpen ? "text-emerald-700" : "text-red-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                settings.isOpen ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {settings.statusMessage}
          </div>

          <div className="hidden items-center gap-2 text-xs font-semibold text-black/60 xl:flex">
            <Clock3 size={15} aria-hidden="true" />
            {settings.prepTime}
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold text-black/60 xl:flex">
            <MapPin size={15} aria-hidden="true" />
            Retiro en local
          </div>

          <Link
            href="/admin"
            aria-label="Entrar al panel admin"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#17130f] shadow-sm transition hover:text-red-600"
          >
            <LockKeyhole size={18} aria-hidden="true" />
          </Link>

          <button
            onClick={toggleCart}
            aria-label={`Abrir carrito con ${itemCount} productos`}
            className="relative flex items-center gap-2 rounded-full bg-[#17130f] px-4 py-2.5 font-bold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            <ShoppingCart size={19} aria-hidden="true" />
            <span className="hidden sm:inline">Pedido</span>

            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-yellow-300 px-1 text-xs font-black text-black shadow">
                {itemCount}
              </span>
            )}

            {cart.length > 0 && (
              <span className="hidden border-l border-white/20 pl-2 text-sm font-black sm:inline">
                ${getTotal().toLocaleString("es-CL")}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
