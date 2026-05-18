"use client";

import { Clock3, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { useCart } from "./CartProvider";

const categories = ["Completos", "Churrascos", "Combos", "Empanadas"];

export default function MenuSection() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="menu" className="relative bg-[#f7efe3] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Menu online
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-normal text-[#17130f] md:text-5xl">
              Elige, agrega y confirma en menos de un minuto.
            </h2>
          </div>

          <div className="rounded-lg bg-[#17130f] px-5 py-4 text-white shadow-xl shadow-black/10">
            <p className="text-sm font-bold text-white/65">Pedido promedio</p>
            <p className="text-2xl font-black">15 min retiro</p>
          </div>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const count = products.filter(
              (product) => product.category === category
            ).length;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                  activeCategory === category
                    ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-900/15"
                    : "border-black/10 bg-white text-[#17130f] hover:border-red-600 hover:text-red-600"
                }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="grid overflow-hidden rounded-lg border border-black/8 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl md:grid-cols-[180px_1fr]"
            >
              <div className="relative min-h-56 md:min-h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 180px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    {product.badge && (
                      <p className="mb-2 text-xs font-black uppercase tracking-wide text-red-600">
                        {product.badge}
                      </p>
                    )}
                    <h3 className="text-2xl font-black text-[#17130f]">
                      {product.name}
                    </h3>
                  </div>
                  <p className="shrink-0 text-xl font-black text-red-600">
                    ${product.price.toLocaleString("es-CL")}
                  </p>
                </div>

                <p className="text-sm font-medium leading-6 text-black/60">
                  {product.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f7efe3] px-3 py-2 text-xs font-bold text-black/60">
                    <Clock3 size={15} aria-hidden="true" />
                    {product.prepTime}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-[#17130f] transition hover:bg-yellow-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
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
