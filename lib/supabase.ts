import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Anon (publishable) istemcisi — yalnızca güvenli RPC'leri çağırabilir.
 * Sunucu API route'unda lead göndermek için kullanılır.
 */
export function getAnonClient() {
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı değil"
    );
  }
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Service role istemcisi — SADECE sunucu tarafı. RLS'i bypass eder.
 * Admin listeleme için kullanılır. Asla tarayıcıya gönderilmez.
 */
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY tanımlı değil"
    );
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  language: string | null;
  treatment: string | null;
  message: string | null;
  source: string | null;
  utm: Record<string, unknown>;
  status: string;
  consent: boolean;
};
