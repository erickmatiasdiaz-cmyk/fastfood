import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

// Order creation runs server-side so it sits behind Vercel's edge: a Vercel
// Firewall rate-limit rule on `/api/orders` provides the durable, edge-wide
// limit. The in-memory limiter below is a cheap second layer for bursts that
// land on the same warm instance.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

// Cookieless anon client — inserts hit the same `orders_public_insert` RLS policy
// as before, keeping the security model intact while moving the call server-side.
const insertClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type IncomingItem = {
  id?: unknown;
  name?: unknown;
  price?: unknown;
  quantity?: unknown;
};

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { customerName, pickupTime, comment, items } = body;

  // Server-side validation mirroring the RLS WITH CHECK caps, so malformed or
  // oversized payloads get a clean 4xx instead of leaning on the DB alone.
  if (
    typeof customerName !== "string" ||
    customerName.trim().length === 0 ||
    customerName.length > 120
  ) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > 100) {
    return NextResponse.json({ error: "invalid_items" }, { status: 400 });
  }

  // Normalize items to the stored shape and recompute the total from line items
  // so the persisted total always matches what is shown (never trust the client).
  const safeItems = (items as IncomingItem[]).slice(0, 100).map((it) => ({
    id: Number(it?.id) || 0,
    name: String(it?.name ?? "").slice(0, 200),
    price: Number(it?.price) || 0,
    quantity: Number(it?.quantity) || 0,
  }));
  const total = safeItems.reduce(
    (sum, it) => sum + Math.max(0, it.price) * Math.max(0, it.quantity),
    0
  );

  const safeComment =
    typeof comment === "string" ? comment.slice(0, 1000) : "";
  const safePickup =
    typeof pickupTime === "string" && pickupTime.trim()
      ? pickupTime.slice(0, 40)
      : "Ahora";

  const { error } = await insertClient.from("orders").insert({
    customer_name: customerName.trim(),
    pickup_time: safePickup,
    comment: safeComment,
    items: safeItems,
    total,
  });

  if (error) {
    console.error("No se pudo guardar el pedido:", error);
    return NextResponse.json({ error: "insert_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
