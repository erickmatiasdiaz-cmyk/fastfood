import { CheckCircle2, Flame, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: Flame,
    title: "Hecho al momento",
    text: "Tu pedido entra directo a cocina y se prepara para retiro.",
  },
  {
    icon: CheckCircle2,
    title: "Menu corto, decision rapida",
    text: "Solo favoritos que salen bien, con precios claros y sin pasos raros.",
  },
  {
    icon: ShieldCheck,
    title: "Confirmacion por WhatsApp",
    text: "El local recibe el detalle completo antes de que salgas.",
  },
];

export default function TrustSection() {
  return (
    <section id="retiro" className="bg-[#f7efe3] px-5 py-8 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {points.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="flex gap-4 rounded-lg border border-black/8 bg-white p-5 shadow-sm"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-[#17130f]">
              <Icon size={21} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-black">{title}</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-black/60">
                {text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
