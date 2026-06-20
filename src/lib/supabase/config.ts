// Supabase connection values.
//
// The URL and the *publishable* anon key are public by design: they ship in the
// browser bundle and security is enforced by Row Level Security (configured in
// the database). Environment variables take precedence so the project can be
// pointed at a different Supabase instance or have its key rotated without a
// code change.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://uppoulhtawbelsqmfhqh.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_T4P_TViHZ9fqndnh-4Nbrw_MPZHkV0c";
