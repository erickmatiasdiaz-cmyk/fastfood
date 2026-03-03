"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "./CartProvider";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

/**
 * CheckoutModal profesional
 * - Abre WhatsApp
 * - Muestra confirmación
 * - Limpia carrito
 * - Cierra modal y drawer
 */
export default function CheckoutModal({
  isOpen,
  onClose,
  total,
}: CheckoutModalProps) {
  const { cart, clearCart, toggleCart } = useCart();

  const [name, setName] = useState("");
  const [pickupTime, setPickupTime] = useState("Ahora");
  const [comment, setComment] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  /**
   * Genera mensaje estructurado para WhatsApp
   */
  const generateMessage = () => {
    const itemsText = cart
      .map((item) => `- ${item.name} x${item.quantity}`)
      .join("\n");

    const message = `
Hola, quiero retirar el siguiente pedido:

${itemsText}

Total: $${total.toLocaleString("es-CL")}

Nombre: ${name}
Hora de retiro: ${pickupTime}
${comment ? `Comentario: ${comment}` : ""}
`;

    return encodeURIComponent(message);
  };

  /**
   * Confirmar pedido
   */
  const handleConfirm = () => {
    if (!name) {
      alert("Por favor ingresa tu nombre.");
      return;
    }

    setIsSending(true);

    const phone = "56912345678"; // ⚠️ Cambiar número real
    const url = `https://wa.me/${phone}?text=${generateMessage()}`;

    window.open(url, "_blank");

    // Mostrar estado enviado
    setTimeout(() => {
      clearCart();
      setIsSending(false);
      onClose();
      toggleCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black transition"
        >
          <X size={20} />
        </button>

        {/* Estado enviado */}
        {isSending ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-semibold text-red-600">
              Enviando pedido...
            </h2>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              Finalizar pedido
            </h2>

            {/* Nombre */}
            <div className="mb-4">
              <label className="text-sm font-medium block mb-1">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Hora retiro */}
            <div className="mb-4">
              <label className="text-sm font-medium block mb-2">
                Hora de retiro
              </label>

              <div className="flex gap-2">
                {["Ahora", "15 minutos", "30 minutos"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setPickupTime(time)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                      pickupTime === time
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Comentario */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-1">
                Comentario (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Sin cebolla, bien cocido, etc."
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Confirmar */}
            <button
              onClick={handleConfirm}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Confirmar por WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
}
