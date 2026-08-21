/** Field Journal Quest — browser-only Supabase client; only public configuration is read from Vite. */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || "https://qxgyjhrmmwkibcpozzau.supabase.co";
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  || "sb_publishable_Fv6Ga9FSUV1jfceI_wFT1A_GLIgfeJb";
const enabled = import.meta.env.VITE_SUPABASE_SYNC_ENABLED !== "false";

export const isSupabaseSyncEnabled = Boolean(enabled && url && publishableKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseSyncEnabled
  ? createClient<Database>(url!, publishableKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
