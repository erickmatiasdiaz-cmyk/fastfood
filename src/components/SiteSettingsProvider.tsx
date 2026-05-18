"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  defaultSiteSettings,
  mergeSiteSettings,
  SITE_SETTINGS_STORAGE_KEY,
  type SiteSettings,
} from "@/lib/siteSettings";

type SiteSettingsContextType = {
  settings: SiteSettings;
  updateSettings: (settings: SiteSettings) => void;
  resetSettings: () => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(
  undefined
);

function getInitialSettings() {
  if (typeof window === "undefined") {
    return defaultSiteSettings;
  }

  try {
    const storedSettings = window.localStorage.getItem(
      SITE_SETTINGS_STORAGE_KEY
    );
    return storedSettings
      ? mergeSiteSettings(JSON.parse(storedSettings) as Partial<SiteSettings>)
      : defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(getInitialSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SITE_SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch {
      // Local admin settings are best-effort when browser storage is blocked.
    }
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      updateSettings: setSettings,
      resetSettings: () => setSettings(defaultSiteSettings),
    }),
    [settings]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
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
