"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "./CartProvider";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  total,
}: CheckoutModalProps) {
  const { cart, clearCart, closeCart } = useCart();
  const [name, setName] = useState("");
  const [pickupTime, setPickupTime] = useState("Ahora");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    nameInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const customerName = name.trim();
    const customerComment = comment.trim();

    if (!customerName) {
      setError("Ingresa tu nombre para identificar el pedido.");
      nameInputRef.current?.focus();
      return;
    }

    setError("");
    setIsSending(true);

    const url = generateWhatsAppLink({
      cart,
      total,
      customerName,
      pickupTime,
      comment: customerComment,
    });

    // Persist the order in Supabase. Never block the customer if it fails.
    try {
      const supabase = createClient();
      await supabase.from("orders").insert({
        customer_name: customerName,
        pickup_time: pickupTime,
        comment: customerComment,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
      });
    } catch {
      // Order still goes through via WhatsApp even if persistence fails.
    }

    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      clearCart();
      setIsSending(false);
      onClose();
      closeCart();
      setName("");
      setComment("");
      setPickupTime("Ahora");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl"
      >
        <div className="bg-[#17130f] px-6 py-5 text-white">
          <button
            onClick={onClose}
            aria-label="Cerrar checkout"
            className="absolute right-4 top-4 rounded-full p-1 text-white/65 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={20} aria-hidden="true" />
          </button>

          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
            Ultimo paso
          </p>
          <h2 id="checkout-title" className="mt-2 text-2xl font-black">
            Confirmar retiro
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-white/65">
            Enviaremos el detalle por WhatsApp para que el local lo prepare.
          </p>
        </div>

        {isSending ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <MessageCircle size={28} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black text-red-600">
              Abriendo WhatsApp...
            </h2>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4">
              <label
                htmlFor="customer-name"
                className="mb-1 block text-sm font-bold text-[#17130f]"
              >
                Nombre
              </label>
              <input
                ref={nameInputRef}
                id="customer-name"
                type="text"
                placeholder="Ej: Juan Perez"
                className="w-full rounded-lg border border-black/15 px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError("");
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "checkout-error" : undefined}
              />
            </div>

            <div className="mb-4">
              <p className="mb-2 block text-sm font-bold text-[#17130f]">
                Hora de retiro
              </p>

              <div className="grid grid-cols-3 gap-2">
                {["Ahora", "15 minutos", "30 minutos"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setPickupTime(time)}
                    aria-pressed={pickupTime === time}
                    className={`rounded-lg px-2 py-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                      pickupTime === time
                        ? "bg-red-600 text-white"
                        : "bg-[#f7efe3] text-[#17130f] hover:bg-yellow-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="customer-comment"
                className="mb-1 block text-sm font-bold text-[#17130f]"
              >
                Comentario (opcional)
              </label>
              <textarea
                id="customer-comment"
                rows={3}
                placeholder="Sin cebolla, bien cocido, etc."
                className="w-full rounded-lg border border-black/15 px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>

            <div className="mb-4 rounded-lg bg-[#f7efe3] p-4">
              <div className="flex justify-between text-sm font-bold text-black/60">
                <span>Total a confirmar</span>
                <span className="text-red-600">
                  ${total.toLocaleString("es-CL")}
                </span>
              </div>
            </div>

            {error && (
              <p id="checkout-error" className="mb-4 text-sm font-bold text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={isSending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-4 font-black text-white transition hover:bg-red-700 disabled:bg-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Confirmar por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
