"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useBetStore } from "@/lib/store";

export interface BoutSpec {
  aId: string;
  bId: string;
  label: string; // event label or "Fight Lab"
  rounds: 3 | 5;
  houseA?: number; // real/known house line
  houseB?: number;
  eventId?: string;
  title?: string;   // "UFC Featherweight Title" — mark title bouts
}

interface AppContextValue {
  mounted: boolean;
  profileId: string | null;
  openProfile: (fighterId: string) => void;
  closeProfile: () => void;
  simSpec: BoutSpec | null;
  setSimSpec: (s: BoutSpec | null) => void;
  betSpec: { spec: BoutSpec; side: "A" | "B" } | null;
  setBetSpec: (v: { spec: BoutSpec; side: "A" | "B" } | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [simSpec, setSimSpec] = useState<BoutSpec | null>(null);
  const [betSpec, setBetSpec] = useState<{ spec: BoutSpec; side: "A" | "B" } | null>(null);

  useEffect(() => {
    void Promise.resolve(useBetStore.persist.rehydrate()).then(() => {
      // nobody stays broke — if a stale session left the wallet empty,
      // the emergency sponsorship kicks in on load
      useBetStore.getState().checkBailout();
    });
    setMounted(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        mounted,
        profileId,
        openProfile: (id) => setProfileId(id),
        closeProfile: () => setProfileId(null),
        simSpec,
        setSimSpec,
        betSpec,
        setBetSpec,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
