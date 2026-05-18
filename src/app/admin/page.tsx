"use client";

import {
  BadgePercent,
  Clock3,
  ImageIcon,
  LockKeyhole,
  LogOut,
  Power,
  RotateCcw,
  Save,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";
import { products } from "@/data/products";
import type { SiteSettings } from "@/lib/siteSettings";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const ADMIN_AUTH_STORAGE_KEY = "comecome-admin-authenticated";
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "1234";

function getAdminAuthSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function subscribeToAdminAuth(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export default function AdminPage() {
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const storedAuthentication = useSyncExternalStore(
    subscribeToAdminAuth,
    getAdminAuthSnapshot,
    () => false
  );
  const [sessionAuthentication, setSessionAuthentication] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const isAuthenticated =
    !isLoggedOut && (storedAuthentication || sessionAuthentication);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pin === ADMIN_PIN) {
      try {
        window.sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "true");
      } catch {
        // Keep this session authenticated even if storage is unavailable.
      }
      setSessionAuthentication(true);
      setIsLoggedOut(false);
      setPin("");
      setLoginError("");
      return;
    }

    setLoginError("PIN incorrecto. Revisa la clave local del panel.");
  };

  const handleLogout = () => {
    try {
      window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch {
      // Nothing else to clear when storage is unavailable.
    }
    setSessionAuthentication(false);
    setIsLoggedOut(true);
  };

  const update = (nextSettings: Partial<SiteSettings>) => {
    updateSettings({
      ...settings,
      ...nextSettings,
      promo: {
        ...settings.promo,
        ...nextSettings.promo,
      },
      productImages: {
        ...settings.productImages,
        ...nextSettings.productImages,
      },
    });
  };

  const updateSchedule = (
    index: number,
    field: keyof SiteSettings["schedule"][number],
    value: string | boolean
  ) => {
    update({
      schedule: settings.schedule.map((day, dayIndex) =>
        dayIndex === index ? { ...day, [field]: value } : day
      ),
    });
  };

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#17130f] px-5 text-white">
        <section className="w-full max-w-md overflow-hidden rounded-lg bg-white text-[#17130f] shadow-2xl">
          <div className="bg-[#f7efe3] p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
              <LockKeyhole size={23} aria-hidden="true" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Admin local
            </p>
            <h1 className="mt-2 text-3xl font-black">Entrar al panel</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-black/60">
              Acceso para cambiar horarios, estado abierto/cerrado, imagenes y
              promociones desde este navegador.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-7">
            <label htmlFor="admin-pin" className="block text-sm font-bold">
              PIN local
            </label>
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              value={pin}
              onChange={(event) => {
                setPin(event.target.value);
                if (loginError) setLoginError("");
              }}
              className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 text-lg font-black tracking-[0.25em] outline-none focus:ring-2 focus:ring-red-600"
              placeholder="1234"
            />

            {loginError && (
              <p className="mt-3 text-sm font-bold text-red-600">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-red-600 px-5 py-4 font-black text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Ingresar
            </button>

            <Link
              href="/"
              className="mt-4 block text-center text-sm font-bold text-black/55 transition hover:text-red-600"
            >
              Volver a la tienda
            </Link>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7efe3] text-[#17130f]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Admin Come Come
            </p>
            <h1 className="mt-1 text-3xl font-black">Panel operativo</h1>
          </div>

          <Link
            href="/"
            className="rounded-full bg-[#17130f] px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
          >
            Ver tienda
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-[#17130f] transition hover:border-red-600 hover:text-red-600"
          >
            <LogOut size={16} aria-hidden="true" />
            Salir
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <section className="rounded-lg border border-black/8 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Power size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Estado del local</h2>
                <p className="text-sm font-medium text-black/55">
                  Esto se muestra en portada y header.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                update({
                  isOpen: !settings.isOpen,
                  statusMessage: !settings.isOpen
                    ? "Abierto ahora"
                    : "Cerrado por ahora",
                })
              }
              className={`mb-4 w-full rounded-full px-5 py-4 text-left text-sm font-black transition ${
                settings.isOpen
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {settings.isOpen ? "Local abierto" : "Local cerrado"}
            </button>

            <label className="block text-sm font-bold">Mensaje visible</label>
            <input
              value={settings.statusMessage}
              onChange={(event) =>
                update({ statusMessage: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
            />

            <label className="mt-4 block text-sm font-bold">
              Tiempo estimado
            </label>
            <input
              value={settings.prepTime}
              onChange={(event) => update({ prepTime: event.target.value })}
              className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
            />
          </section>

          <section className="rounded-lg border border-black/8 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-[#17130f]">
                <ImageIcon size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Imagen principal</h2>
                <p className="text-sm font-medium text-black/55">
                  Usa una ruta local o URL publica.
                </p>
              </div>
            </div>

            <div className="relative mb-4 h-40 overflow-hidden rounded-lg bg-black/5">
              <Image
                src={settings.heroImage}
                alt="Preview hero"
                fill
                sizes="360px"
                className="object-cover"
              />
            </div>

            <input
              value={settings.heroImage}
              onChange={(event) => update({ heroImage: event.target.value })}
              className="w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
            />
          </section>

          <button
            onClick={resetSettings}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-4 font-black transition hover:border-red-600 hover:text-red-600"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Restaurar demo
          </button>
        </aside>

        <div className="space-y-6">
          <section className="rounded-lg border border-black/8 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Clock3 size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Horarios</h2>
                <p className="text-sm font-medium text-black/55">
                  Activa o pausa dias especificos.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {settings.schedule.map((day, index) => (
                <div
                  key={day.label}
                  className="grid gap-3 rounded-lg bg-[#f7efe3] p-3 md:grid-cols-[1fr_120px_120px_110px]"
                >
                  <p className="self-center font-black">{day.label}</p>
                  <input
                    type="time"
                    value={day.open}
                    disabled={day.closed}
                    onChange={(event) =>
                      updateSchedule(index, "open", event.target.value)
                    }
                    className="rounded-lg border border-black/10 px-3 py-2 font-bold disabled:opacity-40"
                  />
                  <input
                    type="time"
                    value={day.close}
                    disabled={day.closed}
                    onChange={(event) =>
                      updateSchedule(index, "close", event.target.value)
                    }
                    className="rounded-lg border border-black/10 px-3 py-2 font-bold disabled:opacity-40"
                  />
                  <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={day.closed}
                      onChange={(event) =>
                        updateSchedule(index, "closed", event.target.checked)
                      }
                    />
                    Cerrado
                  </label>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-black/8 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-[#17130f]">
                <BadgePercent size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Promocion destacada</h2>
                <p className="text-sm font-medium text-black/55">
                  Visible entre favoritos y menu.
                </p>
              </div>
            </div>

            <label className="mb-4 flex items-center gap-3 rounded-lg bg-[#f7efe3] p-4 font-black">
              <input
                type="checkbox"
                checked={settings.promo.enabled}
                onChange={(event) =>
                  update({ promo: { ...settings.promo, enabled: event.target.checked } })
                }
              />
              Mostrar promo en la tienda
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["badge", "Etiqueta"],
                ["title", "Titulo"],
                ["description", "Descripcion"],
                ["cta", "Texto del boton"],
                ["image", "Imagen promo"],
              ].map(([field, label]) => (
                <label key={field} className="block text-sm font-bold">
                  {label}
                  <input
                    value={settings.promo[field as keyof typeof settings.promo] as string}
                    onChange={(event) =>
                      update({
                        promo: {
                          ...settings.promo,
                          [field]: event.target.value,
                        },
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-black/8 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <ImageIcon size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Imagenes de productos</h2>
                <p className="text-sm font-medium text-black/55">
                  Reemplaza fotos sin tocar codigo.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <article key={product.id} className="rounded-lg bg-[#f7efe3] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white">
                      <Image
                        src={settings.productImages[product.id] || product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-black">{product.name}</h3>
                      <p className="text-xs font-bold text-black/50">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <input
                    value={settings.productImages[product.id] || ""}
                    placeholder={product.image}
                    onChange={(event) =>
                      update({
                        productImages: {
                          ...settings.productImages,
                          [product.id]: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                  />
                </article>
              ))}
            </div>
          </section>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
            <div className="flex items-center gap-3 font-black">
              <Save size={20} aria-hidden="true" />
              Cambios guardados automaticamente en este navegador.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
