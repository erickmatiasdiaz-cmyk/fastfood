"use client";

import { Clock3, Plus } from "lucide-react";
import Image from "next/image";
import { getManagedProducts } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import { useSiteSettings } from "./SiteSettingsProvider";

export default function FeaturedSection() {
  const { addToCart } = useCart();
  const { settings } = useSiteSettings();
  const featuredProducts = getManagedProducts(settings).filter(
    (product) => product.featured
  );

  return (
    <section id="favoritos" className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Los que mas salen
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-normal text-[#17130f] md:text-5xl">
              Los favoritos de la casa, siempre listos para retirar.
            </h2>
          </div>

          <p className="max-w-md text-base font-medium leading-7 text-black/60">
            Los que se piden una y otra vez: bien servidos, calientes y listos en
            minutos. Agregalos y pasa a buscarlos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-lg border border-black/8 bg-[#fffaf2] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#17130f] shadow">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-black text-[#17130f]">
                    {product.name}
                  </h3>
                  <p className="shrink-0 text-xl font-black text-red-600">
                    ${product.price.toLocaleString("es-CL")}
                  </p>
                </div>

                <p className="min-h-12 text-sm font-medium leading-6 text-black/60">
                  {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-black/60 shadow-sm">
                    <Clock3 size={15} aria-hidden="true" />
                    {product.prepTime}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17130f] px-5 py-3 text-sm font-black text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                  >
                    <Plus size={17} aria-hidden="true" />
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
