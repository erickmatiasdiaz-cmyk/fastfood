"use client";

import {
  Facebook,
  Instagram,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Music2,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { WHATSAPP_PHONE } from "@/lib/whatsapp";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/puntomordida.cl",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/puntomordida.cl",
    icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@puntomordida.cl",
    icon: Music2,
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_PHONE}`,
    icon: MessageCircle,
  },
];

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-[#17130f] px-5 py-12 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-950/25">
              <UtensilsCrossed size={22} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-black uppercase leading-none tracking-wide">
                Punto Mordida
              </p>
              <p className="mt-1 text-sm font-semibold text-white/55">
                Fuente de soda para retirar
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/68">
            Completos, churrascos, papas y promos listas para pedir por
            WhatsApp. Haces tu pedido online y pasas a retirarlo caliente.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Enlaces del sitio">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-400">
            Navegacion
          </p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-white/70">
            <a href="#favoritos" className="transition hover:text-white">
              Favoritos
            </a>
            <a href="#menu" className="transition hover:text-white">
              Menu completo
            </a>
            <a href="#retiro" className="transition hover:text-white">
              Retiro en local
            </a>
            <Link href="/admin" className="inline-flex items-center gap-2 transition hover:text-white">
              <LockKeyhole size={15} aria-hidden="true" />
              Admin
            </Link>
          </div>
        </nav>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-400">
            Estado
          </p>
          <div className="mt-5 rounded-lg border border-white/10 bg-white/6 p-5">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
                settings.isOpen
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-red-500/15 text-red-300"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  settings.isOpen ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              {settings.statusMessage}
            </div>

            <p className="mt-4 text-sm font-semibold text-white/65">
              Tiempo estimado: <span className="text-white">{settings.prepTime}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/65">
              <MapPin size={16} aria-hidden="true" />
              Retiro en local
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Punto Mordida. Todos los derechos reservados.</p>
        <p>Pedidos directos por WhatsApp.</p>
      </div>
    </footer>
  );
}
