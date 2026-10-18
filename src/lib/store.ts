"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { Bet } from "./types";

// ============ Betting Store ============
// $100 starting bankroll, hydration-safe persistence (fixes the old app's
// localStorage flash / SSR mismatch bugs by rehydrating after mount).
// BANKRUPTCY BAILOUT: go broke and the promoter wires you $500 — nobody
// stays on the canvas in this sport.

const STARTING_BANKROLL = 100;
export const BAILOUT_AMOUNT = 500;

interface BetStore {
  bankroll: number;
  bets: Bet[];
  placed: number; // lifetime staked
  wonCount: number;
  lostCount: number;
  bailouts: number; // emergency sponsorships collected

  placeBet: (bet: Omit<Bet, "id" | "status" | "placedAt">) => boolean;
  settleBet: (id: string, won: boolean, methodNote: string, payout: number) => void;
  claimBailout: () => void;
  checkBailout: () => void;
  resetBankroll: () => void;
  clearHistory: () => void;
}

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function bailoutToast() {
  toast.success(
    `FLAT BROKE! An emergency $${BAILOUT_AMOUNT} sponsorship hits your account. Dana believes in you.`,
    { duration: 6000 }
  );
}

export const useBetStore = create<BetStore>()(
  persist(
    (set, get) => ({
      bankroll: STARTING_BANKROLL,
      bets: [],
      placed: 0,
      wonCount: 0,
      lostCount: 0,
      bailouts: 0,

      placeBet: (bet) => {
        const { bankroll } = get();
        if (bet.stake <= 0 || bet.stake > bankroll) return false;
        const newBet: Bet = {
          ...bet,
          id: uid(),
          status: "open",
          placedAt: Date.now(),
        };
        set((s) => ({
          bankroll: +(s.bankroll - bet.stake).toFixed(2),
          placed: +(s.placed + bet.stake).toFixed(2),
          bets: [newBet, ...s.bets],
        }));
        return true;
      },

      settleBet: (id, won, methodNote, payout) => {
        const s = get();
        const bet = s.bets.find((b) => b.id === id);
        if (!bet || bet.status !== "open") return;
        let bankroll = won ? +(s.bankroll + bet.stake + payout).toFixed(2) : s.bankroll;
        let bailouts = s.bailouts;
        // bankruptcy bailout — the house always reloads you
        if (bankroll < 1) {
          bankroll = +(bankroll + BAILOUT_AMOUNT).toFixed(2);
          bailouts += 1;
          bailoutToast();
        }
        set({
          bets: s.bets.map((b) =>
            b.id === id
              ? { ...b, status: won ? "won" : "lost", settledAt: Date.now(), methodNote, payout: won ? payout : 0 }
              : b
          ),
          bankroll,
          bailouts,
          wonCount: won ? s.wonCount + 1 : s.wonCount,
          lostCount: won ? s.lostCount : s.lostCount + 1,
        });
      },

      claimBailout: () => {
        const s = get();
        if (s.bankroll >= 1) return;
        set({ bankroll: +(s.bankroll + BAILOUT_AMOUNT).toFixed(2), bailouts: s.bailouts + 1 });
        bailoutToast();
      },

      checkBailout: () => {
        const s = get();
        if (s.bankroll < 1) {
          set({ bankroll: +(s.bankroll + BAILOUT_AMOUNT).toFixed(2), bailouts: s.bailouts + 1 });
          bailoutToast();
        }
      },

      resetBankroll: () => set({ bankroll: STARTING_BANKROLL }),

      clearHistory: () => set({ bets: [], wonCount: 0, lostCount: 0, placed: 0 }),
    }),
    {
      name: "octagon-hq-bets-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // rehydrated manually after mount — no SSR mismatch
    }
  )
);

export function openBetsForFighter(bets: Bet[], fighterId: string): Bet | undefined {
  return bets.find((b) => b.status === "open" && (b.bettorFighterId === fighterId || b.opponentId === fighterId));
}

export function openBetsForEvent(bets: Bet[], eventLabel: string): Bet[] {
  return bets.filter((b) => b.status === "open" && b.eventLabel === eventLabel);
}
