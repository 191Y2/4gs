"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CHAMPIONS, p4pList, RESULTS_TICKER, EVENTS, ROSTER, getFighter } from "@/lib/data";
import { overallRating, fmtOdds } from "@/lib/engine";
import { useBetStore } from "@/lib/store";
import { useApp } from "./AppContext";
import { FighterAvatar, Flag, RecordText, OvrBadge, DivisionChip } from "./shared";
import { Button } from "@/components/ui/button";
import { Crown, Swords, CalendarDays, TrendingUp, DollarSign, ArrowRight, Zap, Flame } from "lucide-react";

// ---------- countdown ----------
export function Countdown({ date, label }: { date: string; label: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = new Date(`${date}T20:00:00`).getTime();
  const diff = now == null ? null : target - now;
  if (diff == null) {
    return <div className="num font-display text-2xl font-bold text-zinc-700">— : — : —</div>;
  }
  const past = diff < 0;
  const d = Math.floor(Math.abs(diff) / 86400000);
  const h = Math.floor((Math.abs(diff) % 86400000) / 3600000);
  const m = Math.floor((Math.abs(diff) % 3600000) / 60000);
  return (
    <div>
      <div className="num font-display text-2xl font-bold text-white">
        {d > 0 ? `${d}d ` : ""}{String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}
      </div>
      <div className="text-[9px] font-display tracking-widest text-zinc-500 uppercase">
        {past ? "TONIGHT — LIVE" : `UNTIL ${label}`}
      </div>
    </div>
  );
}

// ---------- results ticker ----------
function ResultsTicker() {
  const items = [...RESULTS_TICKER, ...RESULTS_TICKER];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/40 py-2">
      <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap px-4">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="font-display font-bold text-[#ff6b66] num">{t.date}</span>
            <span className="text-zinc-200">{t.headline}</span>
            <span className="text-zinc-600">— {t.detail}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function HomeTab() {
  const { openProfile, setSimSpec, setBetSpec } = useApp();
  const { bankroll } = useBetStore();
  const { mounted } = useApp();
  const menP4P = p4pList("men");
  const womenP4P = p4pList("women");
  const nextEvent = EVENTS[0];
  const mainEventA = getFighter(nextEvent.bouts[0].aId);
  const mainEventB = getFighter(nextEvent.bouts[0].bId);

  return (
    <div className="space-y-8 pb-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 octagon-grid" />
        <div className="absolute inset-x-0 top-0 h-1 red-grad" />
        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-[#e5322d]/50 bg-[#e5322d]/10 px-3 py-1 text-[10px] font-display font-bold tracking-widest text-[#ff6b66]">
              <Flame className="h-3 w-3" /> ROSTER UPDATED OCT 17, 2026
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-display tracking-widest text-zinc-400">
              {ROSTER.length} FIGHTERS · 11 DIVISIONS
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] text-white sm:text-6xl">
            THE OCTAGON<br />
            <span className="champ-gold-text">COMMAND CENTER</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Every champion, every ranking, every fight on record — plus a betting simulator driven by pure Elo
            mathematics. You start with <span className="font-bold text-emerald-400">$100</span>. Make it or lose it.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">BANKROLL</div>
              <div className="num font-display text-2xl font-bold text-emerald-400">
                {mounted ? `$${bankroll.toFixed(2)}` : "$100.00"}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="flex items-center gap-1.5 text-[9px] font-display tracking-[0.2em] text-zinc-500">
                <CalendarDays className="h-3 w-3 text-[#e5322d]" /> NEXT EVENT
              </div>
              <div className="mt-1"><Countdown date={nextEvent.date} label="UFC ED" /></div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">CHAMPIONS</div>
              <div className="num font-display text-2xl font-bold text-[#e0b64c]">{CHAMPIONS.length}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">PPVS ON PARAMOUNT+</div>
              <div className="font-display text-2xl font-bold text-white">2026</div>
            </div>
          </div>

          {/* next event main event */}
          {mainEventA && mainEventB && (
            <div className="mt-5 rounded-xl border border-white/10 bg-gradient-to-r from-black/50 via-black/20 to-black/50 p-4">
              <div className="flex items-center justify-between text-[10px] font-display tracking-[0.2em] text-zinc-500">
                <span>TOMORROW NIGHT · {nextEvent.venue.toUpperCase()}</span>
                <span className="text-[#ff6b66]">PARAMOUNT+</span>
              </div>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <button onClick={() => openProfile(mainEventA.id)} className="flex items-center gap-3 text-left group">
                  <FighterAvatar fighter={mainEventA} size="md" />
                  <div>
                    <div className="font-display text-base font-bold text-white group-hover:text-[#ff6b66]">{mainEventA.name}</div>
                    <div className="text-[11px] text-zinc-500"><RecordText fighter={mainEventA} /></div>
                  </div>
                </button>
                <span className="num font-display text-sm font-bold text-[#e0b64c]">
                  {fmtOdds(nextEvent.bouts[0].oddsA ?? 0)} / {fmtOdds(nextEvent.bouts[0].oddsB ?? 0)}
                </span>
                <button onClick={() => openProfile(mainEventB.id)} className="flex flex-row-reverse items-center gap-3 text-right group">
                  <FighterAvatar fighter={mainEventB} size="md" />
                  <div>
                    <div className="font-display text-base font-bold text-white group-hover:text-[#ff6b66]">{mainEventB.name}</div>
                    <div className="text-[11px] text-zinc-500"><RecordText fighter={mainEventB} /></div>
                  </div>
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setBetSpec({ spec: { aId: mainEventA.id, bId: mainEventB.id, label: nextEvent.name, eventId: nextEvent.id, rounds: 5, houseA: nextEvent.bouts[0].oddsA, houseB: nextEvent.bouts[0].oddsB }, side: "A" })}
                  className="red-grad font-display font-bold tracking-wider text-white"
                >
                  <DollarSign className="mr-1 h-3.5 w-3.5" /> BET {mainEventA.name.split(" ").slice(-1)}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setBetSpec({ spec: { aId: mainEventA.id, bId: mainEventB.id, label: nextEvent.name, eventId: nextEvent.id, rounds: 5, houseA: nextEvent.bouts[0].oddsA, houseB: nextEvent.bouts[0].oddsB }, side: "B" })}
                  className="red-grad font-display font-bold tracking-wider text-white"
                >
                  <DollarSign className="mr-1 h-3.5 w-3.5" /> BET {mainEventB.name.split(" ").slice(-1)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSimSpec({ aId: mainEventA.id, bId: mainEventB.id, label: nextEvent.name, eventId: nextEvent.id, rounds: 5, houseA: nextEvent.bouts[0].oddsA, houseB: nextEvent.bouts[0].oddsB })}
                  className="border-white/15 bg-white/5 font-display font-bold tracking-wider text-zinc-200 hover:bg-white/10"
                >
                  <Zap className="mr-1 h-3.5 w-3.5 text-[#e0b64c]" /> QUICK SIM
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <ResultsTicker />

      {/* CHAMPIONS */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <Crown className="h-5 w-5 text-[#e0b64c]" /> CURRENT CHAMPIONS
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">11 belts · verified Oct 17, 2026 · tap any champ for their full file</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CHAMPIONS.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => openProfile(c.id)}
              className="group relative overflow-hidden rounded-xl border border-[#e0b64c]/20 bg-gradient-to-b from-[#e0b64c]/[0.07] to-transparent p-4 text-left transition-all hover:border-[#e0b64c]/50"
            >
              <div className="flex items-start justify-between">
                <FighterAvatar fighter={c} size="lg" />
                <OvrBadge fighter={c} />
              </div>
              <div className="mt-3">
                <div className="font-display text-lg font-bold leading-tight text-white group-hover:text-[#e0b64c]">
                  {c.name}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <Flag cc={c.cc} className="h-2.5 w-4" />
                  <RecordText fighter={c} />
                </div>
              </div>
              <div className="mt-2.5"><DivisionChip division={c.division} /></div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* P4P */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[
          { title: "MEN'S POUND-FOR-POUND", list: menP4P, icon: <TrendingUp className="h-4 w-4 text-[#e5322d]" /> },
          { title: "WOMEN'S POUND-FOR-POUND", list: womenP4P, icon: <TrendingUp className="h-4 w-4 text-[#ec4899]" /> },
        ].map(({ title, list, icon }) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold tracking-wider text-white">{icon} {title}</h3>
            <div className="mt-3 space-y-1">
              {list.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => openProfile(f.id)}
                  className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/5"
                >
                  <span className="num w-6 text-center font-display text-sm font-bold text-zinc-600">{i + 1}</span>
                  <FighterAvatar fighter={f} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-zinc-200 group-hover:text-white">{f.name}</span>
                    <span className="text-[10px] text-zinc-500">{f.isChampion ? "CHAMPION" : f.rank && f.rank <= 15 ? `#${f.rank}` : "UNRANKED"} · <RecordText fighter={f} /></span>
                  </span>
                  <span className={`num font-display text-lg font-bold ${i === 0 ? "text-[#e0b64c]" : "text-zinc-500"}`}>
                    {overallRating(f)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
