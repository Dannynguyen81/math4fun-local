/**
 * Field Journal Quest gate: one shared authentication portal keeps the landing page as the only entrance.
 * New profiles pass immediately to the deliberate companion-selection step before entering the game world.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useGame } from "@/contexts/GameContext";
import { AuthModal } from "@/components/AuthModal";
import { AvatarCarousel } from "@/components/AvatarCarousel";
import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register";
type AuthGateValue = { openAuth: (mode?: AuthMode) => void };
const AuthGateContext = createContext<AuthGateValue | undefined>(undefined);

const isSupabaseAdmin = (user: User | null | undefined) => user?.app_metadata?.math4fun_role === "admin";

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const { profile, exitGame } = useGame();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [authChecked, setAuthChecked] = useState(false);
  const [adminAuthorized, setAdminAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("auth") === "google") {
      setMode("login");
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthChecked(true);
      setAdminAuthorized(false);
      return;
    }
    let disposed = false;
    void supabase.auth.getUser().then(({ data }) => {
      if (disposed) return;
      setAdminAuthorized(isSupabaseAdmin(data.user));
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminAuthorized(isSupabaseAdmin(session?.user));
      setAuthChecked(true);
    });
    return () => {
      disposed = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Do not eject an admin profile merely because React state has not yet observed
  // the SIGNED_IN event. Re-read the authoritative Supabase session first. This
  // removes a race where signInWithPassword succeeds and selectProfile(admin)
  // runs a few milliseconds before onAuthStateChange updates adminAuthorized.
  useEffect(() => {
    if (!authChecked || profile?.role !== "admin" || adminAuthorized) return;
    if (!supabase) {
      exitGame();
      setMode("login");
      setOpen(true);
      return;
    }
    let disposed = false;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (disposed) return;
      if (!error && isSupabaseAdmin(data.user)) {
        setAdminAuthorized(true);
        return;
      }
      exitGame();
      setMode("login");
      setOpen(true);
    });
    return () => { disposed = true; };
  }, [adminAuthorized, authChecked, exitGame, profile?.role]);

  const value = useMemo<AuthGateValue>(() => ({ openAuth: (nextMode = "login") => { setMode(nextMode); setOpen(true); } }), []);
  const blockUnverifiedAdmin = profile?.role === "admin" && (!authChecked || !adminAuthorized);

  return <AuthGateContext.Provider value={value}>
    {!blockUnverifiedAdmin && children}
    <AuthModal open={open} initialMode={mode} onOpenChange={setOpen} />
    <AvatarCarousel open={Boolean(profile && profile.role !== "admin" && !profile.onboardingCompleted)} />
  </AuthGateContext.Provider>;
}

export function useAuthGate() {
  const context = useContext(AuthGateContext);
  if (!context) throw new Error("useAuthGate must be used inside AuthGateProvider");
  return context;
}
