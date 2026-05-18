"use client";

import { ArrowDown, BadgePercent } from "lucide-react";
import Image from "next/image";
import { useSiteSettings } from "./SiteSettingsProvider";

export default function PromoSection() {
  const { settings } = useSiteSettings();

  if (!settings.promo.enabled) {
    return null;
  }

  const handleScroll = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#17130f] px-5 py-16 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl shadow-black/20 md:grid-cols-[1fr_420px]">
        <div className="p-7 md:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#17130f]">
            <BadgePercent size={16} aria-hidden="true" />
            {settings.promo.badge}
          </div>

          <h2 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">
            {settings.promo.title}
          </h2>

          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/70 md:text-lg">
            {settings.promo.description}
          </p>

          <button
            onClick={handleScroll}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-4 font-black text-white shadow-xl shadow-red-950/30 transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {settings.promo.cta}
            <ArrowDown size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="relative min-h-72">
          <Image
            src={settings.promo.image}
            alt={settings.promo.title}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17130f] via-transparent to-transparent md:bg-gradient-to-l" />
        </div>
      </div>
    </section>
  );
}
