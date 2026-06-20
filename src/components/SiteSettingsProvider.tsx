"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/siteSettings";

type SiteSettingsContextType = {
  settings: SiteData;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(
  undefined
);

/**
 * Provides storefront data fetched server-side from Supabase.
 * Read-only on the client; the admin panel writes through Supabase directly.
 */
export function SiteSettingsProvider({
  initialData,
  children,
}: {
  initialData: SiteData;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={{ settings: initialData }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings debe usarse dentro de SiteSettingsProvider");
  }
  return context;
}
