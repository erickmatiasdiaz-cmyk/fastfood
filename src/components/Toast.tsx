"use client";

import { useCart } from "./CartProvider";

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
      {toast}
    </div>
  );
}
