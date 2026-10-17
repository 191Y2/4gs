"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useBetStore } from "@/lib/store";
import { fmtOdds } from "@/lib/engine";
import { useApp } from "./AppContext";
import { DollarSign, TrendingUp, Trophy, X, Check, RotateCcw, Trash2, Swords } from "lucide-react";

export function BetHistorySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { bets, bankroll, placed, wonCount, lostCount, resetBankroll, clearHistory } = useBetStore();
  const { mounted } = useApp();

  const settled = bets.filter((b) => b.status !== "open");
  const openBets = bets.filter((b) => b.status === "open");
  const net = settled.reduce((s, b) => s + (b.status === "won" ? (b.payout ?? 0) : -b.stake), 0);
  const winPct = wonCount + lostCount > 0 ? (wonCount / (wonCount + lostCount)) * 100 : 0;
  const roi = placed > 0 ? (net / placed) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto thin-scroll border-white/10 bg-[#0f1114] sm:max-w-md">
        <div className="h-1.5 red-grad absolute top-0 left-0 right-0" />
        <SheetHeader className="pb-0">
          <SheetTitle className="font-display text-xl font-bold text-white">BET HISTORY</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">BANKROLL</div>
              <div className="num font-display text-2xl font-bold text-emerald-400">
                {mounted ? `$${bankroll.toFixed(2)}` : "—"}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">NET P/L</div>
              <div className={`num font-display text-2xl font-bold ${net >= 0 ? "text-emerald-400" : "text-[#ff6b66]"}`}>
                {net >= 0 ? "+" : "−"}${Math.abs(net).toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">RECORD</div>
              <div className="num font-display text-xl font-bold text-zinc-100">
                {wonCount}–{lostCount} <span className="text-xs text-zinc-500">({winPct.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">ROI</div>
              <div className={`num font-display text-xl font-bold ${roi >= 0 ? "text-emerald-400" : "text-[#ff6b66]"}`}>
                {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
              </div>
            </div>
          </div>

          {(mounted ? bankroll : 100) < 1 && (
            <div className="rounded-xl border border-[#e5322d]/40 bg-[#e5322d]/10 p-3">
              <p className="text-xs text-zinc-300">
                You&apos;re busted! Every great gambler needs a second chance.
              </p>
              <Button
                onClick={() => resetBankroll()}
                size="sm"
                className="red-grad mt-2 font-display font-bold tracking-widest text-white"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> RESET TO $100
              </Button>
            </div>
          )}

          {/* Open bets */}
          {openBets.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-display tracking-[0.2em] text-[#e0b64c]">
                <DollarSign className="h-3.5 w-3.5" /> OPEN BETS · {openBets.length}
              </h3>
              <div className="space-y-1.5">
                {openBets.map((b) => {
                  const canSim = b.eventLabel.startsWith("Fight Lab") || b.eventLabel.includes("Fight Lab");
                  return (
                    <div key={b.id} className="rounded-lg border border-[#e0b64c]/30 bg-[#e0b64c]/5 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-200">
                          <span className="num font-bold">${b.stake.toFixed(2)}</span> on <span className="font-semibold">{b.bettorName}</span> @ {fmtOdds(b.odds)}
                        </span>
                        <span className="num text-xs font-bold text-[#e0b64c]">
                          +${(b.stake * (b.decOdds - 1)).toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500">{b.eventLabel} · vs {b.opponentName}</span>
                      </div>
                      <div className="mt-1.5 flex gap-1.5">
                        {canSim && (
                          <button
                            onClick={() => {
                              onOpenChange(false);
                              window.dispatchEvent(
                                new CustomEvent("octagon:reSim", {
                                  detail: { aId: b.bettorFighterId, bId: b.opponentId, label: b.eventLabel },
                                })
                              );
                            }}
                            className="flex items-center gap-1 rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 hover:border-[#e5322d]/50 hover:text-white"
                          >
                            <Swords className="h-3 w-3" /> SIMULATE NOW
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-[10px] font-display tracking-[0.2em] text-zinc-400">
                <Trophy className="h-3.5 w-3.5 text-[#e5322d]" /> SETTLED · {settled.length}
              </h3>
              {settled.length > 0 && (
                <button
                  onClick={() => clearHistory()}
                  className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-[#ff6b66]"
                >
                  <Trash2 className="h-3 w-3" /> CLEAR
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              {settled.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-lg border px-3 py-2 ${
                    b.status === "won" ? "border-emerald-500/30 bg-emerald-500/5" : "border-[#e5322d]/30 bg-[#e5322d]/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-200">
                      {b.status === "won" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-[#ff6b66]" />
                      )}
                      <span className="num">${b.stake.toFixed(2)}</span> on <span className="font-semibold">{b.bettorName}</span> @ {fmtOdds(b.odds)}
                    </span>
                    <span className={`num text-xs font-bold ${b.status === "won" ? "text-emerald-400" : "text-[#ff6b66]"}`}>
                      {b.status === "won" ? `+$${(b.payout ?? 0).toFixed(2)}` : `−$${b.stake.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-zinc-500">
                    {b.eventLabel} · vs {b.opponentName}
                    {b.methodNote ? ` — ${b.methodNote.split(" — ")[1] ?? b.methodNote}` : ""}
                  </div>
                </div>
              ))}
              {settled.length === 0 && (
                <div className="rounded-lg border border-dashed border-white/10 py-8 text-center">
                  <TrendingUp className="mx-auto h-6 w-6 text-zinc-700" />
                  <p className="mt-2 text-xs text-zinc-600">No settled bets yet — place one and simulate!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
