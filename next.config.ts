import type { NextConfig } from "next";

// Supabase Storage host (e.g. uppoulhtawbelsqmfhqh.supabase.co), derived from the
// public env var so the image optimizer only proxies our own bucket — not any
// arbitrary host on the internet.
const supabaseHost = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
        "https://uppoulhtawbelsqmfhqh.supabase.co"
    ).hostname;
  } catch {
    return "uppoulhtawbelsqmfhqh.supabase.co";
  }
})();

// Content Security Policy. Next.js App Router injects inline bootstrap scripts and
// Tailwind/Framer use inline styles, so 'unsafe-inline' is required without a nonce
// pipeline. img-src stays broad (admin can reference external product images);
// connect-src is locked to Supabase REST + Realtime (wss). 'unsafe-eval' is added
// only in development, where React's dev build relies on eval() — production never
// uses it and stays free of 'unsafe-eval'.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
