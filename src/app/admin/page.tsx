"use client";

import {
  BadgePercent,
  Clock3,
  ImageIcon,
  LockKeyhole,
  LogOut,
  Power,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { createClient } from "@/lib/supabase/client";
import {
  mapProduct,
  mapPromo,
  type Promo,
  type ProductRow,
  type PromoRow,
  type ScheduleDay,
  type SiteConfig,
  type SiteSettingsRow,
} from "@/lib/siteSettings";

const DEFAULT_SCHEDULE: ScheduleDay[] = [
  { label: "Lunes", open: "12:00", close: "22:00", closed: false },
  { label: "Martes", open: "12:00", close: "22:00", closed: false },
  { label: "Miercoles", open: "12:00", close: "22:00", closed: false },
  { label: "Jueves", open: "12:00", close: "22:00", closed: false },
  { label: "Viernes", open: "12:00", close: "23:30", closed: false },
  { label: "Sabado", open: "12:00", close: "23:30", closed: false },
  { label: "Domingo", open: "13:00", close: "21:00", closed: false },
];

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  category: "Completos",
  image: "/products/completo_italiano.png",
  featured: false,
  badge: "",
  prepTime: "10-12 min",
  isHidden: false,
  sortOrder: 0,
};

const EMPTY_PROMO = {
  title: "",
  description: "",
  badge: "Nueva promo",
  cta: "Ver menu",
  image: "/products/combo_clasico.png",
  enabled: true,
};

function productToRow(product: Product) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    featured: product.featured,
    badge: product.badge,
    prep_time: product.prepTime,
    is_hidden: product.isHidden,
    sort_order: product.sortOrder,
  };
}

