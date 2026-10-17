"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getFighter } from "@/lib/data";
import { computeOdds, decimalFromAmerican, fmtOdds, simulateFight, SimResult, resultSummary, probFromAmerican } from "@/lib/engine";
import { useBetStore } from "@/lib/store";
import { BoutSpec, useApp } from "./AppContext";
import { FighterAvatar, Flag, OddsChip, RecordText } from "./shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, DollarSign, Trophy, Calculator, Play, RotateCcw, Check, X } from "lucide-react";

// ---------- odds helpers ----------
export function useBout(spec: BoutSpec | null) {
  return useMemo(() => {
    if (!spec) return null;
    const a = getFighter(spec.aId);
    const b = getFighter(spec.bId);
    if (!a || !b) return null;
    const engine = computeOdds(a, b, spec.houseA, spec.houseB);
    let pA = engine.pA;
    let fromMarket = false;
    if (spec.houseA != null && spec.houseB != null) {
      const ph = probFromAmerican(spec.houseA);
      const pb = probFromAmerican(spec.houseB);
      // de-vig the market — this is what the house line really says
      pA = ph / (ph + pb);
      fromMarket = true;
    }
    return { a, b, engine, pA, fromMarket };
  }, [spec]);
}

// ---------- Bet placement dialog ----------
export function BetDialog() {
  const { betSpec, setBetSpec } = useApp();
  if (!betSpec) {
    return <Dialog open={false} onOpenChange={() => {}}><DialogContent /></Dialog>;
  }
  return (
    <BetDialogInner
      key={`${betSpec.spec.label}-${betSpec.side}`}
      spec={betSpec.spec}
      side={betSpec.side}
      onClose={() => setBetSpec(null)}
    />
  );
}

