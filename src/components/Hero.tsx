"use client";

import Image from "next/image";

/**
 * Hero premium con botones funcionales
 */
export default function Hero() {
  const handleScroll = () => {
    const section = document.getElementById("menu");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
      
      {/* Imagen de fondo */}
      <Image
        src="/hero.png"
        alt="Comida rápida premium"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay degradado premium */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40"></div>

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl px-6 text-white">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight hero-shimmer">
          Pide tu favorito en minutos
        </h2>

        <p className="mt-6 text-lg md:text-xl text-gray-200">
          Disfruta nuestros completos, churrascos y combos sin filas.
          Haz tu pedido online y recíbelo rápidamente.
        </p>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-5">
          
          {/* Botón principal */}
          <button
            onClick={handleScroll}
            className="bg-primary hover:bg-red-700 transition-all duration-200 text-white font-semibold px-10 py-4 rounded-full shadow-xl"
          >
            Pedir ahora
          </button>

          {/* Botón secundario */}
          <button
            onClick={handleScroll}
            className="border-2 border-white hover:bg-white hover:text-black transition-all duration-200 font-semibold px-10 py-4 rounded-full"
          >
            Ver menú
          </button>

        </div>
      </div>
    </section>
  );
}
