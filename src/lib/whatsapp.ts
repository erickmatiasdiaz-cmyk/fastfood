import { Product } from "@/data/products";

type CartItem = Product & {
  quantity: number;
};

export function generateWhatsAppLink(
  cart: CartItem[],
  total: number
) {
  const phone = "56984795290";

  const message = cart
    .map(
      (item) =>
        `â€¢ ${item.quantity}x ${item.name} - $${(
          item.price * item.quantity
        ).toLocaleString("es-CL")}`
    )
    .join("\n");

  const finalMessage = `Hola, quiero pedir:\n\n${message}\n\nTotal: $${total.toLocaleString(
    "es-CL"
  )}\n\nMi direcciÃ³n es:`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(
    finalMessage
  )}`;
}

