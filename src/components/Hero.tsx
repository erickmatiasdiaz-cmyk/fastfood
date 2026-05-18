"use client";

import { ArrowDown, Clock3, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function Hero() {
  const { settings } = useSiteSettings();

  const handleScroll = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[calc(100svh-72px)] overflow-hidden bg-[#17130f]">
      <Image
        src={settings.heroImage}
        alt="Completos, churrascos y empanadas de Punto Mordida"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-75"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,19,15,0.92)_0%,rgba(23,19,15,0.72)_42%,rgba(23,19,15,0.35)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f7efe3] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-7xl items-center px-5 py-16 md:px-8">
        <div className="max-w-3xl text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            <span
              className={`h-2 w-2 rounded-full ${
                settings.isOpen ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            {settings.statusMessage}
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal md:text-7xl">
            Completos y churrascos calientes, sin esperar en la fila.
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/82 md:text-xl">
            Arma tu pedido, confírmalo por WhatsApp y pasa a retirarlo cuando
            esté listo. Recetas chilenas, pan tostado e ingredientes frescos.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleScroll}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-4 text-base font-black text-white shadow-2xl shadow-red-950/35 transition hover:-translate-y-0.5 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Pedir ahora
              <ArrowDown size={18} className="transition group-hover:translate-y-0.5" aria-hidden="true" />
            </button>

            <button
              onClick={handleScroll}
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#17130f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Ver menu completo
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Clock3, label: settings.prepTime, detail: "retiro estimado" },
              { icon: MessageCircle, label: "WhatsApp", detail: "confirmacion directa" },
              { icon: Star, label: "4 favoritos", detail: "menu breve y claro" },
            ].map(({ icon: Icon, label, detail }) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Icon size={20} className="mb-3 text-yellow-300" aria-hidden="true" />
                <p className="text-lg font-black">{label}</p>
                <p className="text-sm font-medium text-white/65">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
