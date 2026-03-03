"use client";

import { products } from "@/data/products";
import { useCart } from "./CartProvider";
import Image from "next/image";
import { useState } from "react";

export default function FeaturedSection() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("Completos");

  // Filtrar productos por categoría
  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  return (
    // 🔥 Fondo crema gastronómico premium
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#F4EBDD] to-[#F8F3E8]">

      
      <div className="max-w-6xl mx-auto">

        {/* Título */}
        <h2 className="text-4xl font-bold text-center text-red-600 mb-10">
          Nuestro menú
        </h2>

        {/* Botones de categoría */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {["Completos", "Churrascos", "Combos", "Empanadas"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium
                  ${
                    activeCategory === category
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {category}
              </button>
            )
          )}
        </div>

        {/* Grid de productos */}
        <div className="grid md:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Imagen optimizada */}
              <div className="relative w-full h-56">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>

                <p className="text-red-600 font-bold text-lg mb-6">
                  ${product.price.toLocaleString("es-CL")}
                </p>

                {/* Botón agregar */}
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 py-3 rounded-full font-semibold"
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
