"use client";

import { Clock3 } from "lucide-react";
import { useSiteSettings } from "./SiteSettingsProvider";

export default function BusinessHoursSection() {
  const { settings } = useSiteSettings();

  return (
    <section className="bg-[#f7efe3] px-5 pb-16 md:px-8">
      <div className="mx-auto max-w-7xl rounded-lg border border-black/8 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Clock3 size={21} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Horarios de retiro
            </p>
            <h2 className="text-2xl font-black text-[#17130f]">
              Planifica tu pedido antes de salir.
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {settings.schedule.map((day) => (
            <article
              key={day.label}
              className={`rounded-lg border p-4 ${
                day.closed
                  ? "border-red-100 bg-red-50 text-red-900"
                  : "border-black/8 bg-[#f7efe3] text-[#17130f]"
              }`}
            >
              <h3 className="font-black">{day.label}</h3>
              <p className="mt-2 text-sm font-bold text-black/60">
                {day.closed ? "Cerrado" : `${day.open} - ${day.close}`}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