function BetDialogInner({ spec, side, onClose }: { spec: BoutSpec; side: "A" | "B"; onClose: () => void }) {
  const bout = useBout(spec);
  const { bankroll, placeBet } = useBetStore();
  const [stake, setStake] = useState("10");

  const fighter = side === "A" ? bout?.a : bout?.b;
  const odds = side === "A" ? (bout?.engine.oddsA ?? 0) : (bout?.engine.oddsB ?? 0);
  const dec = decimalFromAmerican(odds);
  const stakeNum = Math.max(0, parseFloat(stake) || 0);
  const profit = stakeNum * (dec - 1);

  if (!bout || !fighter) {
    return <Dialog open={false} onOpenChange={() => {}}><DialogContent /></Dialog>;
  }

  const quickAmounts = [5, 10, 25];
  const canAfford = stakeNum > 0 && stakeNum <= bankroll;

  const confirm = () => {
    if (!canAfford) {
      toast.error(stakeNum <= 0 ? "Enter a stake first" : "Not enough bankroll — reset if you're broke");
      return;
    }
    const ok = placeBet({
      bettorFighterId: fighter.id,
      bettorName: fighter.name,
      opponentId: side === "A" ? bout.b.id : bout.a.id,
      opponentName: side === "A" ? bout.b.name : bout.a.name,
      eventLabel: spec.label,
      stake: stakeNum,
      odds,
      decOdds: dec,
    });
    if (ok) {
      toast.success(`$${stakeNum.toFixed(2)} on ${fighter.name} @ ${fmtOdds(odds)} — to collect $${profit.toFixed(2)}`);
      onClose();
    } else {
      toast.error("Bet rejected — check your bankroll");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(v) => !v && onClose()}>
      <DialogContent aria-describedby={undefined} className="max-w-md rounded-2xl border-white/10 bg-[#101216] p-0 gap-0">
        <DialogTitle className="sr-only">Place bet on {fighter.name}</DialogTitle>
        <div className="h-1 red-grad rounded-t-2xl" />
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 text-[10px] font-display tracking-[0.2em] text-zinc-500 uppercase">
            <DollarSign className="h-3.5 w-3.5 text-[#e0b64c]" /> PLACE YOUR BET · {spec.label.toUpperCase()}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <FighterAvatar fighter={fighter} size="md" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-lg font-bold text-white">{fighter.name}</div>
              <div className="text-xs text-zinc-500">
                <RecordText fighter={fighter} /> vs {side === "A" ? bout.b.name : bout.a.name}
              </div>
            </div>
            <OddsChip odds={odds} side="A" />
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[10px] font-display tracking-[0.15em] text-zinc-500 uppercase">
                <span>Stake</span>
                <span>Bankroll: <span className="num text-emerald-400">${bankroll.toFixed(2)}</span></span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  max={Math.floor(bankroll)}
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="num border-white/15 bg-black/40 text-lg font-bold"
                  placeholder="0"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setStake(String(q))}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold num text-zinc-300 transition-colors hover:border-[#e5322d]/50 hover:text-white"
                  >
                    ${q}
                  </button>
                ))}
                <button
                  onClick={() => setStake(String(Math.max(0, Math.floor(bankroll * 100) / 100)))}
                  className="rounded-md border border-[#e5322d]/40 bg-[#e5322d]/10 px-2.5 py-1 text-xs font-semibold text-[#ff6b66] transition-colors hover:bg-[#e5322d]/20"
                >
                  ALL-IN
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#e0b64c]/30 bg-[#e0b64c]/5 p-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>American line</span>
                <span className="num font-bold text-white">{fmtOdds(odds)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                <span>Decimal</span>
                <span className="num font-bold text-white">{dec.toFixed(2)}</span>
              </div>
              <div className="my-2 h-px bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Pays if he wins</span>
                <span className="num font-display text-xl font-bold text-[#e0b64c]">
                  +${profit.toFixed(2)}
                </span>
              </div>
              <div className="mt-0.5 text-right text-[10px] text-zinc-500 num">
                returns ${(stakeNum + profit).toFixed(2)} total
              </div>
            </div>

            <Button
              onClick={confirm}
              disabled={!canAfford}
              className="w-full red-grad h-11 font-display text-base font-bold tracking-widest text-white hover:opacity-90 disabled:opacity-40"
            >
              <Zap className="mr-2 h-4 w-4" />
              CONFIRM BET
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Simulation dialog ----------
export function FightSimDialog() {
  const { simSpec, setSimSpec, setBetSpec } = useApp();
  const bout = useBout(simSpec);
  const { bets, settleBet, bankroll } = useBetStore();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [sim, setSim] = useState<SimResult | null>(null);
  const [revealed, setRevealed] = useState(0);
  const settledRef = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activeBets = useMemo(() => {
    if (!simSpec) return [];
    return bets.filter(
      (b) =>
        b.status === "open" &&
        b.eventLabel === simSpec.label &&
        ((b.bettorFighterId === simSpec.aId && b.opponentId === simSpec.bId) ||
          (b.bettorFighterId === simSpec.bId && b.opponentId === simSpec.aId))
    );
  }, [bets, simSpec]);

  useEffect(() => {
    setPhase("idle");
    setSim(null);
    setRevealed(0);
    settledRef.current = null;
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [simSpec]);

  // settle matching bets exactly once per simulated result
  useEffect(() => {
    if (phase !== "done" || !sim || !simSpec || !bout) return;
    const key = `${simSpec.label}-${simSpec.aId}-${simSpec.bId}-${sim.round}-${sim.time}-${Date.now()}`;
    if (settledRef.current) return;
    settledRef.current = key;

    const winnerId = sim.winner === "A" ? bout.a.id : bout.b.id;
    const note = resultSummary(sim, bout.a, bout.b);
    let won = 0;
    let lost = 0;
    let profit = 0;
    for (const bet of activeBets) {
      const isWin = bet.bettorFighterId === winnerId;
      const payout = bet.stake * (bet.decOdds - 1);
      settleBet(bet.id, isWin, isWin ? note : note, payout);
      if (isWin) {
        won++;
        profit += payout;
      } else {
        lost++;
      }
    }
    if (won + lost > 0) {
      if (won > 0) {
        toast.success(`Bet cashed! ${won} win${won > 1 ? "s" : ""} · +$${profit.toFixed(2)} profit`);
      } else {
        toast.error(`Bet lost · −$${activeBets.reduce((s, b) => s + b.stake, 0).toFixed(2)}`);
      }
    }
  }, [phase]);

  const runSim = () => {
    if (!bout || !simSpec) return;
    const result = simulateFight(bout.a, bout.b, simSpec.rounds, simSpec.houseA != null ? bout.pA : undefined);
    setSim(result);
    setPhase("running");
    setRevealed(0);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    result.rounds.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setRevealed(i + 1);
          if (i + 1 === result.rounds.length) {
            timers.current.push(setTimeout(() => setPhase("done"), 700));
          }
        }, 800 * (i + 1))
      );
    });
  };

  if (!bout || !simSpec) {
    return <Dialog open={false} onOpenChange={() => {}}><DialogContent /></Dialog>;
  }

  const { a, b, engine, pA, fromMarket } = bout;
  const winner = sim?.winner === "A" ? a : sim?.winner === "B" ? b : null;
  const loser = sim?.winner === "A" ? b : sim?.winner === "B" ? a : null;

  return (
    <Dialog open={true} onOpenChange={(v) => !v && setSimSpec(null)}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[92vh] overflow-y-auto thin-scroll rounded-2xl border-white/10 bg-[#101216] p-0 gap-0">
        <DialogTitle className="sr-only">Fight simulation {a.name} vs {b.name}</DialogTitle>
        <div className="h-1 red-grad rounded-t-2xl" />
        <div className="px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-display tracking-[0.2em] text-zinc-500 uppercase">
              FIGHT SIMULATION · {simSpec.label.toUpperCase()}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5322d] live-dot" />
              <span className="text-[10px] font-display tracking-widest text-zinc-500">{simSpec.rounds} RDS</span>
            </div>
          </div>

          {/* Tale of tape header */}
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
            <button onClick={() => setSimSpec(null)} className="group flex items-center gap-3 text-left" title="View profile">
              <FighterAvatar fighter={a} size="lg" />
              <div className="min-w-0">
                <div className="truncate font-display text-lg font-bold text-white group-hover:text-[#ff6b66]">{a.name}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <Flag cc={a.cc} className="h-3 w-4" /> <RecordText fighter={a} />
                </div>
              </div>
            </button>
            <div className="flex flex-col items-center">
              <div className="font-display text-2xl font-black text-[#e0b64c]">VS</div>
              <OddsChip odds={engine.oddsA} side="A" />
            </div>
            <button onClick={() => setSimSpec(null)} className="group flex flex-row-reverse items-center gap-3 text-right" title="View profile">
              <FighterAvatar fighter={b} size="lg" />
              <div className="min-w-0">
                <div className="truncate font-display text-lg font-bold text-white group-hover:text-[#ff6b66]">{b.name}</div>
                <div className="flex flex-row-reverse items-center justify-end gap-1.5 text-[11px] text-zinc-500">
                  <Flag cc={b.cc} className="h-3 w-4" /> <RecordText fighter={b} />
                </div>
              </div>
            </button>
          </div>

          {/* Math panel */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center gap-1.5 text-[9px] font-display tracking-[0.2em] text-zinc-500 uppercase">
              <Calculator className="h-3 w-3 text-[#e5322d]" /> THE MATH — ELO PROBABILITY MODEL
            </div>
            <div className="mt-2.5">
              <div className="flex h-6 overflow-hidden rounded-md">
                <div
                  className="flex items-center justify-start bg-gradient-to-r from-[#e5322d]/70 to-[#e5322d]/50 px-2 text-[10px] font-bold num text-white"
                  style={{ width: `${pA * 100}%` }}
                >
                  {(pA * 100).toFixed(0)}%
                </div>
                <div
                  className="flex items-center justify-end bg-gradient-to-l from-sky-600/70 to-sky-600/50 px-2 text-[10px] font-bold num text-white"
                  style={{ width: `${(1 - pA) * 100}%` }}
                >
                  {((1 - pA) * 100).toFixed(0)}%
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500">Elo {a.name.split(" ").slice(-1)}</div>
                  <div className="num text-sm font-bold text-zinc-200">{a.elo}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500">Fair line</div>
                  <div className="num text-sm font-bold text-zinc-200">
                    {fmtOdds(engine.fairA)} / {fmtOdds(engine.fairB)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500">Elo {b.name.split(" ").slice(-1)}</div>
                  <div className="num text-sm font-bold text-zinc-200">{b.elo}</div>
                </div>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
                {fromMarket
                  ? "Probability de-vigged from the real sportsbook line; simulation outcomes are drawn from this distribution."
                  : "P(A) = 1 / (1 + 10^((EloB − EloA)/400)) blended with style attributes. Outcomes are sampled from this exact distribution — the odds are math, not vibes."}
              </p>
            </div>
          </div>

          {/* Active bets */}
          {activeBets.length > 0 && phase === "idle" && (
            <div className="mt-3 space-y-1.5">
              {activeBets.map((bet) => (
                <div key={bet.id} className="flex items-center justify-between rounded-lg border border-[#e0b64c]/30 bg-[#e0b64c]/5 px-3 py-2">
                  <span className="text-xs text-zinc-300">
                    <DollarSign className="mr-1 inline h-3 w-3 text-[#e0b64c]" />
                    <span className="num font-bold">${bet.stake.toFixed(2)}</span> on <span className="font-semibold text-white">{bet.bettorName}</span> @ {fmtOdds(bet.odds)}
                  </span>
                  <span className="num text-xs font-bold text-[#e0b64c]">
                    to win ${(bet.stake * (bet.decOdds - 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Round-by-round */}
          {sim && (
            <div className="mt-4 space-y-2">
              {sim.rounds.slice(0, revealed).map((r) => (
                <div
                  key={r.round}
                  className={`rounded-lg border px-3 py-2.5 transition-colors ${
                    r.finish
                      ? "border-[#e5322d]/60 bg-[#e5322d]/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold tracking-widest text-zinc-300">ROUND {r.round}</span>
                    <span className="text-[10px] num text-zinc-500">
                      sig strikes: {r.aLanded} — {r.bLanded}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-300">{r.text}</p>
                </div>
              ))}
              {phase === "running" && revealed < sim.rounds.length && (
                <div className="flex items-center justify-center gap-1.5 py-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#e5322d]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#e5322d] [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#e5322d] [animation-delay:300ms]" />
                </div>
              )}
            </div>
          )}

          {/* Result card */}
          {phase === "done" && sim && winner && loser && (
            <div className={`mt-4 rounded-xl border p-4 ${sim.winner === "A" || sim.winner === "B" ? "border-emerald-500/40 bg-emerald-500/5" : ""}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  sim.winner === "A" || sim.winner === "B" ? "border-emerald-400 bg-emerald-500/20 text-emerald-400" : "border-zinc-500"
                }`}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">OFFICIAL RESULT</div>
                  <div className="truncate font-display text-lg font-bold text-white">
                    {winner.name} <span className="text-zinc-400">def.</span> {loser.name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {sim.method === "KO" ? `KO/TKO (${sim.detail})` : sim.method === "SUB" ? `Submission (${sim.detail})` : sim.method === "UDEC" ? "Unanimous Decision" : sim.method === "SDEC" ? "Split Decision" : "Majority Decision"}
                    {sim.method !== "KO" && sim.method !== "SUB" ? "" : ` — R${sim.round} ${sim.time}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">SIG STRIKES</div>
                  <div className="num text-sm font-bold text-zinc-200">{sim.sigStrikesA} — {sim.sigStrikesB}</div>
                </div>
              </div>
              {sim.scorecards && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {sim.scorecards.map((card, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-black/30 py-1.5 text-center">
                      <div className="text-[9px] text-zinc-500">JUDGE {i + 1}</div>
                      <div className="num text-sm font-bold text-zinc-200">{card[0]}–{card[1]}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeBets.length > 0 && (
                <div className="mt-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs">
                  {activeBets.map((bet) => {
                    const won = bet.bettorFighterId === winner.id;
                    const profit = won ? bet.stake * (bet.decOdds - 1) : -bet.stake;
                    return (
                      <div key={bet.id} className="flex items-center justify-between py-0.5">
                        <span className="text-zinc-400">
                          {won ? <Check className="mr-1 inline h-3 w-3 text-emerald-400" /> : <X className="mr-1 inline h-3 w-3 text-[#ff6b66]" />}
                          {bet.bettorName} · ${bet.stake.toFixed(2)} @ {fmtOdds(bet.odds)}
                        </span>
                        <span className={`num font-bold ${won ? "text-emerald-400" : "text-[#ff6b66]"}`}>
                          {won ? `+$${profit.toFixed(2)}` : `−$${Math.abs(profit).toFixed(2)}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {phase === "idle" && (
              <Button
                onClick={runSim}
                className="red-grad h-12 flex-1 font-display text-base font-bold tracking-widest text-white hover:opacity-90"
              >
                <Play className="mr-2 h-5 w-5" />
                RUN SIMULATION
              </Button>
            )}
            {phase !== "idle" && (
              <Button
                onClick={runSim}
                variant="outline"
                className="h-12 flex-1 border-white/15 bg-white/5 font-display text-sm font-bold tracking-widest text-zinc-200 hover:bg-white/10"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                RUN IT BACK
              </Button>
            )}
            {activeBets.length === 0 && phase === "idle" && (
              <Button
                onClick={() => {
                  setBetSpec({ spec: simSpec, side: "A" });
                }}
                variant="outline"
                className="h-12 border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display text-sm font-bold tracking-widest text-[#e0b64c] hover:bg-[#e0b64c]/20 sm:w-40"
              >
                BET {a.name.split(" ").slice(-1).join(" ").toUpperCase()}
              </Button>
            )}
            {activeBets.length === 0 && phase === "idle" && (
              <Button
                onClick={() => {
                  setBetSpec({ spec: simSpec, side: "B" });
                }}
                variant="outline"
                className="h-12 border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display text-sm font-bold tracking-widest text-[#e0b64c] hover:bg-[#e0b64c]/20 sm:w-40"
              >
                BET {b.name.split(" ").slice(-1).join(" ").toUpperCase()}
              </Button>
            )}
          </div>

          {phase === "idle" && activeBets.length > 0 && (
            <p className="mt-2 text-center text-[10px] text-zinc-500">
              Your bet is live — run the simulation to settle it. Bankroll: <span className="num text-emerald-400">${bankroll.toFixed(2)}</span>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
