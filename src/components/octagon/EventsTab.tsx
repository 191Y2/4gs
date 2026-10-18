"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EVENTS, getFighter } from "@/lib/data";
import { computeOdds, fmtOdds, simulateFight, resultSummary } from "@/lib/engine";
import { maybeTransferBelt } from "@/lib/belts";
import { recordSimResult } from "@/lib/careers";
import { useBetStore } from "@/lib/store";
import { BoutSpec, useApp } from "./AppContext";
import { FighterAvatar, Flag, RecordText } from "./shared";
import { Button } from "@/components/ui/button";
import { Countdown } from "./HomeTab";
import { MapPin, Tv, DollarSign, Play, Zap, Trophy, Check } from "lucide-react";

function EventBoutRow({ spec, realOdds }: { spec: BoutSpec; realOdds?: boolean }) {
  const a = getFighter(spec.aId)!;
  const b = getFighter(spec.bId)!;
  const { openProfile, setSimSpec, setBetSpec } = useApp();
  const engine = computeOdds(a, b, spec.houseA, spec.houseB);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 transition-colors hover:border-white/15 sm:gap-4 sm:px-4">
      {/* fighter A */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button onClick={() => openProfile(a.id)} className="shrink-0" title={a.name}>
          <FighterAvatar fighter={a} size="sm" />
        </button>
        <div className="min-w-0">
          <button onClick={() => openProfile(a.id)} className="block max-w-full truncate text-left text-sm font-semibold text-zinc-100 hover:text-[#ff6b66]">
            {a.name}
          </button>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <Flag cc={a.cc} className="h-2 w-3.5" />
            <RecordText fighter={a} className="text-zinc-500" />
          </div>
          <button
            onClick={() => setBetSpec({ spec, side: "A" })}
            className="num mt-1 inline-flex items-center gap-1 rounded border border-[#e5322d]/30 bg-[#e5322d]/5 px-1.5 py-px text-[11px] font-bold text-[#ff6b66] hover:bg-[#e5322d]/15"
          >
            <DollarSign className="h-2.5 w-2.5" /> {fmtOdds(spec.houseA ?? engine.oddsA)}
          </button>
        </div>
      </div>

      {/* center */}
      <div className="flex flex-col items-center gap-1 px-1">
        <span className="font-display text-[10px] font-bold text-zinc-600">
          {spec.title ? "TITLE" : `${spec.rounds}R`}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSimSpec(spec)}
          className="h-7 border-white/15 bg-white/5 px-2.5 font-display text-[10px] font-bold tracking-wider text-zinc-200 hover:bg-white/10"
        >
          <Play className="mr-1 h-3 w-3 text-[#e0b64c]" /> SIM
        </Button>
      </div>

      {/* fighter B */}
      <div className="flex flex-row-reverse items-center gap-2.5 sm:gap-3">
        <button onClick={() => openProfile(b.id)} className="shrink-0" title={b.name}>
          <FighterAvatar fighter={b} size="sm" />
        </button>
        <div className="min-w-0 text-right">
          <button onClick={() => openProfile(b.id)} className="block max-w-full truncate text-right text-sm font-semibold text-zinc-100 hover:text-[#ff6b66]">
            {b.name}
          </button>
          <div className="flex flex-row-reverse items-center justify-end gap-1.5 text-[10px] text-zinc-500">
            <Flag cc={b.cc} className="h-2 w-3.5" />
            <RecordText fighter={b} className="text-zinc-500" />
          </div>
          <button
            onClick={() => setBetSpec({ spec, side: "B" })}
            className="num mt-1 inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/5 px-1.5 py-px text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/15"
          >
            <DollarSign className="h-2.5 w-2.5" /> {fmtOdds(spec.houseB ?? engine.oddsB)}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCard({ eventId, index }: { eventId: string; index: number }) {
  const ev = EVENTS.find((e) => e.id === eventId)!;
  const { setSimSpec } = useApp();
  const { bets, settleBet, bankroll } = useBetStore();
  const [fastResults, setFastResults] = useState<{ boutLabel: string; text: string }[] | null>(null);

  const openBets = useMemo(
    () => bets.filter((b) => b.status === "open" && b.eventLabel === ev.name),
    [bets, ev.name]
  );

  const runFastSim = () => {
    const results: { boutLabel: string; text: string }[] = [];
    let wonCount = 0;
    let lostCount = 0;
    let profit = 0;
    for (const bout of ev.bouts) {
      const a = getFighter(bout.aId)!;
      const b = getFighter(bout.bId)!;
      const houseA = bout.oddsA;
      const houseB = bout.oddsB;
      let pA: number | undefined;
      if (houseA != null && houseB != null) {
        const ph = houseA > 0 ? 100 / (houseA + 100) : Math.abs(houseA) / (Math.abs(houseA) + 100);
        const pb = houseB > 0 ? 100 / (houseB + 100) : Math.abs(houseB) / (Math.abs(houseB) + 100);
        pA = ph / (ph + pb);
      }
      const sim = simulateFight(a, b, bout.rounds, pA);
      const winnerId = sim.winner === "A" ? a.id : b.id;
      const note = resultSummary(sim, a, b);
      results.push({
        boutLabel: bout.label ?? `${a.name} vs ${b.name}`,
        text: note,
      });
      // the event played out — careers update with the results
      recordSimResult(a, b, sim, { label: ev.name, title: bout.title });
      // DYNAMIC CHAMPIONSHIPS — simulate a title upset and the belt moves
      const belt = maybeTransferBelt(a, b, sim.winner);
      if (belt) {
        results.push({
          boutLabel: "TITLE CHANGE",
          text: `${belt.newChamp.name} dethrones ${belt.oldChamp.name} — new ${belt.divName} champion!`,
        });
      }
      // settle open bets on this bout
      for (const bet of openBets) {
        if (
          (bet.bettorFighterId === bout.aId && bet.opponentId === bout.bId) ||
          (bet.bettorFighterId === bout.bId && bet.opponentId === bout.aId)
        ) {
          const isWin = bet.bettorFighterId === winnerId;
          const payout = bet.stake * (bet.decOdds - 1);
          settleBet(bet.id, isWin, note, payout);
          if (isWin) {
            wonCount++;
            profit += payout;
          } else {
            lostCount++;
          }
        }
      }
    }
    setFastResults(results);
    if (wonCount + lostCount > 0) {
      const staked = openBets.reduce((s, b) => s + b.stake, 0);
      if (profit > 0) {
        toast.success(`Event settled: +$${profit.toFixed(2)} on ${wonCount}W-${lostCount}L`);
      } else {
        toast.error(`Event settled: −$${(staked - profit).toFixed(2)} on ${wonCount}W-${lostCount}L`);
      }
    } else {
      toast.info("Event simulated — place bets first to ride the card!");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015]"
    >
      {/* header */}
      <div className="relative border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="absolute inset-0 octagon-grid opacity-50" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#e5322d]/15 border border-[#e5322d]/40 px-1.5 py-0.5 text-[9px] font-display font-bold tracking-widest text-[#ff6b66]">
                {ev.broadcaster}
              </span>
              <span className="text-[10px] font-display tracking-widest text-zinc-500 num">{ev.date}</span>
            </div>
            <h3 className="mt-1.5 font-display text-xl font-bold text-white sm:text-2xl">{ev.name}</h3>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ev.venue}, {ev.city}</span>
              <span className="flex items-center gap-1"><Tv className="h-3 w-3" /> {ev.broadcaster}</span>
            </div>
          </div>
          <div className="text-right">
            <Countdown date={ev.date} label={ev.city.toUpperCase()} />
            <div className="num mt-1 text-[10px] text-zinc-500">
              {openBets.length > 0 ? (
                <span className="text-[#e0b64c]">{openBets.length} open bet{openBets.length > 1 ? "s" : ""} on this card</span>
              ) : (
                `bankroll $${bankroll.toFixed(2)}`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* bouts */}
      <div className="space-y-1.5 p-3 sm:p-4">
        {ev.bouts.map((bout) => (
          <div key={`${bout.aId}-${bout.bId}`}>
            {bout.label && (
              <div className={`mb-1 mt-2 px-1 text-[9px] font-display tracking-[0.2em] uppercase ${
                bout.title ? "text-[#e0b64c]" : "text-zinc-600"
              }`}>
                {bout.label}
              </div>
            )}
            <EventBoutRow
              spec={{
                aId: bout.aId,
                bId: bout.bId,
                rounds: bout.rounds,
                label: ev.name,
                eventId: ev.id,
                houseA: bout.oddsA,
                houseB: bout.oddsB,
              }}
              realOdds={bout.oddsA != null}
            />
          </div>
        ))}
      </div>

      {/* fast sim */}
      <div className="border-t border-white/10 bg-black/30 px-4 py-3">
        <Button
          onClick={runFastSim}
          className="w-full border border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display text-sm font-bold tracking-widest text-[#e0b64c] hover:bg-[#e0b64c]/20"
          variant="outline"
        >
          <Zap className="mr-2 h-4 w-4" /> SIMULATE ENTIRE CARD
        </Button>

        {fastResults && (
          <div className="mt-3 space-y-1.5">
            {fastResults.map((r, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e0b64c]" />
                <div>
                  <div className="text-[9px] font-display tracking-widest text-zinc-600 uppercase">{r.boutLabel}</div>
                  <div className="text-xs font-semibold text-zinc-200">{r.text}</div>
                </div>
              </div>
            ))}
            {openBets.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-zinc-300">All open bets on this card have been settled.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}

export function EventsTab() {
  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">UPCOMING CARDS</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Real lines where available (Edmonton odds via sportsbooks). Bet, then simulate the card to cash your slips.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {EVENTS.map((e, i) => (
          <EventCard key={e.id} eventId={e.id} index={i} />
        ))}
      </div>
      <p className="text-center text-[10px] text-zinc-600">
        Cards subject to change. UFC 333 lines are model-generated (Elo engine) until books open.
      </p>
    </div>
  );
}
