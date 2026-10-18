"use client";

import { useMemo, useState } from "react";
import { Fighter } from "@/lib/types";
import { champions, ROSTER } from "@/lib/data";
import { computeOdds, overallRating, decimalFromAmerican, fmtOdds } from "@/lib/engine";
import { useBetStore } from "@/lib/store";
import { useApp } from "./AppContext";
import { useBeltsVersion } from "@/lib/belts";
import { FighterPickerDialog } from "./FighterPicker";
import { FighterAvatar, Flag, RecordText, AttributeBar, DivisionChip } from "./shared";
import { Button } from "@/components/ui/button";
import { Swords, ArrowLeftRight, Dices, DollarSign, Play, Zap } from "lucide-react";

function LabSlot({
  fighter,
  side,
  onPick,
  onClear,
}: {
  fighter: Fighter | null;
  side: "red" | "blue";
  onPick: () => void;
  onClear: () => void;
}) {
  if (!fighter) {
    return (
      <button
        onClick={onPick}
        className="group flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] transition-colors hover:border-[#e5322d]/50 hover:bg-white/[0.04]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Swords className="h-6 w-6 text-zinc-600 group-hover:text-[#ff6b66]" />
        </div>
        <span className="font-display text-xs font-bold tracking-widest text-zinc-500">
          {side === "red" ? "SELECT RED CORNER" : "SELECT BLUE CORNER"}
        </span>
      </button>
    );
  }
  return (
    <div
      className={`relative flex h-44 w-full flex-col justify-between rounded-xl border p-4 ${
        side === "red" ? "border-[#e5322d]/30 bg-gradient-to-b from-[#e5322d]/10 to-transparent" : "border-sky-500/30 bg-gradient-to-b from-sky-500/10 to-transparent"
      }`}
    >
      <div className="flex items-start justify-between">
        <FighterAvatar fighter={fighter} size="lg" />
        <div className="text-right">
          <div className={`num font-display text-2xl font-bold ${overallRating(fighter) >= 90 ? "text-[#e0b64c]" : "text-white"}`}>
            {overallRating(fighter)}
          </div>
          <div className="text-[9px] font-display tracking-widest text-zinc-500">OVR</div>
        </div>
      </div>
      <div>
        <div className="truncate font-display text-lg font-bold text-white">{fighter.name}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Flag cc={fighter.cc} className="h-2.5 w-4" />
          <RecordText fighter={fighter} />
          <span className="text-zinc-700">·</span>
          <span className="num">{fighter.elo} Elo</span>
        </div>
      </div>
      <div className="flex gap-1.5">
        <Button size="sm" variant="outline" onClick={onPick} className="h-7 border-white/15 bg-black/30 text-[10px] font-bold tracking-wider text-zinc-300 hover:bg-white/10">
          CHANGE
        </Button>
        <Button size="sm" variant="outline" onClick={onClear} className="h-7 border-white/15 bg-black/30 text-[10px] font-bold tracking-wider text-zinc-500 hover:text-white">
          CLEAR
        </Button>
      </div>
    </div>
  );
}

function CompareRow({ label, a, b, higherWins = true }: { label: string; a: number; b: number; higherWins?: boolean }) {
  const aWins = higherWins ? a > b : a < b;
  const total = Math.max(a + b, 1);
  return (
    <div className="flex items-center gap-2">
      <span className={`num w-8 text-right text-xs font-bold ${aWins ? "text-[#ff6b66]" : "text-zinc-500"}`}>{a}</span>
      <div className="flex-1">
        <div className="mb-1 text-center text-[9px] font-display tracking-[0.2em] text-zinc-500">{label}</div>
        <div className="flex h-1.5 overflow-hidden rounded-full">
          <div className="bg-[#e5322d]" style={{ width: `${(a / total) * 100}%` }} />
          <div className="bg-sky-600" style={{ width: `${(b / total) * 100}%` }} />
        </div>
      </div>
      <span className={`num w-8 text-xs font-bold ${!aWins ? "text-sky-400" : "text-zinc-500"}`}>{b}</span>
    </div>
  );
}

export function FightLabTab() {
  useBeltsVersion(); // crown styling stays live when belts move
  const [a, setA] = useState<Fighter | null>(null);
  const [b, setB] = useState<Fighter | null>(null);
  const [picking, setPicking] = useState<null | "A" | "B">(null);
  const { setSimSpec, setBetSpec } = useApp();
  const { bankroll } = useBetStore();

  const odds = useMemo(() => (a && b ? computeOdds(a, b) : null), [a, b]);
  const label = useMemo(() => (a && b ? `Fight Lab: ${a.name} vs ${b.name}` : ""), [a, b]);

  const randomize = () => {
    const pool = ROSTER;
    const ra = pool[Math.floor(Math.random() * pool.length)];
    let rb = pool[Math.floor(Math.random() * pool.length)];
    while (rb.id === ra.id) rb = pool[Math.floor(Math.random() * pool.length)];
    setA(ra);
    setB(rb);
  };

  const superfight = () => {
    const champs = champions();
    const ra = champs[Math.floor(Math.random() * champs.length)];
    let rb = champs[Math.floor(Math.random() * champs.length)];
    while (rb.id === ra.id) rb = champs[Math.floor(Math.random() * champs.length)];
    setA(ra);
    setB(rb);
  };

  const rounds = a && b && (a.isChampion || b.isChampion) ? 5 : 3;

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
          <Zap className="h-5 w-5 text-[#e0b64c]" /> FIGHT LAB
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Book any dream matchup — cross-division superfights allowed. Odds come from Elo math, not overall ratings.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-3 sm:gap-4">
        <LabSlot fighter={a} side="red" onPick={() => setPicking("A")} onClear={() => setA(null)} />
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-display text-xl font-black text-[#e0b64c]">VS</span>
          <button
            onClick={() => {
              const t = a;
              setA(b);
              setB(t);
            }}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 transition-colors hover:text-white"
            title="Swap corners"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>
        <LabSlot fighter={b} side="blue" onPick={() => setPicking("B")} onClear={() => setB(null)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={randomize} className="border-white/15 bg-white/5 font-display font-bold tracking-wider text-zinc-200 hover:bg-white/10">
          <Dices className="mr-1.5 h-3.5 w-3.5" /> RANDOM MATCHUP
        </Button>
        <Button size="sm" variant="outline" onClick={superfight} className="border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display font-bold tracking-wider text-[#e0b64c] hover:bg-[#e0b64c]/20">
          <Swords className="mr-1.5 h-3.5 w-3.5" /> CHAMP vs CHAMP
        </Button>
      </div>

      {a && b && odds && (
        <>
          {/* tale of tape compare */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-bold tracking-wider text-white">TECHNICAL BREAKDOWN</h3>
              <span className="text-[10px] font-display tracking-widest text-zinc-500">{rounds} RDS</span>
            </div>
            <div className="space-y-3">
              <CompareRow label="STRIKING" a={a.str} b={b.str} />
              <CompareRow label="POWER" a={a.pow} b={b.pow} />
              <CompareRow label="WRESTLING" a={a.wr} b={b.wr} />
              <CompareRow label="GRAPPLING" a={a.gr} b={b.gr} />
              <CompareRow label="TD DEFENSE" a={a.tdd} b={b.tdd} />
              <CompareRow label="CHIN" a={a.chin} b={b.chin} />
              <CompareRow label="CARDIO" a={a.cardio} b={b.cardio} />
              <CompareRow label="ENGINE ELO" a={a.elo} b={b.elo} />
            </div>
          </div>

          {/* math panel */}
          <div className="rounded-2xl border border-[#e5322d]/25 bg-gradient-to-b from-[#e5322d]/[0.06] to-transparent p-4">
            <h3 className="font-display text-sm font-bold tracking-wider text-white">THE MATH</h3>
            <p className="mt-1 text-[10px] text-zinc-500">
              P(A) = 1 / (1 + 10^((EloB − EloA) / 400)) — then blended with style attributes. The simulator samples
              winners from this exact distribution, so the lines are fair (house edge = 5% vig only).
            </p>
            <div className="mt-3 flex h-8 overflow-hidden rounded-lg">
              <div
                className="flex items-center justify-start bg-gradient-to-r from-[#e5322d]/80 to-[#e5322d]/50 px-3 font-display text-sm font-bold num text-white"
                style={{ width: `${odds.pA * 100}%` }}
              >
                {(odds.pA * 100).toFixed(1)}%
              </div>
              <div
                className="flex items-center justify-end bg-gradient-to-l from-sky-600/80 to-sky-600/50 px-3 font-display text-sm font-bold num text-white"
                style={{ width: `${odds.pB * 100}%` }}
              >
                {(odds.pB * 100).toFixed(1)}%
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-black/30 py-2">
                <div className="text-[9px] uppercase tracking-widest text-zinc-500">{a.name.split(" ").slice(-1)} LINE</div>
                <div className="num font-display text-xl font-bold text-[#ff6b66]">{fmtOdds(odds.oddsA)}</div>
                <div className="text-[9px] text-zinc-600 num">fair {fmtOdds(odds.fairA)}</div>
              </div>
              <div className="rounded-lg bg-black/30 py-2">
                <div className="text-[9px] uppercase tracking-widest text-zinc-500">DECIMAL</div>
                <div className="num font-display text-xl font-bold text-zinc-200">
                  {decimalFromAmerican(odds.oddsA).toFixed(2)}
                </div>
                <div className="text-[9px] text-zinc-600 num">/ {decimalFromAmerican(odds.oddsB).toFixed(2)}</div>
              </div>
              <div className="rounded-lg bg-black/30 py-2">
                <div className="text-[9px] uppercase tracking-widest text-zinc-500">{b.name.split(" ").slice(-1)} LINE</div>
                <div className="num font-display text-xl font-bold text-emerald-400">{fmtOdds(odds.oddsB)}</div>
                <div className="text-[9px] text-zinc-600 num">fair {fmtOdds(odds.fairB)}</div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              onClick={() => setSimSpec({ aId: a.id, bId: b.id, label, rounds })}
              className="red-grad h-12 font-display text-base font-bold tracking-widest text-white hover:opacity-90"
            >
              <Play className="mr-2 h-5 w-5" /> SIMULATE FIGHT
            </Button>
            <Button
              onClick={() => setBetSpec({ spec: { aId: a.id, bId: b.id, label, rounds }, side: "A" })}
              variant="outline"
              className="h-12 border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display text-sm font-bold tracking-widest text-[#e0b64c] hover:bg-[#e0b64c]/20"
            >
              <DollarSign className="mr-1.5 h-4 w-4" /> BET {a.name.split(" ").slice(-1).join(" ").toUpperCase()} @ {fmtOdds(odds.oddsA)}
            </Button>
            <Button
              onClick={() => setBetSpec({ spec: { aId: a.id, bId: b.id, label, rounds }, side: "B" })}
              variant="outline"
              className="h-12 border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display text-sm font-bold tracking-widest text-[#e0b64c] hover:bg-[#e0b64c]/20"
            >
              <DollarSign className="mr-1.5 h-4 w-4" /> BET {b.name.split(" ").slice(-1).join(" ").toUpperCase()} @ {fmtOdds(odds.oddsB)}
            </Button>
          </div>
          <p className="text-center text-[10px] text-zinc-600">
            Bankroll: <span className="num text-emerald-400">${bankroll.toFixed(2)}</span> — bets settle when you simulate the fight.
          </p>
        </>
      )}

      {(!a || !b) && (
        <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
          <Swords className="mx-auto h-8 w-8 text-zinc-700" />
          <p className="mt-3 font-display text-base text-zinc-500">PICK TWO FIGHTERS TO BOOK A FIGHT</p>
          <p className="mt-1 text-xs text-zinc-600">Any two. Makhachev vs. Gane? Volkanovski vs. Van? Make it happen.</p>
        </div>
      )}

      <FighterPickerDialog
        open={picking !== null}
        onOpenChange={(v) => !v && setPicking(null)}
        title={picking === "A" ? "Red Corner" : "Blue Corner"}
        excludeIds={[a?.id, b?.id].filter(Boolean) as string[]}
        onSelect={(f) => (picking === "A" ? setA(f) : setB(f))}
      />
    </div>
  );
}
