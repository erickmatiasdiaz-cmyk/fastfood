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
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import type { Product } from "@/data/products";
import { products } from "@/data/products";
import { getManagedProducts } from "@/lib/catalog";
import type { SiteSettings } from "@/lib/siteSettings";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const ADMIN_AUTH_STORAGE_KEY = "punto-mordida-admin-authenticated";
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
  const catalog = useMemo(() => getManagedProducts(settings), [settings]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "Completos",
    image: "/products/completo_italiano.png",
    featured: false,
    badge: "",
    prepTime: "10-12 min",
  });
  const [newPromo, setNewPromo] = useState({
    title: "",
    description: "",
    badge: "Nueva promo",
    cta: "Ver menu",
    image: "/products/combo_clasico.png",
    enabled: true,
  });
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
      productOverrides: {
        ...settings.productOverrides,
        ...nextSettings.productOverrides,
      },
      customProducts: nextSettings.customProducts ?? settings.customProducts,
      hiddenProductIds:
        nextSettings.hiddenProductIds ?? settings.hiddenProductIds,
      promos: nextSettings.promos ?? settings.promos,
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

  const updateProductField = (
    product: Product,
    field: keyof Omit<Product, "id">,
    value: string | number | boolean
  ) => {
    const isCustomProduct = settings.customProducts.some(
      (item) => item.id === product.id
    );

    if (isCustomProduct) {
      update({
        customProducts: settings.customProducts.map((item) =>
          item.id === product.id ? { ...item, [field]: value } : item
        ),
      });
      return;
    }

    update({
      productOverrides: {
        ...settings.productOverrides,
        [product.id]: {
          ...settings.productOverrides[product.id],
          [field]: value,
        },
      },
    });
  };

  const addProduct = () => {
    if (!newProduct.name.trim()) {
      return;
    }

    update({
      customProducts: [
        ...settings.customProducts,
        {
          ...newProduct,
          id: Date.now(),
          name: newProduct.name.trim(),
          description: newProduct.description.trim(),
          price: Number(newProduct.price) || 0,
        },
      ],
    });

    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "Completos",
      image: "/products/completo_italiano.png",
      featured: false,
      badge: "",
      prepTime: "10-12 min",
    });
  };

  const removeProduct = (product: Product) => {
    const isCustomProduct = settings.customProducts.some(
      (item) => item.id === product.id
    );

    if (isCustomProduct) {
      update({
        customProducts: settings.customProducts.filter(
          (item) => item.id !== product.id
        ),
      });
      return;
    }

    update({
      hiddenProductIds: [...settings.hiddenProductIds, product.id],
    });
  };

  const restoreProduct = (productId: number) => {
    update({
      hiddenProductIds: settings.hiddenProductIds.filter(
        (hiddenId) => hiddenId !== productId
      ),
    });
  };

  const addPromo = () => {
    if (!newPromo.title.trim()) {
      return;
    }

    update({
      promos: [
        ...settings.promos,
        {
          ...newPromo,
          id: `promo-${Date.now()}`,
          title: newPromo.title.trim(),
          description: newPromo.description.trim(),
        },
      ],
    });

    setNewPromo({
      title: "",
      description: "",
      badge: "Nueva promo",
      cta: "Ver menu",
      image: "/products/combo_clasico.png",
      enabled: true,
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
              Admin Punto Mordida
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
                <h2 className="text-xl font-black">Promociones</h2>
                <p className="text-sm font-medium text-black/55">
                  Crea varias promos y activa solo las que quieras mostrar.
                </p>
              </div>
            </div>

            <div className="mb-6 grid gap-3 rounded-lg bg-[#f7efe3] p-4 md:grid-cols-2">
              <input
                value={newPromo.title}
                onChange={(event) =>
                  setNewPromo({ ...newPromo, title: event.target.value })
                }
                placeholder="Titulo promo"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                value={newPromo.badge}
                onChange={(event) =>
                  setNewPromo({ ...newPromo, badge: event.target.value })
                }
                placeholder="Etiqueta"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                value={newPromo.description}
                onChange={(event) =>
                  setNewPromo({ ...newPromo, description: event.target.value })
                }
                placeholder="Descripcion"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600 md:col-span-2"
              />
              <input
                value={newPromo.image}
                onChange={(event) =>
                  setNewPromo({ ...newPromo, image: event.target.value })
                }
                placeholder="Imagen"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                onClick={addPromo}
                className="rounded-full bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700"
              >
                Agregar promo
              </button>
            </div>

            <div className="grid gap-4">
              {settings.promos.map((promo) => (
                <article key={promo.id} className="rounded-lg bg-[#f7efe3] p-4">
                  <label className="mb-3 flex items-center gap-3 font-black">
                    <input
                      type="checkbox"
                      checked={promo.enabled}
                      onChange={(event) =>
                        update({
                          promos: settings.promos.map((item) =>
                            item.id === promo.id
                              ? { ...item, enabled: event.target.checked }
                              : item
                          ),
                        })
                      }
                    />
                    Mostrar en tienda
                  </label>

                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      ["badge", "Etiqueta"],
                      ["title", "Titulo"],
                      ["description", "Descripcion"],
                      ["cta", "Texto boton"],
                      ["image", "Imagen"],
                    ].map(([field, label]) => (
                      <label key={field} className="text-sm font-bold">
                        {label}
                        <input
                          value={promo[field as keyof typeof promo] as string}
                          onChange={(event) =>
                            update({
                              promos: settings.promos.map((item) =>
                                item.id === promo.id
                                  ? { ...item, [field]: event.target.value }
                                  : item
                              ),
                            })
                          }
                          className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      update({
                        promos: settings.promos.filter(
                          (item) => item.id !== promo.id
                        ),
                      })
                    }
                    className="mt-4 text-sm font-black text-red-600 hover:underline"
                  >
                    Eliminar promo
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-black/8 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <ImageIcon size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black">Productos</h2>
                <p className="text-sm font-medium text-black/55">
                  Agrega, edita, destaca u oculta productos del menu.
                </p>
              </div>
            </div>

            <div className="mb-6 grid gap-3 rounded-lg bg-[#f7efe3] p-4 md:grid-cols-2">
              <input
                value={newProduct.name}
                onChange={(event) =>
                  setNewProduct({ ...newProduct, name: event.target.value })
                }
                placeholder="Nombre"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                type="number"
                value={newProduct.price}
                onChange={(event) =>
                  setNewProduct({
                    ...newProduct,
                    price: Number(event.target.value),
                  })
                }
                placeholder="Precio"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                value={newProduct.category}
                onChange={(event) =>
                  setNewProduct({ ...newProduct, category: event.target.value })
                }
                placeholder="Categoria"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                value={newProduct.image}
                onChange={(event) =>
                  setNewProduct({ ...newProduct, image: event.target.value })
                }
                placeholder="Imagen"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                value={newProduct.description}
                onChange={(event) =>
                  setNewProduct({
                    ...newProduct,
                    description: event.target.value,
                  })
                }
                placeholder="Descripcion"
                className="rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600 md:col-span-2"
              />
              <label className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 font-black">
                <input
                  type="checkbox"
                  checked={Boolean(newProduct.featured)}
                  onChange={(event) =>
                    setNewProduct({
                      ...newProduct,
                      featured: event.target.checked,
                    })
                  }
                />
                Destacado
              </label>
              <button
                onClick={addProduct}
                className="rounded-full bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700"
              >
                Agregar producto
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {catalog.map((product) => (
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
                    value={product.name}
                    onChange={(event) =>
                      updateProductField(product, "name", event.target.value)
                    }
                    className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <input
                    type="number"
                    value={product.price}
                    onChange={(event) =>
                      updateProductField(
                        product,
                        "price",
                        Number(event.target.value)
                      )
                    }
                    className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <input
                    value={product.image}
                    onChange={(event) =>
                      updateProductField(product, "image", event.target.value)
                    }
                    className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <textarea
                    value={product.description}
                    onChange={(event) =>
                      updateProductField(
                        product,
                        "description",
                        event.target.value
                      )
                    }
                    className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <label className="mb-3 flex items-center gap-2 text-sm font-black">
                    <input
                      type="checkbox"
                      checked={Boolean(product.featured)}
                      onChange={(event) =>
                        updateProductField(
                          product,
                          "featured",
                          event.target.checked
                        )
                      }
                    />
                    Destacado
                  </label>
                  <button
                    onClick={() => removeProduct(product)}
                    className="text-sm font-black text-red-600 hover:underline"
                  >
                    Quitar del menu
                  </button>
                </article>
              ))}
              {products
                .filter((product) => settings.hiddenProductIds.includes(product.id))
                .map((product) => (
                  <button
                    key={product.id}
                    onClick={() => restoreProduct(product.id)}
                    className="rounded-lg border border-dashed border-red-300 bg-red-50 p-4 text-left font-black text-red-700"
                  >
                    Restaurar {product.name}
                  </button>
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
