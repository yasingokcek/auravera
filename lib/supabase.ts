import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Anon istemci — yalnızca güvenli public RPC'leri çağırır (form gönderimi). */
export function getAnonClient() {
  if (!url || !anonKey) throw new Error("Supabase URL / ANON KEY eksik");
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** Service role istemci — SADECE sunucu tarafı, RLS bypass. Admin işlemleri. */
export function getServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase URL / SERVICE_ROLE_KEY eksik");
  return createClient(url, key, { auth: { persistSession: false } });
}

export type AdminLead = {
  id: string;
  created_at: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  language: string | null;
  treatment: string | null;
  treatment_name: string | null;
  budget_band: string | null;
  timeline: string | null;
  status: string;
  temperature: "hot" | "warm" | "cold";
  fit_grade: "A" | "B" | "C" | "D" | null;
  total_score: number;
  fit_score: number;
  intent_score: number;
  source: string | null;
  message: string | null;
  assigned_count: number;
  reachability_verified: boolean;
};
