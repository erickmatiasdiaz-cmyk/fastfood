import type { Product } from "@/data/products";

type CartItem = Product & {
  quantity: number;
};

type GenerateWhatsAppLinkParams = {
  cart: CartItem[];
  total: number;
  customerName: string;
  pickupTime: string;
  comment?: string;
};

export const WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "56984795290";

export function generateWhatsAppLink({
  cart,
  total,
  customerName,
  pickupTime,
  comment,
}: GenerateWhatsAppLinkParams) {
  const itemsText = cart
    .map(
      (item) =>
        `${item.quantity}x ${item.name} - $${(
          item.price * item.quantity
        ).toLocaleString("es-CL")}`
    )
    .join("\n");

  const finalMessage = [
    "Hola, quiero retirar el siguiente pedido:",
    "",
    itemsText,
    "",
    `Total: $${total.toLocaleString("es-CL")}`,
    `Nombre: ${customerName}`,
    `Hora de retiro: ${pickupTime}`,
    comment ? `Comentario: ${comment}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    finalMessage
  )}`;
}
