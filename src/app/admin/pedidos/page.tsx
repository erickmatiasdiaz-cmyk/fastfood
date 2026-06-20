"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  customer_name: string;
  pickup_time: string;
  comment: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
};

const STATUSES = ["nuevo", "preparando", "listo", "entregado"] as const;

const STATUS_STYLES: Record<string, string> = {
  nuevo: "bg-yellow-100 text-yellow-800",
  preparando: "bg-blue-100 text-blue-800",
  listo: "bg-emerald-100 text-emerald-800",
  entregado: "bg-black/10 text-black/60",
};

export default function OrdersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("id, customer_name, pickup_time, comment, items, total, status, created_at")
      .order("created_at", { ascending: false });
    setOrders((data as Order[] | null) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const user = data.session?.user;
      if (!user) {
        setAuthChecked(true);
        return;
      }
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      setAllowed(Boolean(adminRow));
      setAuthChecked(true);
      if (adminRow) loadOrders();
    });
    return () => {
      active = false;
    };
  }, [supabase, loadOrders]);

  const updateStatus = async (id: number, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from("orders").update({ status }).eq("id", id);
  };

  if (!authChecked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#17130f] text-white">
        <p className="font-black">Cargando...</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#17130f] px-5 text-white">
        <section className="w-full max-w-md rounded-lg bg-white p-8 text-center text-[#17130f] shadow-2xl">
          <h1 className="text-2xl font-black">Acceso restringido</h1>
          <p className="mt-3 text-sm font-medium text-black/60">
            Inicia sesion como administrador para ver los pedidos.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-block rounded-full bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700"
          >
            Ir al panel
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7efe3] text-[#17130f]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
              Punto Mordida
            </p>
            <h1 className="mt-1 text-3xl font-black">Pedidos</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black transition hover:border-red-600 hover:text-red-600"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Actualizar
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-[#17130f] px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Panel
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        {loading ? (
          <p className="font-black">Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <p className="rounded-lg border border-black/8 bg-white p-8 text-center font-black text-black/50 shadow-sm">
            Aun no hay pedidos.
          </p>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-black/8 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black">{order.customer_name}</h2>
                    <p className="text-xs font-bold text-black/50">
                      #{order.id} ·{" "}
                      {new Date(order.created_at).toLocaleString("es-CL")} · Retiro:{" "}
                      {order.pickup_time}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                      STATUS_STYLES[order.status] ?? "bg-black/10 text-black/60"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <ul className="mt-4 grid gap-1 text-sm font-medium text-black/70">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between gap-4">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-bold">
                        ${(item.price * item.quantity).toLocaleString("es-CL")}
                      </span>
                    </li>
                  ))}
                </ul>

                {order.comment && (
                  <p className="mt-3 rounded-lg bg-[#f7efe3] p-3 text-sm font-medium text-black/70">
                    {order.comment}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-4">
                  <p className="text-lg font-black text-red-600">
                    Total: ${order.total.toLocaleString("es-CL")}
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-black/55">Estado</label>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value)
                      }
                      className="rounded-lg border border-black/15 px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-red-600"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
