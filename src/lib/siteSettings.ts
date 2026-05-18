import type { Product } from "@/data/products";

export type ProductImageMap = Record<number, string>;
export type ProductOverrides = Record<number, Partial<Omit<Product, "id">>>;

export type PromoSettings = {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  badge: string;
  cta: string;
  image: string;
};

export type ScheduleDay = {
  label: string;
  open: string;
  close: string;
  closed: boolean;
};

export type SiteSettings = {
  isOpen: boolean;
  statusMessage: string;
  prepTime: string;
  heroImage: string;
  productImages: ProductImageMap;
  productOverrides: ProductOverrides;
  customProducts: Product[];
  hiddenProductIds: number[];
  promo: PromoSettings;
  promos: PromoSettings[];
  schedule: ScheduleDay[];
};

export const SITE_SETTINGS_STORAGE_KEY = "punto-mordida-site-settings";

export const defaultSiteSettings: SiteSettings = {
  isOpen: true,
  statusMessage: "Abierto ahora",
  prepTime: "15-20 min",
  heroImage: "/hero.png",
  productImages: {},
  productOverrides: {},
  customProducts: [],
  hiddenProductIds: [],
  promo: {
    id: "promo-combo-clasico",
    enabled: true,
    title: "Combo Clasico para retirar",
    description:
      "Completo italiano, papas crujientes y bebida helada con precio redondo para la hora punta.",
    badge: "Promo activa",
    cta: "Agregar promo",
    image: "/products/combo_clasico.png",
  },
  promos: [
    {
      id: "promo-combo-clasico",
      enabled: true,
      title: "Combo Clasico para retirar",
      description:
        "Completo italiano, papas crujientes y bebida helada con precio redondo para la hora punta.",
      badge: "Promo activa",
      cta: "Agregar promo",
      image: "/products/combo_clasico.png",
    },
  ],
  schedule: [
    { label: "Lunes", open: "12:00", close: "22:00", closed: false },
    { label: "Martes", open: "12:00", close: "22:00", closed: false },
    { label: "Miercoles", open: "12:00", close: "22:00", closed: false },
    { label: "Jueves", open: "12:00", close: "22:00", closed: false },
    { label: "Viernes", open: "12:00", close: "23:30", closed: false },
    { label: "Sabado", open: "12:00", close: "23:30", closed: false },
    { label: "Domingo", open: "13:00", close: "21:00", closed: false },
  ],
};

export function mergeSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  return {
    ...defaultSiteSettings,
    ...settings,
    promo: {
      ...defaultSiteSettings.promo,
      ...settings.promo,
    },
    productImages: {
      ...defaultSiteSettings.productImages,
      ...settings.productImages,
    },
    productOverrides: {
      ...defaultSiteSettings.productOverrides,
      ...settings.productOverrides,
    },
    customProducts: settings.customProducts ?? defaultSiteSettings.customProducts,
    hiddenProductIds:
      settings.hiddenProductIds ?? defaultSiteSettings.hiddenProductIds,
    schedule: settings.schedule?.length
      ? settings.schedule
      : defaultSiteSettings.schedule,
    promos: settings.promos?.length
      ? settings.promos
      : settings.promo
        ? [
            {
              ...defaultSiteSettings.promo,
              ...settings.promo,
              id: settings.promo.id ?? defaultSiteSettings.promo.id,
            },
          ]
        : defaultSiteSettings.promos,
  };
}
