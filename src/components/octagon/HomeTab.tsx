"use client";

import { motion } from "framer-motion";
import { champions, p4pList, ROSTER, HOF_ICONS, LEGENDS, getFighter } from "@/lib/data";
import { overallRating } from "@/lib/engine";
import { Fighter } from "@/lib/types";
import { useBetStore } from "@/lib/store";
import {
  currentSaturday,
  currentWeekEvent,
  eventBouts,
  eventDisplayName,
  hqRankLabel,
  isoOf,
  prettyDate,
  simP4P,
  universeActive,
  universeBouts,
  useUniverseVersion,
} from "@/lib/universe";
import { useApp } from "./AppContext";
import { FighterAvatar, Flag, RecordText, OvrBadge, DivisionChip } from "./shared";
import { Button } from "@/components/ui/button";
import { Crown, CalendarDays, TrendingUp, DollarSign, Flame, Trophy, Radio, Eye, Check } from "lucide-react";

// ---------- results ticker ----------
// real pre-universe results until the first event runs, then the universe
// takes over with its own latest outcomes
function ResultsTicker() {
  const active = universeActive();
  const items = active
    ? universeBouts().slice(-8).reverse().map((b) => {
        const w = getFighter(b.winner === "A" ? b.aId : b.bId);
        const l = getFighter(b.winner === "A" ? b.bId : b.aId);
        const method = b.method === "KO" ? "KO'd" : b.method === "SUB" ? "sub'd" : "out-pointed";
        return {
          headline: w && l ? `${b.evName} · ${w.name} ${method} ${l.name}${b.method === "KO" || b.method === "SUB" ? ` — R${b.round} ${b.time}` : " — UD"}` : "",
          detail: b.title ? "Title fight" : "",
          date: b.date,
        };
      })
    : [
      { headline: "UFC 332 · Natalia Silva def. Wang Cong — UD (49-46, 48-47 x2)", detail: "New Women's Flyweight Champion crowned in Salt Lake City", date: "Oct 3" },
      { headline: "UFC 332 · Payton Talbott KO'd Deiveson Figueiredo — R1 2:09", detail: "Talbott storms into the bantamweight rankings", date: "Oct 3" },
      { headline: "UFC 332 · Esteban Ribovics KO'd King Green — R1 4:08", detail: "Statement win in the lightweight division", date: "Oct 3" },
      { headline: "UFC FN · Brendan Allen sub'd Christian Leroy Duncan — R5 4:52", detail: "Late rear naked choke seals #1 contender push", date: "Oct 10" },
      { headline: "UFC 331 · Ciryl Gane def. Alex Pereira — UD 49-46, 48-47 x2", detail: "Gane claims the undisputed heavyweight crown", date: "Sep 14" },
      { headline: "UFC 331 · Joshua Van KO'd Tatsuro Taira — R2 1:38", detail: "Second title defense for the flyweight king", date: "Sep 12" },
    ];
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/40 py-2">
      <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap px-4">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="font-display font-bold text-[#ff6b66] num">{t.date}</span>
            <span className="text-zinc-200">{t.headline}</span>
            {t.detail && <span className="text-zinc-600">— {t.detail}</span>}
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
  useUniverseVersion(); // crowns, records & universe stats re-render live
  const CHAMPIONS = champions();
  const active = universeActive();
  // universe P4P once events have run (champs + points leaders), real-world
  // seeds before that — both normalize to plain fighter lists
  const menP4P: Fighter[] = active
    ? simP4P("men").map((e) => e.fighter)
    : p4pList("men");
  const womenP4P: Fighter[] = active
    ? simP4P("women").map((e) => e.fighter)
    : p4pList("women");
  const week = currentSaturday();
  const weekEvent = currentWeekEvent();
  const weekName = weekEvent ? eventDisplayName(weekEvent) : null;
  const mainBout = weekEvent ? eventBouts(weekEvent, "main")[0] : undefined;
  const mainEventA = mainBout ? getFighter(mainBout.aId) : null;
  const mainEventB = mainBout ? getFighter(mainBout.bId) : null;
  const hofIcons = [...HOF_ICONS].sort((a, b) => b.elo - a.elo).slice(0, 8);

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
                <CalendarDays className="h-3 w-3 text-[#e5322d]" /> THIS WEEK
              </div>
              <div className="mt-1">
                <div className="num font-display text-2xl font-bold text-white">{prettyDate(isoOf(week))}</div>
                <div className="text-[9px] font-display tracking-widest text-zinc-500 uppercase">
                  {weekEvent ? (weekEvent.completed ? "EVENT COMPLETE" : "EVENT WEEK · SATURDAY") : "NO EVENT — CREATE ONE"}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">CHAMPIONS</div>
              <div className="num font-display text-2xl font-bold text-[#e0b64c]">{CHAMPIONS.length}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">FIGHTERS ON FILE</div>
              <div className="num font-display text-2xl font-bold text-white">{ROSTER.length}</div>
              <div className="text-[9px] text-zinc-600">{LEGENDS.length} legends included — all in their prime</div>
            </div>
          </div>

          {/* this week's universe main event */}
          {mainEventA && mainEventB && mainBout && weekEvent && weekName && !mainBout.result && (
            <div className="mt-5 rounded-xl border border-white/10 bg-gradient-to-r from-black/50 via-black/20 to-black/50 p-4">
              <div className="flex items-center justify-between text-[10px] font-display tracking-[0.2em] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Radio className="h-3 w-3 text-[#e5322d]" /> THIS SATURDAY · {weekEvent.venue.toUpperCase()}
                </span>
                <span className="text-[#ff6b66]">{weekEvent.type === "numbered" ? "PPV MAIN" : "ESPN+"}</span>
              </div>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <button onClick={() => openProfile(mainEventA.id)} className="flex items-center gap-3 text-left group">
                  <FighterAvatar fighter={mainEventA} size="md" />
                  <div>
                    <div className="font-display text-base font-bold text-white group-hover:text-[#ff6b66]">{mainEventA.name}</div>
                    <div className="text-[11px] text-zinc-500"><RecordText fighter={mainEventA} /></div>
                  </div>
                </button>
                <span className="num font-display text-sm font-bold text-[#e0b64c]">{weekName}</span>
                <button onClick={() => openProfile(mainEventB.id)} className="flex flex-row-reverse items-center gap-3 text-right group">
                  <FighterAvatar fighter={mainEventB} size="md" />
                  <div>
                    <div className="font-display text-base font-bold text-white group-hover:text-[#ff6b66]">{mainEventB.name}</div>
                    <div className="text-[11px] text-zinc-500"><RecordText fighter={mainEventB} /></div>
                  </div>
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setSimSpec({ aId: mainEventA.id, bId: mainEventB.id, label: weekName, rounds: mainBout.rounds, source: { eventId: weekEvent.id, boutId: mainBout.id } })}
                  className="red-grad font-display font-bold tracking-wider text-white"
                >
                  <Eye className="mr-1 h-3.5 w-3.5" /> WATCH MAIN EVENT
                </Button>
                <Button
                  size="sm"
                  onClick={() => setBetSpec({ spec: { aId: mainEventA.id, bId: mainEventB.id, label: weekName, rounds: mainBout.rounds }, side: "A" })}
                  className="border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display font-bold tracking-wider text-[#e0b64c] hover:bg-[#e0b64c]/20"
                  variant="outline"
                >
                  <DollarSign className="mr-1 h-3.5 w-3.5" /> BET {mainEventA.name.split(" ").slice(-1)}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setBetSpec({ spec: { aId: mainEventA.id, bId: mainEventB.id, label: weekName, rounds: mainBout.rounds }, side: "B" })}
                  className="border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display font-bold tracking-wider text-[#e0b64c] hover:bg-[#e0b64c]/20"
                  variant="outline"
                >
                  <DollarSign className="mr-1 h-3.5 w-3.5" /> BET {mainEventB.name.split(" ").slice(-1)}
                </Button>
              </div>
            </div>
          )}
          {weekEvent && weekEvent.completed && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
              <span className="text-xs text-zinc-300">
                <Check className="mr-1.5 inline h-3.5 w-3.5 text-emerald-400" />
                <span className="font-display font-bold tracking-wider text-white">{weekName}</span> is in the books — records, rankings & titles updated.
              </span>
            </div>
          )}
          {!weekEvent && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3">
              <span className="text-xs text-zinc-400">
                <CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-[#e5322d]" />
                Fight week of <span className="font-semibold text-zinc-200">{prettyDate(isoOf(week))}</span> — Saturday night is dark. Create an event on the EVENTS tab.
              </span>
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

      {/* HALL OF FAME */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <Trophy className="h-5 w-5 text-[#e0b64c]" /> HALL OF FAME
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {HOF_ICONS.length} icons · prime-era engine ratings · fantasy-book them in the Fight Lab
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {hofIcons.map((f, i) => (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => openProfile(f.id)}
              className="group rounded-xl border border-[#e0b64c]/20 bg-gradient-to-b from-[#e0b64c]/[0.07] to-transparent p-3 text-left transition-all hover:border-[#e0b64c]/50"
            >
              <div className="flex items-center justify-between">
                <FighterAvatar fighter={f} size="md" />
                <span className="num font-display text-lg font-bold text-[#e0b64c]">{overallRating(f)}</span>
              </div>
              <div className="mt-2 truncate font-display text-sm font-bold text-white group-hover:text-[#e0b64c]">{f.name}</div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                <Flag cc={f.cc} className="h-2.5 w-4" />
                <RecordText fighter={f} />
              </div>
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
                    <span className="text-[10px] text-zinc-500">{hqRankLabel(f.id) === "C" ? "CHAMPION" : hqRankLabel(f.id) === "UNRANKED" ? "UNRANKED" : hqRankLabel(f.id)} · <RecordText fighter={f} /></span>
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
