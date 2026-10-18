"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "@/components/octagon/AppContext";
import { HomeTab } from "@/components/octagon/HomeTab";
import { DivisionsTab } from "@/components/octagon/DivisionsTab";
import { RosterTab } from "@/components/octagon/RosterTab";
import { FightLabTab } from "@/components/octagon/FightLabTab";
import { EventsTab } from "@/components/octagon/EventsTab";
import { FighterProfileDialog } from "@/components/octagon/FighterProfile";
import { BetDialog, FightSimDialog } from "@/components/octagon/BettingDialogs";
import { BetHistorySheet } from "@/components/octagon/BetHistory";
import { useBetStore } from "@/lib/store";
import { useUniverseVersion } from "@/lib/universe";
import { getFighter, ROSTER } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Octagon, Home, Trophy, Users, Swords, CalendarDays, Wallet, History, ChevronUp } from "lucide-react";

type TabId = "home" | "divisions" | "roster" | "lab" | "events";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "HOME", icon: <Home className="h-4 w-4" /> },
  { id: "divisions", label: "DIVISIONS", icon: <Trophy className="h-4 w-4" /> },
  { id: "roster", label: "FIGHTERS", icon: <Users className="h-4 w-4" /> },
  { id: "lab", label: "FIGHT LAB", icon: <Swords className="h-4 w-4" /> },
  { id: "events", label: "EVENTS", icon: <CalendarDays className="h-4 w-4" /> },
];

function Shell() {
  const [tab, setTab] = useState<TabId>("home");
  const [historyOpen, setHistoryOpen] = useState(false);
  const { mounted, setSimSpec } = useApp();
  const { bankroll, bets } = useBetStore();
  // universe events mutate fighters' records, rankings & belts — this
  // re-renders the whole shell when an event bout lands on the books
  useUniverseVersion();
  const net = bets.filter((b) => b.status !== "open").reduce((s, b) => s + (b.status === "won" ? (b.payout ?? 0) : -b.stake), 0);
  const openCount = bets.filter((b) => b.status === "open").length;

  // re-open a Fight Lab sim from bet history
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { aId: string; bId: string; label: string };
      const a = getFighter(detail.aId);
      const b = getFighter(detail.bId);
      if (a && b) {
        setSimSpec({ aId: a.id, bId: b.id, label: detail.label, rounds: a.isChampion || b.isChampion ? 5 : 3 });
      }
    };
    window.addEventListener("octagon:reSim", handler);
    return () => window.removeEventListener("octagon:reSim", handler);
  }, [setSimSpec]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0e11] text-zinc-100">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0e11]/85 backdrop-blur-md">
        <div className="red-grad h-1 w-full" />
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <button onClick={() => setTab("home")} className="flex items-center gap-2.5">
            <div className="red-grad flex h-8 w-8 items-center justify-center rounded-lg">
              <Octagon className="h-5 w-5 text-white" />
            </div>
            <div className="leading-none">
              <div className="font-display text-base font-bold text-white">OCTAGON<span className="text-[#ff6b66]">HQ</span></div>
              <div className="mt-0.5 hidden text-[8px] font-display tracking-[0.25em] text-zinc-500 sm:block">
                UFC 2026 HUB · OCT 17 UPDATE
              </div>
            </div>
          </button>

          {/* desktop tabs */}
          <nav className="hidden items-center gap-1 lg:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-[11px] font-bold tracking-wider transition-colors",
                  tab === t.id
                    ? "red-grad text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>

          {/* wallet */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-2.5 rounded-xl border border-[#e0b64c]/40 bg-[#e0b64c]/10 px-3 py-1.5 transition-colors hover:bg-[#e0b64c]/20"
              title="Bet history"
            >
              <Wallet className="h-4 w-4 text-[#e0b64c]" />
              <div className="leading-none">
                <div className="num text-sm font-bold text-[#e0b64c]">
                  {mounted ? `$${bankroll.toFixed(2)}` : "$—"}
                </div>
                <div className="num mt-0.5 text-[9px] font-semibold text-zinc-400">
                  {mounted ? (
                    <span className={net >= 0 ? "text-emerald-400" : "text-[#ff6b66]"}>
                      {net >= 0 ? "+" : "−"}${Math.abs(net).toFixed(2)}
                    </span>
                  ) : (
                    "LOADING…"
                  )}
                  {openCount > 0 && <span className="ml-1 text-[#e0b64c]">· {openCount} open</span>}
                </div>
              </div>
              <History className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-3 py-5 pb-24 sm:px-6 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "home" && <HomeTab />}
            {tab === "divisions" && <DivisionsTab />}
            {tab === "roster" && <RosterTab />}
            {tab === "lab" && <FightLabTab />}
            {tab === "events" && <EventsTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ===== Footer ===== */}
      <footer className="mt-auto hidden border-t border-white/10 bg-black/40 py-3 lg:block">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 text-[9px] font-display tracking-[0.2em] text-zinc-600">
          <span>OCTAGON HQ · UNOFFICIAL FAN APP · NOT AFFILIATED WITH UFC</span>
          <span>{ROSTER.length} FIGHTERS · ELO ENGINE v3 · $100 START · $500 BAILOUTS · DYNAMIC BELTS</span>
        </div>
      </footer>

      {/* ===== Mobile bottom nav ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0d0e11]/95 backdrop-blur-md lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="grid grid-cols-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 transition-colors",
                tab === t.id ? "text-[#ff6b66]" : "text-zinc-500"
              )}
            >
              <div className="relative">
                {t.icon}
                {tab === t.id && <div className="absolute -top-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#e5322d]" />}
              </div>
              <span className="text-[8px] font-display font-bold tracking-wider">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== Dialogs ===== */}
      <FighterProfileDialog />
      <BetDialog />
      <FightSimDialog />
      <BetHistorySheet open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
