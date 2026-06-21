"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { useCart } from "./CartProvider";
import { useSiteSettings } from "./SiteSettingsProvider";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotal,
  } = useCart();
  const { settings } = useSiteSettings();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const total = getTotal();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            aria-label="Carrito de compras"
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#f7efe3] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-black/10 bg-white/75 flex justify-between items-center backdrop-blur">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                  Pedido online
                </p>
                <h2 className="text-2xl font-black text-[#17130f]">
                  Tu pedido
                </h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-black/55">
                  <Clock3 size={14} aria-hidden="true" />
                  Retiro estimado {settings.prepTime}
                </p>
              </div>

              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="text-gray-500 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-full p-1"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-6 text-red-600">
                    <ShoppingCart size={38} aria-hidden="true" />
                  </div>

                  <h3 className="text-lg font-black mb-2 text-[#17130f]">
                    Tu carrito esta vacio
                  </h3>

                  <p className="text-sm font-medium leading-6 text-black/55 mb-6">
                    Agrega tus favoritos y arma tu pedido en segundos.
                  </p>

                  <button
                    onClick={closeCart}
                    className="px-6 py-3 rounded-full font-black bg-red-600 text-white hover:bg-red-700 shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    Ver menu
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.article
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg p-4 shadow-sm border border-black/8 flex gap-4"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <div>
                              <h3 className="font-black text-[#17130f]">
                                {item.name}
                              </h3>
                              <p className="text-xs font-medium text-black/50">
                                ${item.price.toLocaleString("es-CL")} c/u
                              </p>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 text-xs font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded"
                            >
                              Eliminar
                            </button>
                          </div>

                          <div className="flex justify-between items-center gap-3">
                            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-2">
                              <button
                                onClick={() => decreaseQuantity(item.id)}
                                aria-label={`Quitar una unidad de ${item.name}`}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                              >
                                <Minus size={16} aria-hidden="true" />
                              </button>

                              <span className="font-black text-sm min-w-5 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => increaseQuantity(item.id)}
                                aria-label={`Agregar una unidad de ${item.name}`}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                              >
                                <Plus size={16} aria-hidden="true" />
                              </button>
                            </div>

                            <motion.p
                              key={item.quantity}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="font-black text-red-600 whitespace-nowrap"
                            >
                              $
                              {(item.price * item.quantity).toLocaleString(
                                "es-CL"
                              )}
                            </motion.p>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-black/10 bg-white/95 backdrop-blur">
                <div className="mb-4 rounded-lg bg-[#f7efe3] p-4">
                  <div className="flex justify-between text-sm font-bold text-black/60">
                    <span>Retiro</span>
                    <span>En local</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm font-bold text-black/60">
                    <span>Comision online</span>
                    <span>$0</span>
                  </div>
                </div>

                <motion.div
                  layout
                  className="flex justify-between items-center text-xl font-black mb-4 text-[#17130f]"
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

                {settings.isOpen ? (
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 rounded-full font-black text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    Continuar por WhatsApp
                  </button>
                ) : (
                  <div>
                    <button
                      disabled
                      aria-disabled="true"
                      className="w-full py-4 rounded-full font-black text-white bg-black/30 cursor-not-allowed"
                    >
                      Local cerrado
                    </button>
                    <p className="mt-2 text-center text-xs font-bold text-black/55">
                      {settings.statusMessage}. Podrás pedir cuando reabramos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
      />
    </>
  );
}
