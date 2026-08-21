/** Field Journal Quest — generated from the Math4Fun Supabase schema on 2026-08-21. */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDefinition<Row, Insert, Update, Relationships extends readonly unknown[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<
        { id: string; owner_id: string; local_profile_id: string | null; username: string | null; display_name: string; avatar: string; state: Json; state_version: number; xp: number; gold: number; streak: number; map1_boss_defeated: boolean; map2_boss_defeated: boolean; created_at: string; updated_at: string },
        { id: string; owner_id: string; local_profile_id?: string | null; username?: string | null; display_name: string; avatar?: string; state?: Json; state_version?: number; xp?: number; gold?: number; streak?: number; map1_boss_defeated?: boolean; map2_boss_defeated?: boolean; created_at?: string; updated_at?: string },
        Partial<{ id: string; owner_id: string; local_profile_id: string | null; username: string | null; display_name: string; avatar: string; state: Json; state_version: number; xp: number; gold: number; streak: number; map1_boss_defeated: boolean; map2_boss_defeated: boolean; created_at: string; updated_at: string }>
      >;
      questions: TableDefinition<
        { id: string; station_id: number; source: string; prompt: string; supporting_text: string | null; choices: number[]; answer: number; hint: string; explanation: string; difficulty: string; pool: string; created_at: string; updated_at: string },
        { id: string; station_id: number; source: string; prompt: string; supporting_text?: string | null; choices: number[]; answer: number; hint: string; explanation: string; difficulty: string; pool: string; created_at?: string; updated_at?: string },
        Partial<{ id: string; station_id: number; source: string; prompt: string; supporting_text: string | null; choices: number[]; answer: number; hint: string; explanation: string; difficulty: string; pool: string; created_at: string; updated_at: string }>
      >;
      reports: TableDefinition<
        { id: string; reporter_id: string; question_id: string; category: string; note: string; status: string; admin_reply: string | null; reviewed_at: string | null; reviewed_by: string | null; handling_history: Json; created_at: string; updated_at: string },
        { id: string; reporter_id: string; question_id: string; category: string; note: string; status?: string; admin_reply?: string | null; reviewed_at?: string | null; reviewed_by?: string | null; handling_history?: Json; created_at?: string; updated_at?: string },
        Partial<{ id: string; reporter_id: string; question_id: string; category: string; note: string; status: string; admin_reply: string | null; reviewed_at: string | null; reviewed_by: string | null; handling_history: Json; created_at: string; updated_at: string }>
      >;
      gold_ledger: TableDefinition<
        { id: string; profile_id: string; amount: number; category: string; label: string; created_at: string },
        { id: string; profile_id: string; amount: number; category: string; label: string; created_at?: string },
        Partial<{ id: string; profile_id: string; amount: number; category: string; label: string; created_at: string }>
      >;
      guardian_collection: TableDefinition<
        { profile_id: string; guardian_id: string; collected_at: string; training_xp: number; health: number; is_in_team: boolean; updated_at: string },
        { profile_id: string; guardian_id: string; collected_at?: string; training_xp?: number; health?: number; is_in_team?: boolean; updated_at?: string },
        Partial<{ profile_id: string; guardian_id: string; collected_at: string; training_xp: number; health: number; is_in_team: boolean; updated_at: string }>
      >;
      leaderboard: TableDefinition<
        { profile_id: string; display_name: string; avatar: string; score: number; level: number; badges: number; guardians: number; stations: number; streak: number; updated_at: string },
        { profile_id: string; display_name: string; avatar?: string; score?: number; level?: number; badges?: number; guardians?: number; stations?: number; streak?: number; updated_at?: string },
        Partial<{ profile_id: string; display_name: string; avatar: string; score: number; level: number; badges: number; guardians: number; stations: number; streak: number; updated_at: string }>
      >;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type CloudProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CloudLeaderboardRow = Database["public"]["Tables"]["leaderboard"]["Row"];
