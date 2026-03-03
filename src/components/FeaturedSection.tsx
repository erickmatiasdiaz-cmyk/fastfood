"use client";

import Image from "next/image";
import { products } from "@/data/products";
import { useCart } from "./CartProvider";

/**
 * Sección de productos destacados
 * Optimizada para imágenes verticales
 */
export default function FeaturedSection() {
  const { addToCart } = useCart();

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-4xl font-bold text-center text-primary mb-16">
          🔥 Más vendidos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Imagen vertical ocupa parte superior */}
              <div className="relative w-full aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-bold">
                  {product.name}
                </h4>

                <p className="text-gray-600 mt-2 text-sm">
                  {product.description}
                </p>

                <p className="text-primary text-lg font-bold mt-4">
                  ${product.price.toLocaleString("es-CL")}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto bg-secondary hover:scale-105 active:scale-95 transition-all duration-150 text-black font-semibold py-3 rounded-full mt-6"
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
