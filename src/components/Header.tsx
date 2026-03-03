"use client";

// Icono carrito (lucide)
import { ShoppingCart } from "lucide-react";

// Hook del carrito
import { useCart } from "@/components/CartProvider";

export default function Header() {
  // Extraemos datos y funciones del contexto
  const { cart, toggleCart, getTotal } = useCart();

  return (
    /*
      HEADER PRINCIPAL
      - Sticky: siempre visible
      - Fondo rojo corporativo
      - Z-index alto para quedar sobre todo
    */
    <header className="sticky top-0 z-50 bg-red-600 text-white shadow-lg">

      {/* CONTENEDOR CENTRAL */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* ================= LOGO ================= */}
        <div className="flex items-center gap-3">
          
          {/* Círculo marca */}
          <div
            className="
              w-10 h-10
              rounded-full
              bg-white
              text-red-600
              flex items-center justify-center
              font-bold
              shadow
            "
          >
            CC
          </div>

          {/* Nombre */}
          <span className="font-bold text-xl tracking-wide">
            COME COME
          </span>
        </div>

        {/* ================= BOTÓN CARRITO ================= */}
        <button
          onClick={toggleCart} // Abre el drawer
          className="
            relative
            flex items-center gap-3
            bg-white hover:bg-gray-100
            text-red-600 font-semibold
            px-5 py-2 rounded-full
            transition-all duration-300
            shadow-md hover:shadow-lg
          "
        >
          {/* Icono */}
          <ShoppingCart size={20} />

          {/* Texto */}
          <span>Carrito</span>

          {/* Badge cantidad productos */}
          {cart.length > 0 && (
            <span
              className="
                absolute -top-2 -right-2
                bg-yellow-400 text-black
                text-xs font-bold
                w-6 h-6 flex items-center justify-center
                rounded-full
                shadow
              "
            >
              {cart.length}
            </span>
          )}

          {/* Total visible en desktop */}
          {cart.length > 0 && (
            <span className="hidden sm:inline text-sm font-bold">
              ${getTotal().toLocaleString("es-CL")}
            </span>
          )}
        </button>
      </div>

      {/* ================= LÍNEA ANIMADA PREMIUM ================= */}
      {/* 
         Barra inferior animada tipo SaaS.
         Da sensación de producto tecnológico y dinámico.
      */}
      <div className="relative h-[3px] w-full overflow-hidden">
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-yellow-400 via-orange-500 to-red-500
            animate-headerLine
          "
        />
      </div>
    </header>
  );
}
