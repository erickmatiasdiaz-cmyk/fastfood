"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "./CartProvider";
import CheckoutModal from "./CheckoutModal";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * CartDrawer SaaS Premium
 * - Estado vacío diseñado
 * - Miniaturas de producto
 * - Animaciones fluidas
 * - Layout elegante tipo SaaS
 */
export default function CartDrawer() {
  const {
    cart,
    isOpen,
    toggleCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotal,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const total = getTotal();

  return (
    <>
      {/* ================= Overlay oscuro ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      {/* ================= Drawer lateral ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
            className="
              fixed top-0 right-0 h-full w-full max-w-md z-50
              bg-[#fdf6ec] shadow-2xl flex flex-col
            "
          >
            {/* ================= Header ================= */}
            <div className="p-6 border-b border-black/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  Tu pedido
                </h2>
                <p className="text-xs text-gray-500">
                  Retiro en local
                </p>
              </div>

              <button
                onClick={toggleCart}
                className="text-gray-400 hover:text-black transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* ================= Contenido ================= */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* ================= Estado vacío ================= */}
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-6 text-3xl">
                    🛒
                  </div>

                  <h3 className="text-lg font-semibold mb-2">
                    Tu carrito está vacío
                  </h3>

                  <p className="text-sm text-gray-500 mb-6">
                    Agrega tus favoritos y arma tu pedido en segundos.
                  </p>

                  <button
                    onClick={toggleCart}
                    className="
                      px-6 py-3 rounded-xl font-semibold
                      bg-red-600 text-white
                      hover:bg-red-700
                      shadow-lg transition-all duration-300
                    "
                  >
                    Ver menú
                  </button>
                </motion.div>
              ) : (

                /* ================= Productos ================= */
                <div className="space-y-6">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="
                          bg-white rounded-2xl p-4
                          shadow-md border border-black/5
                          flex gap-4
                        "
                      >
                        {/* ===== Miniatura ===== */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* ===== Info producto ===== */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                ${item.price.toLocaleString("es-CL")} c/u
                              </p>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 text-xs hover:underline"
                            >
                              Eliminar
                            </button>
                          </div>

                          <div className="flex justify-between items-center">
                            {/* Control cantidad */}
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-4">
                              <button
                                onClick={() =>
                                  decreaseQuantity(item.id)
                                }
                                className="text-lg font-bold"
                              >
                                −
                              </button>

                              <span className="font-semibold text-sm">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(item.id)
                                }
                                className="text-lg font-bold"
                              >
                                +
                              </button>
                            </div>

                            {/* Precio total producto */}
                            <motion.p
                              key={item.quantity}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="font-bold text-red-600"
                            >
                              $
                              {(item.price * item.quantity).toLocaleString("es-CL")}
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ================= Footer ================= */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-black/10 bg-white/70 backdrop-blur">
                <motion.div
                  layout
                  className="flex justify-between items-center text-lg font-bold mb-4"
                >
                  <span>Total</span>

                  <motion.span
                    key={total}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-600"
                  >
                    ${total.toLocaleString("es-CL")}
                  </motion.span>
                </motion.div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="
                    w-full py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-red-600 to-red-700
                    hover:from-red-700 hover:to-red-800
                    shadow-lg transition-all duration-200
                  "
                >
                  Enviar pedido al local
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= Modal Checkout ================= */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
      />
    </>
  );
}
