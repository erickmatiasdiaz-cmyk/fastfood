export type ProductImageMap = Record<number, string>;

export type PromoSettings = {
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
  promo: PromoSettings;
  schedule: ScheduleDay[];
};

export const SITE_SETTINGS_STORAGE_KEY = "comecome-site-settings";

export const defaultSiteSettings: SiteSettings = {
  isOpen: true,
  statusMessage: "Abierto ahora",
  prepTime: "15-20 min",
  heroImage: "/hero.png",
  productImages: {},
  promo: {
    enabled: true,
    title: "Combo Clasico para retirar",
    description:
      "Completo italiano, papas crujientes y bebida helada con precio redondo para la hora punta.",
    badge: "Promo activa",
    cta: "Agregar promo",
    image: "/products/combo_clasico.png",
  },
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
    schedule: settings.schedule?.length
      ? settings.schedule
      : defaultSiteSettings.schedule,
  };
}