function promoToRow(promo: Promo) {
  return {
    enabled: promo.enabled,
    title: promo.title,
    description: promo.description,
    badge: promo.badge,
    cta: promo.cta,
    image: promo.image,
    sort_order: promo.sortOrder,
  };
}

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), []);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [loadingData, setLoadingData] = useState(false);
  const [config, setConfig] = useState<SiteConfig>({
    isOpen: true,
    statusMessage: "Abierto ahora",
    prepTime: "15-20 min",
    heroImage: "/hero.png",
    schedule: DEFAULT_SCHEDULE,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);
  const [newPromo, setNewPromo] = useState(EMPTY_PROMO);

  // ---------- Auth ----------
  const checkAdmin = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      return Boolean(data);
    },
    [supabase]
  );

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const user = data.session?.user;
      setIsAuthenticated(Boolean(user));
      setIsAdmin(user ? await checkAdmin(user.id) : false);
      setAuthChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      setIsAuthenticated(Boolean(user));
      setIsAdmin(user ? await checkAdmin(user.id) : false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, checkAdmin]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoginError("Email o contrasena incorrectos.");
      setLoggingIn(false);
      return;
    }

    setPassword("");
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProducts([]);
    setPromos([]);
  };

  // ---------- Load data ----------
  const loadData = useCallback(async () => {
    setLoadingData(true);

    const [settingsRes, productsRes, promosRes] = await Promise.all([
      supabase
        .from("site_settings")
        .select("is_open, status_message, prep_time, hero_image, schedule")
        .eq("id", 1)
        .single(),
      supabase
        .from("products")
        .select(
          "id, name, description, price, category, image, featured, badge, prep_time, is_hidden, sort_order"
        )
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true }),
      supabase
        .from("promos")
        .select("id, enabled, title, description, badge, cta, image, sort_order")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true }),
    ]);

    if (settingsRes.data) {
      const row = settingsRes.data as SiteSettingsRow;
      setConfig({
        isOpen: row.is_open,
        statusMessage: row.status_message,
        prepTime: row.prep_time,
        heroImage: row.hero_image,
        schedule: row.schedule?.length ? row.schedule : DEFAULT_SCHEDULE,
      });
    }
    setProducts(((productsRes.data as ProductRow[] | null) ?? []).map(mapProduct));
    setPromos(((promosRes.data as PromoRow[] | null) ?? []).map(mapPromo));
    setLoadingData(false);
  }, [supabase]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadData();
    }
  }, [isAuthenticated, isAdmin, loadData]);

  // ---------- Site config ----------
  const persistConfig = async (next: SiteConfig) => {
    await supabase
      .from("site_settings")
      .update({
        is_open: next.isOpen,
        status_message: next.statusMessage,
        prep_time: next.prepTime,
        hero_image: next.heroImage,
        schedule: next.schedule,
      })
      .eq("id", 1);
  };

  const setConfigField = <K extends keyof SiteConfig>(
    field: K,
    value: SiteConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const toggleOpen = () => {
    const next: SiteConfig = {
      ...config,
      isOpen: !config.isOpen,
      statusMessage: !config.isOpen ? "Abierto ahora" : "Cerrado por ahora",
    };
    setConfig(next);
    persistConfig(next);
  };

  const updateScheduleDay = (
    index: number,
    field: keyof ScheduleDay,
    value: string | boolean,
    persist: boolean
  ) => {
    const schedule = config.schedule.map((day, i) =>
      i === index ? { ...day, [field]: value } : day
    );
    const next = { ...config, schedule };
    setConfig(next);
    if (persist) persistConfig(next);
  };

  // ---------- Products ----------
  const addProduct = async () => {
    if (!newProduct.name.trim()) return;
    const sortOrder =
      products.reduce((max, p) => Math.max(max, p.sortOrder), 0) + 1;

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...productToRow({ ...newProduct, id: 0 } as Product),
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: Number(newProduct.price) || 0,
        sort_order: sortOrder,
      })
      .select(
        "id, name, description, price, category, image, featured, badge, prep_time, is_hidden, sort_order"
      )
      .single();

    if (!error && data) {
      setProducts((prev) => [...prev, mapProduct(data as ProductRow)]);
      setNewProduct(EMPTY_PRODUCT);
    }
  };

  const setProductField = (
    id: number,
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const persistProduct = async (product: Product) => {
    await supabase
      .from("products")
      .update(productToRow(product))
      .eq("id", product.id);
  };

  const toggleProductField = (
    product: Product,
    field: "featured" | "isHidden",
    value: boolean
  ) => {
    const next = { ...product, [field]: value };
    setProducts((prev) => prev.map((p) => (p.id === product.id ? next : p)));
    persistProduct(next);
  };

  const deleteProduct = async (id: number) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------- Promos ----------
  const addPromo = async () => {
    if (!newPromo.title.trim()) return;
    const sortOrder =
      promos.reduce((max, p) => Math.max(max, p.sortOrder), 0) + 1;

    const { data, error } = await supabase
      .from("promos")
      .insert({
        enabled: newPromo.enabled,
        title: newPromo.title.trim(),
        description: newPromo.description.trim(),
        badge: newPromo.badge,
        cta: newPromo.cta,
        image: newPromo.image,
        sort_order: sortOrder,
      })
      .select("id, enabled, title, description, badge, cta, image, sort_order")
      .single();

    if (!error && data) {
      setPromos((prev) => [...prev, mapPromo(data as PromoRow)]);
      setNewPromo(EMPTY_PROMO);
    }
  };

  const setPromoField = (
    id: string,
    field: keyof Promo,
    value: string | boolean
  ) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const persistPromo = async (promo: Promo) => {
    await supabase.from("promos").update(promoToRow(promo)).eq("id", Number(promo.id));
  };

  const togglePromoEnabled = (promo: Promo, value: boolean) => {
    const next = { ...promo, enabled: value };
    setPromos((prev) => prev.map((p) => (p.id === promo.id ? next : p)));
    persistPromo(next);
  };

  const deletePromo = async (id: string) => {
    await supabase.from("promos").delete().eq("id", Number(id));
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------- Render ----------
  if (!authChecked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#17130f] text-white">
        <p className="font-black">Cargando panel...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#17130f] px-5 text-white">
        <section className="w-full max-w-md overflow-hidden rounded-lg bg-white text-[#17130f] shadow-2xl">
          <div className="bg-[#f7efe3] p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
              <LockKeyhole size={23} aria-hidden="true" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Panel admin
            </p>
            <h1 className="mt-2 text-3xl font-black">Entrar al panel</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-black/60">
              Inicia sesion con tu cuenta para gestionar menu, horarios,
              promociones y pedidos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-7">
            <label htmlFor="admin-email" className="block text-sm font-bold">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (loginError) setLoginError("");
              }}
              className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              placeholder="tucorreo@email.com"
            />

            <label htmlFor="admin-password" className="mt-4 block text-sm font-bold">
              Contrasena
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (loginError) setLoginError("");
              }}
              className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              placeholder="********"
            />

            {loginError && (
              <p className="mt-3 text-sm font-bold text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="mt-5 w-full rounded-full bg-red-600 px-5 py-4 font-black text-white transition hover:bg-red-700 disabled:bg-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              {loggingIn ? "Ingresando..." : "Ingresar"}
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

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#17130f] px-5 text-white">
        <section className="w-full max-w-md rounded-lg bg-white p-8 text-center text-[#17130f] shadow-2xl">
          <h1 className="text-2xl font-black">Cuenta sin permisos</h1>
          <p className="mt-3 text-sm font-medium text-black/60">
            Esta cuenta no esta autorizada como administrador.
          </p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-full bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700"
          >
            Salir
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7efe3] text-[#17130f]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Admin Punto Mordida
            </p>
            <h1 className="mt-1 text-3xl font-black">Panel operativo</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-2 rounded-full bg-[#17130f] px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              Pedidos
            </Link>
            <Link
              href="/"
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-[#17130f] transition hover:border-red-600 hover:text-red-600"
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
        </div>
      </header>

      {loadingData ? (
        <p className="mx-auto max-w-7xl px-5 py-10 font-black md:px-8">
          Cargando datos...
        </p>
      ) : (
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
                    Se muestra en portada y header.
                  </p>
                </div>
              </div>

              <button
                onClick={toggleOpen}
                className={`mb-4 w-full rounded-full px-5 py-4 text-left text-sm font-black transition ${
                  config.isOpen
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {config.isOpen ? "Local abierto" : "Local cerrado"}
              </button>

              <label className="block text-sm font-bold">Mensaje visible</label>
              <input
                value={config.statusMessage}
                onChange={(event) =>
                  setConfigField("statusMessage", event.target.value)
                }
                onBlur={() => persistConfig(config)}
                className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />

              <label className="mt-4 block text-sm font-bold">
                Tiempo estimado
              </label>
              <input
                value={config.prepTime}
                onChange={(event) =>
                  setConfigField("prepTime", event.target.value)
                }
                onBlur={() => persistConfig(config)}
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
                    Ruta local o URL publica.
                  </p>
                </div>
              </div>

              <div className="relative mb-4 h-40 overflow-hidden rounded-lg bg-black/5">
                <Image
                  src={config.heroImage}
                  alt="Preview hero"
                  fill
                  sizes="360px"
                  className="object-cover"
                />
              </div>

              <input
                value={config.heroImage}
                onChange={(event) =>
                  setConfigField("heroImage", event.target.value)
                }
                onBlur={() => persistConfig(config)}
                className="w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              />
            </section>
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
                {config.schedule.map((day, index) => (
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
                        updateScheduleDay(index, "open", event.target.value, false)
                      }
                      onBlur={() => persistConfig(config)}
                      className="rounded-lg border border-black/10 px-3 py-2 font-bold disabled:opacity-40"
                    />
                    <input
                      type="time"
                      value={day.close}
                      disabled={day.closed}
                      onChange={(event) =>
                        updateScheduleDay(index, "close", event.target.value, false)
                      }
                      onBlur={() => persistConfig(config)}
                      className="rounded-lg border border-black/10 px-3 py-2 font-bold disabled:opacity-40"
                    />
                    <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold">
                      <input
                        type="checkbox"
                        checked={day.closed}
                        onChange={(event) =>
                          updateScheduleDay(
                            index,
                            "closed",
                            event.target.checked,
                            true
                          )
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
                {promos.map((promo) => (
                  <article key={promo.id} className="rounded-lg bg-[#f7efe3] p-4">
                    <label className="mb-3 flex items-center gap-3 font-black">
                      <input
                        type="checkbox"
                        checked={promo.enabled}
                        onChange={(event) =>
                          togglePromoEnabled(promo, event.target.checked)
                        }
                      />
                      Mostrar en tienda
                    </label>

                    <div className="grid gap-3 md:grid-cols-2">
                      {(
                        [
                          ["badge", "Etiqueta"],
                          ["title", "Titulo"],
                          ["description", "Descripcion"],
                          ["cta", "Texto boton"],
                          ["image", "Imagen"],
                        ] as const
                      ).map(([field, label]) => (
                        <label key={field} className="text-sm font-bold">
                          {label}
                          <input
                            value={promo[field]}
                            onChange={(event) =>
                              setPromoField(promo.id, field, event.target.value)
                            }
                            onBlur={() => persistPromo(promo)}
                            className="mt-2 w-full rounded-lg border border-black/15 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </label>
                      ))}
                    </div>

                    <button
                      onClick={() => deletePromo(promo.id)}
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
                {products.map((product) => (
                  <article
                    key={product.id}
                    className={`rounded-lg p-4 ${
                      product.isHidden
                        ? "bg-red-50 ring-1 ring-red-200"
                        : "bg-[#f7efe3]"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={product.image}
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
                          {product.isHidden ? " - oculto" : ""}
                        </p>
                      </div>
                    </div>

                    <input
                      value={product.name}
                      onChange={(event) =>
                        setProductField(product.id, "name", event.target.value)
                      }
                      onBlur={() => persistProduct(product)}
                      className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <input
                      type="number"
                      value={product.price}
                      onChange={(event) =>
                        setProductField(
                          product.id,
                          "price",
                          Number(event.target.value)
                        )
                      }
                      onBlur={() => persistProduct(product)}
                      className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <input
                      value={product.image}
                      onChange={(event) =>
                        setProductField(product.id, "image", event.target.value)
                      }
                      onBlur={() => persistProduct(product)}
                      className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <textarea
                      value={product.description}
                      onChange={(event) =>
                        setProductField(
                          product.id,
                          "description",
                          event.target.value
                        )
                      }
                      onBlur={() => persistProduct(product)}
                      className="mb-2 w-full rounded-lg border border-black/15 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <label className="mb-3 flex items-center gap-2 text-sm font-black">
                      <input
                        type="checkbox"
                        checked={Boolean(product.featured)}
                        onChange={(event) =>
                          toggleProductField(
                            product,
                            "featured",
                            event.target.checked
                          )
                        }
                      />
                      Destacado
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          toggleProductField(product, "isHidden", !product.isHidden)
                        }
                        className="text-sm font-black text-[#17130f] hover:underline"
                      >
                        {product.isHidden ? "Mostrar en menu" : "Ocultar del menu"}
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-sm font-black text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
