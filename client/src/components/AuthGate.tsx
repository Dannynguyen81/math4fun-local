/**
 * Field Journal Quest gate: one shared authentication portal keeps the landing page as the only entrance.
 * New profiles pass immediately to the deliberate companion-selection step before entering the game world.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { AuthModal } from "@/components/AuthModal";
import { AvatarCarousel } from "@/components/AvatarCarousel";

type AuthMode = "login" | "register";
type AuthGateValue = { openAuth: (mode?: AuthMode) => void };
const AuthGateContext = createContext<AuthGateValue | undefined>(undefined);

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useGame();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("auth") === "google") {
      setMode("login");
      setOpen(true);
    }
  }, []);
  const value = useMemo<AuthGateValue>(() => ({ openAuth: (nextMode = "login") => { setMode(nextMode); setOpen(true); } }), []);
  return <AuthGateContext.Provider value={value}>{children}<AuthModal open={open} initialMode={mode} onOpenChange={setOpen} /><AvatarCarousel open={Boolean(profile && profile.role !== "admin" && !profile.onboardingCompleted)} /></AuthGateContext.Provider>;
}

export function useAuthGate() {
  const context = useContext(AuthGateContext);
  if (!context) throw new Error("useAuthGate must be used inside AuthGateProvider");
  return context;
}
