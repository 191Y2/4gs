"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getFighter, DIVISION_MAP } from "@/lib/data";
import { computeOdds, fmtOdds, overallRating, simulateFight, resultSummary, SimResult } from "@/lib/engine";
import { useBetStore } from "@/lib/store";
import { Fighter, SimEvent, SimEventBout, EventSection } from "@/lib/types";
import {
  addBout,
  autoEventType,
  boutSectionLabel,
  createEvent,
  currentSaturday,
  currentWeekEvent,
  eventBouts,
  eventDisplayName,
  eventTagline,
  events,
  effectiveRounds,
  hqRankLabel,
  isoOf,
  isTitleBout,
  moveBout,
  nextEventNumber,
  nextFightNightNumber,
  numberedAvailableThisMonth,
  pastEvents,
  prettyDate,
  recordEventBout,
  removeBout,
  scrapEvent,
  shortDate,
  simRecord,
  upcomingWeeks,
  useUniverseVersion,
} from "@/lib/universe";
import { BoutSpec, useApp } from "./AppContext";
import { FighterPickerDialog } from "./FighterPicker";
import { FighterAvatar, RecordText, OddsChip } from "./shared";
import { isSuperfight, champDivisions } from "@/lib/belts";
import { Button } from "@/components/ui/button";
import {
  CalendarDays, Plus, Play, Eye, ChevronUp, ChevronDown, X, Crown,
  Tv, Dices, MapPin, Radio, Check, Trophy, Copy,
} from "lucide-react";

// ---------- helpers ----------
function fmtSimRecord(f: Fighter): string {
  const s = simRecord(f);
  return `${s.w}-${s.l}-${s.d}`;
}

// ---------- OCTAGONHQ rank tag shown next to names on cards ----------
function RankTag({ fighterId }: { fighterId: string }) {
  const label = hqRankLabel(fighterId);
  if (label === "C") {
    return (
      <span className="inline-flex shrink-0 items-center gap-0.5 rounded border border-[#e0b64c]/60 bg-[#e0b64c]/15 px-1 py-px text-[9px] font-display font-bold tracking-widest text-[#e0b64c]">
        <Crown className="h-2.5 w-2.5" />C
      </span>
    );
  }
  if (label === "UNRANKED") {
    return (
      <span className="inline-flex shrink-0 items-center rounded border border-white/10 bg-white/[0.03] px-1 py-px text-[9px] font-display tracking-widest text-zinc-500">
        UNRANKED
      </span>
    );
  }
  return (
    <span className="num inline-flex shrink-0 items-center rounded border border-white/15 bg-white/5 px-1 py-px text-[9px] font-bold text-zinc-300">
      {label}
    </span>
  );
}

// ---------- COPY CARD: full card as clean text (for ChatGPT etc.) ----------
function fighterLine(f: Fighter): string {
  const s = simRecord(f);
  const rank = hqRankLabel(f.id);
  const div = DIVISION_MAP[f.division];
  const rankTxt = rank === "C" ? `${div.shortName} CHAMP` : rank === "UNRANKED" ? "unranked" : `${rank} ${div.shortName}`;
  return `${f.name} — ${rankTxt} · ${s.w}-${s.l}-${s.d} HQ · ${f.w}-${f.l}-${f.d} real · ${overallRating(f)} OVR`;
}

function resultLine(bout: SimEventBout): string {
  const r = bout.result!;
  const a = getFighter(bout.aId)!;
  const b = getFighter(bout.bId)!;
  if (r.winner === "DRAW" || r.winner === "NC") {
    return `Result: ${r.winner === "DRAW" ? "Draw" : "No Contest"} (${methodText(r)})`;
  }
  const w = r.winner === "A" ? a : b;
  return `Result: ${w.name} def. ${(r.winner === "A" ? b : a).name} — ${methodText(r)}`;
}

function cardToText(ev: SimEvent): string {
  const name = eventDisplayName(ev);
  const tagline = eventTagline(ev);
  const lines: string[] = [];
  lines.push(`🥊 ${name}${tagline ? ` · ${tagline}` : ""}`);
  lines.push(`${prettyDate(ev.dateISO)} · ${ev.venue}, ${ev.city} · ${ev.type === "numbered" ? "PPV" : "ESPN+"}`);
  lines.push(`OCTAGONHQ universe card — HQ ranks & records are in-universe (everyone started 0-0); real UFC records for context`);
  const sections: [EventSection, string][] = [
    ["main", "MAIN CARD"],
    ["prelim", "PRELIMS"],
    ["early", "EARLY PRELIMS"],
  ];
  let n = 0;
  for (const [sec, label] of sections) {
    const bouts = eventBouts(ev, sec);
    if (!bouts.length) continue;
    lines.push("");
    lines.push(`${label}`);
    for (const bout of bouts) {
      n++;
      const a = getFighter(bout.aId)!;
      const b = getFighter(bout.bId)!;
      if (!a || !b) continue;
      const div = DIVISION_MAP[a.division];
      const odds = computeOdds(a, b);
      const tags: string[] = [];
      if (isSuperfight(a, b)) {
        const beltsA = champDivisions(a);
        const beltsB = champDivisions(b);
        tags.push(`SUPERFIGHT · ${[...beltsA, ...beltsB].map((d) => DIVISION_MAP[d].shortName).join(" & ")} TITLES`);
      } else if (bout.title) {
        tags.push(`${div.name.toUpperCase()} TITLE`);
      }
      if (bout.rounds === 5 && !bout.title) tags.push("5 RDS");
      const head = `#${n}. ${tags.length ? `[${tags.join(" · ")}] ` : ""}${a.name} vs ${b.name}`;
      lines.push(head);
      lines.push(`   ${fighterLine(a)} · odds ${fmtOdds(odds.oddsA)}`);
      lines.push(`   ${fighterLine(b)} · odds ${fmtOdds(odds.oddsB)}`);
      if (bout.result) lines.push(`   ✅ ${resultLine(bout)}`);
    }
  }
  if (n === 0) lines.push("", "(no bouts booked yet)");
  return lines.join("\n");
}

async function copyCard(ev: SimEvent) {
  const text = cardToText(ev);
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Card copied as text — paste it into ChatGPT or anywhere");
  } catch {
    // clipboard API fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Card copied as text — paste it into ChatGPT or anywhere");
    } catch {
      toast.error("Couldn't copy — clipboard blocked by the browser");
    }
  }
}

function methodText(res: NonNullable<SimEventBout["result"]>): string {
  const base =
    res.method === "KO" ? `KO/TKO${res.detail ? ` (${res.detail})` : ""}` :
    res.method === "SUB" ? `SUB${res.detail ? ` (${res.detail})` : ""}` :
    res.method === "UDEC" ? "Unanimous Dec" :
    res.method === "SDEC" ? "Split Dec" :
    res.method === "MDEC" ? "Majority Dec" : "DQ";
  return res.method === "KO" || res.method === "SUB" ? `${base} · R${res.round} ${res.time}` : base;
}

// current + legacy display names — bets placed before a Fight Night got its
// number still settle under the name they were placed with
function eventSettleLabels(ev: SimEvent): string[] {
  const name = eventDisplayName(ev);
  return ev.legacyName && ev.legacyName !== name ? [name, ev.legacyName] : [name];
}

// settle any open wallet bets that target this pair under this event
function settleBetsForBout(aId: string, bId: string, labels: string[], sim: SimResult) {
  const a = getFighter(aId);
  const b = getFighter(bId);
  if (!a || !b) return { won: 0, lost: 0, staked: 0 };
  const note = resultSummary(sim, a, b);
  const winnerId = sim.winner === "A" ? aId : sim.winner === "B" ? bId : "";
  let won = 0;
  let lost = 0;
  let staked = 0;
  for (const bet of useBetStore.getState().bets) {
    if (bet.status !== "open" || !labels.includes(bet.eventLabel)) continue;
    if (
      !((bet.bettorFighterId === aId && bet.opponentId === bId) ||
        (bet.bettorFighterId === bId && bet.opponentId === aId))
    ) continue;
    const isWin = bet.bettorFighterId === winnerId;
    const payout = bet.stake * (bet.decOdds - 1);
    useBetStore.getState().settleBet(bet.id, isWin, note, payout);
    if (isWin) {
      won++;
    } else {
      lost++;
      staked += bet.stake;
    }
  }
  return { won, lost, staked };
}

// ---------- bout builder dialog ----------
function BoutBuilder({
  eventId,
  section,
  excludeIds,
  onDone,
}: {
  eventId: string;
  section: EventSection;
  excludeIds: string[];
  onDone: () => void;
}) {
  const [picking, setPicking] = useState<null | "A" | "B">(null);
  const [a, setA] = useState<Fighter | null>(null);
  const [b, setB] = useState<Fighter | null>(null);

  const add = () => {
    if (!a || !b) return;
    const ok = addBout(eventId, a.id, b.id, section);
    if (ok) {
      toast.success(`${a.name} vs ${b.name} added to ${section === "main" ? "the main card" : section === "prelim" ? "prelims" : "early prelims"}`);
      onDone();
    } else {
      toast.error("Those fighters are already booked on this card");
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <button
          onClick={() => setPicking("A")}
          className={`flex h-28 w-full flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center transition-colors ${
            a ? "border-[#e5322d]/40 bg-[#e5322d]/10" : "border-dashed border-white/15 bg-white/[0.02] hover:border-[#e5322d]/50"
          }`}
        >
          {a ? (
            <>
              <span className="flex min-w-0 items-center justify-center gap-1.5">
                <RankTag fighterId={a.id} />
                <span className="truncate font-display text-sm font-bold text-white">{a.name}</span>
              </span>
              <span className="text-[10px] text-zinc-500">
                {fmtSimRecord(a)} HQ · <RecordText fighter={a} /> real
              </span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-zinc-600" />
              <span className="text-[10px] font-display tracking-widest text-zinc-500">RED CORNER</span>
            </>
          )}
        </button>
        <span className="font-display text-lg font-black text-[#e0b64c]">VS</span>
        <button
          onClick={() => setPicking("B")}
          className={`flex h-28 w-full flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center transition-colors ${
            b ? "border-sky-500/40 bg-sky-500/10" : "border-dashed border-white/15 bg-white/[0.02] hover:border-sky-500/50"
          }`}
        >
          {b ? (
            <>
              <span className="flex min-w-0 items-center justify-center gap-1.5">
                <RankTag fighterId={b.id} />
                <span className="truncate font-display text-sm font-bold text-white">{b.name}</span>
              </span>
              <span className="text-[10px] text-zinc-500">
                {fmtSimRecord(b)} HQ · <RecordText fighter={b} /> real
              </span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-zinc-600" />
              <span className="text-[10px] font-display tracking-widest text-zinc-500">BLUE CORNER</span>
            </>
          )}
        </button>
      </div>

      {a && b && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[11px] text-zinc-400">
          {isSuperfight(a, b) ? (
            <span className="font-display font-bold tracking-widest text-[#e0b64c]">
              <Crown className="mr-1 inline h-3 w-3" /> CHAMPIONSHIP SUPERFIGHT — ALL TITLES ON THE LINE — 5 ROUNDS
            </span>
          ) : isTitleBout(a, b) ? (
            <span className="font-display font-bold tracking-widest text-[#e0b64c]">
              <Crown className="mr-1 inline h-3 w-3" /> CHAMPIONSHIP BOUT — 5 ROUNDS
            </span>
          ) : (
            <span>3 rounds · {fmtOdds(computeOdds(a, b).oddsA)} / {fmtOdds(computeOdds(a, b).oddsB)}</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={add} disabled={!a || !b} className="red-grad flex-1 font-display font-bold tracking-widest text-white hover:opacity-90 disabled:opacity-40">
          <Plus className="mr-1.5 h-4 w-4" /> ADD BOUT
        </Button>
        <Button onClick={onDone} variant="outline" className="border-white/15 bg-white/5 font-display font-bold tracking-widest text-zinc-300 hover:bg-white/10">
          CANCEL
        </Button>
      </div>

      <FighterPickerDialog
        open={picking !== null}
        onOpenChange={(v) => !v && setPicking(null)}
        title={picking === "A" ? "Red Corner" : "Blue Corner"}
        excludeIds={[...excludeIds, picking === "A" ? b?.id : a?.id].filter(Boolean) as string[]}
        onSelect={(f) => {
          if (picking === "A") setA(f);
          else setB(f);
          setPicking(null);
        }}
      />
    </div>
  );
}

// ---------- one bout row ----------
function BoutRow({ ev, bout, index }: { ev: SimEvent; bout: SimEventBout; index: number }) {
  const { openProfile, setSimSpec, setBetSpec } = useApp();
  const a = getFighter(bout.aId)!;
  const b = getFighter(bout.bId)!;
  if (!a || !b) return null;
  const odds = computeOdds(a, b);
  const label = eventDisplayName(ev);
  const fought = !!bout.result;
  const winner = bout.result?.winner === "A" ? a : bout.result?.winner === "B" ? b : null;
  const loser = bout.result?.winner === "A" ? b : bout.result?.winner === "B" ? a : null;
  const isTitle = bout.title || isTitleBout(a, b);
  const superfight = isSuperfight(a, b);
  const sectionList = eventBouts(ev, bout.section);

  const quickSim = () => {
    const sim = simulateFight(a, b, effectiveRounds(bout, a, b));
    const outcome = recordEventBout(ev.id, bout.id, sim);
    if (outcome) {
      toast.success(outcome.note);
      for (const belt of outcome.belts) {
        toast.success(
          `NEW CHAMPION! ${belt.newChamp.name} dethrones ${belt.oldChamp.name} — the ${belt.divName} belt changes hands!`,
          { duration: 7000 }
        );
      }
      settleBetsForBout(a.id, b.id, eventSettleLabels(ev), sim);
    }
  };

  const spec: BoutSpec = {
    aId: a.id,
    bId: b.id,
    label,
    rounds: effectiveRounds(bout, a, b),
    source: { eventId: ev.id, boutId: bout.id },
    title: superfight ? "Superfight — All Titles" : isTitle ? "Championship Bout" : undefined,
  };

  return (
    <div className={`rounded-xl border px-3 py-3 transition-colors ${
      fought
        ? "border-white/5 bg-white/[0.015] opacity-80"
        : isTitle
          ? "border-[#e0b64c]/30 bg-gradient-to-r from-[#e0b64c]/[0.06] to-transparent"
          : "border-white/10 bg-white/[0.02]"
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="num font-display text-[10px] font-bold text-zinc-600">{index + 1}</span>
          <span className={`text-[9px] font-display tracking-[0.2em] ${
            fought ? "text-zinc-600" : "text-zinc-400"
          }`}>
            {boutSectionLabel(ev, bout)}
          </span>
          {superfight && (
            <span className="inline-flex items-center gap-1 rounded border border-[#e0b64c]/70 bg-gradient-to-r from-[#e0b64c]/25 to-[#e0b64c]/5 px-1.5 py-px text-[9px] font-display font-bold tracking-widest text-[#e0b64c]">
              <Crown className="h-2.5 w-2.5" /> SUPERFIGHT · ALL TITLES
            </span>
          )}
          {isTitle && !superfight && (
            <span className="inline-flex items-center gap-1 rounded border border-[#e0b64c]/50 bg-[#e0b64c]/10 px-1.5 py-px text-[9px] font-display tracking-widest text-[#e0b64c]">
              <Crown className="h-2.5 w-2.5" /> TITLE
            </span>
          )}
          {bout.rounds === 5 && !isTitle && (
            <span className="rounded border border-white/15 bg-white/5 px-1.5 py-px text-[9px] font-display tracking-widest text-zinc-400">5 RDS</span>
          )}
        </div>
        {!fought && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => moveBout(ev.id, bout.id, -1)}
              disabled={index === 0 || !!sectionList[index - 1]?.result}
              className="rounded p-1 text-zinc-500 transition-colors hover:text-white disabled:opacity-20"
              title="Move up"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => moveBout(ev.id, bout.id, 1)}
              disabled={index === sectionList.length - 1 || !!sectionList[index + 1]?.result}
              className="rounded p-1 text-zinc-500 transition-colors hover:text-white disabled:opacity-20"
              title="Move down"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => removeBout(ev.id, bout.id)}
              className="rounded p-1 text-zinc-500 transition-colors hover:text-[#ff6b66]"
              title="Remove bout"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <button onClick={() => openProfile(a.id)} className="group flex min-w-0 items-center gap-2 text-left">
          <FighterAvatar fighter={a} size="sm" />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <RankTag fighterId={a.id} />
              <span className={`truncate text-sm font-semibold group-hover:text-[#ff6b66] ${fought && winner === a ? "text-emerald-400" : "text-zinc-100"}`}>
                {a.name}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500">
              <span className="num font-bold text-[#e0b64c]">{fmtSimRecord(a)}</span> HQ · <RecordText fighter={a} />
            </div>
          </div>
        </button>
        <div className="flex flex-col items-center gap-0.5">
          {fought && bout.result ? (
            <span className="num text-[10px] font-bold text-zinc-500">{bout.result.method === "KO" || bout.result.method === "SUB" ? `R${bout.result.round}` : "DEC"}</span>
          ) : (
            <OddsChip odds={odds.oddsA} side="A" />
          )}
          <span className="font-display text-[10px] font-black text-zinc-600">VS</span>
          {fought && bout.result ? (
            <span className="num text-[10px] font-bold text-zinc-500">{bout.result.method === "KO" || bout.result.method === "SUB" ? bout.result.time : "29-28"}</span>
          ) : (
            <OddsChip odds={odds.oddsB} side="B" />
          )}
        </div>
        <button onClick={() => openProfile(b.id)} className="group flex min-w-0 flex-row-reverse items-center gap-2 text-right">
          <FighterAvatar fighter={b} size="sm" />
          <div className="min-w-0">
            <div className="flex min-w-0 flex-row-reverse items-center justify-end gap-1.5">
              <RankTag fighterId={b.id} />
              <span className={`truncate text-sm font-semibold group-hover:text-[#ff6b66] ${fought && winner === b ? "text-emerald-400" : "text-zinc-100"}`}>
                {b.name}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500">
              <span className="num font-bold text-[#e0b64c]">{fmtSimRecord(b)}</span> HQ · <RecordText fighter={b} />
            </div>
          </div>
        </button>
      </div>

      {fought && bout.result && winner && loser ? (
        <div className="mt-2 flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-1.5">
          <span className="text-[11px] text-zinc-400">
            <Check className="mr-1 inline h-3 w-3 text-emerald-400" />
            <span className="font-semibold text-zinc-200">{winner.name}</span> def. {loser.name}
          </span>
          <span className="text-[10px] text-zinc-500">{methodText(bout.result)}</span>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button
            size="sm"
            onClick={() => setSimSpec(spec)}
            className="red-grad h-8 font-display text-[10px] font-bold tracking-widest text-white hover:opacity-90"
          >
            <Eye className="mr-1 h-3 w-3" /> WATCH LIVE
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={quickSim}
            className="h-8 border-white/15 bg-white/5 font-display text-[10px] font-bold tracking-widest text-zinc-300 hover:bg-white/10"
          >
            <Play className="mr-1 h-3 w-3" /> QUICK SIM
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBetSpec({ spec, side: "A" })}
            className="h-8 border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display text-[10px] font-bold tracking-widest text-[#e0b64c] hover:bg-[#e0b64c]/20"
          >
            ${fmtOdds(odds.oddsA)}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBetSpec({ spec, side: "B" })}
            className="h-8 border-[#e0b64c]/40 bg-[#e0b64c]/10 font-display text-[10px] font-bold tracking-widest text-[#e0b64c] hover:bg-[#e0b64c]/20"
          >
            ${fmtOdds(odds.oddsB)}
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------- event card ----------
function SectionBlock({ ev, section }: { ev: SimEvent; section: EventSection }) {
  const [building, setBuilding] = useState(false);
  const bouts = eventBouts(ev, section);
  const title = section === "main" ? "MAIN CARD" : section === "prelim" ? "PRELIMS" : "EARLY PRELIMS";
  const subtitle =
    section === "main" ? "Top bout = main event · second = co-main" : section === "prelim" ? "Fueling the PPV warm-up" : "First through the curtain";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h4 className="font-display text-xs font-bold tracking-[0.2em] text-zinc-300">{title}</h4>
          <p className="text-[9px] text-zinc-600">{subtitle}</p>
        </div>
        {!ev.completed && (
          <button
            onClick={() => setBuilding(true)}
            className="flex items-center gap-1 rounded-lg border border-dashed border-white/20 bg-white/[0.02] px-2.5 py-1 text-[10px] font-display font-bold tracking-widest text-zinc-400 transition-colors hover:border-[#e5322d]/50 hover:text-white"
          >
            <Plus className="h-3 w-3" /> ADD BOUT
          </button>
        )}
      </div>

      {building && (
        <div className="mb-3 rounded-xl border border-white/10 bg-black/40 p-3">
          <BoutBuilder
            eventId={ev.id}
            section={section}
            excludeIds={ev.bouts.flatMap((b) => [b.aId, b.bId])}
            onDone={() => setBuilding(false)}
          />
        </div>
      )}

      <div className="space-y-2">
        {bouts.map((bout, i) => (
          <BoutRow key={bout.id} ev={ev} bout={bout} index={i} />
        ))}
        {bouts.length === 0 && !building && (
          <div className="rounded-xl border border-dashed border-white/10 py-5 text-center">
            <p className="text-[10px] font-display tracking-widest text-zinc-600">NO BOUTS YET</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ ev }: { ev: SimEvent }) {
  const { setSimSpec } = useApp();
  const { bets } = useBetStore();
  const name = eventDisplayName(ev);
  const tagline = eventTagline(ev);
  const pending = ev.bouts.filter((b) => !b.result);
  const openBetsCount = bets.filter(
    (b) => b.status === "open" && b.eventLabel === name
  ).length;

  const runFullCard = () => {
    if (pending.length === 0) return;
    // broadcast order: early prelims → prelims → main card
    const order: EventSection[] = ["early", "prelim", "main"];
    let won = 0;
    let lost = 0;
    let staked = 0;
    let belts = 0;
    for (const section of order) {
      for (const bout of eventBouts(ev, section)) {
        if (bout.result) continue;
        const a = getFighter(bout.aId)!;
        const b = getFighter(bout.bId)!;
        if (!a || !b) continue;
        const sim = simulateFight(a, b, effectiveRounds(bout, a, b));
        const outcome = recordEventBout(ev.id, bout.id, sim);
        if (outcome) {
          for (const belt of outcome.belts) {
            belts++;
            toast.success(
              `NEW CHAMPION! ${belt.newChamp.name} dethrones ${belt.oldChamp.name} — the ${belt.divName} belt changes hands!`,
              { duration: 7000 }
            );
          }
          const s = settleBetsForBout(a.id, b.id, eventSettleLabels(ev), sim);
          won += s.won;
          lost += s.lost;
          staked += s.staked;
        }
      }
    }
    toast.success(
      ev.completed
        ? `${name} is in the books — records, rankings & titles updated. Next fight week ${prettyDate(isoOf(currentSaturday()))} unlocked.`
        : `${name}: every fightable bout is in the books.`,
      { duration: 6000 }
    );
    if (won + lost > 0) {
      if (won > 0) toast.success(`Event bets: ${won}W-${lost}L`);
      else toast.error(`Event bets: 0W-${lost}L · −$${staked.toFixed(2)}`);
    }
  };

  const mainBout = eventBouts(ev, "main")[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015]"
    >
      <div className="relative border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="absolute inset-x-0 top-0 h-0.5 red-grad" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {ev.type === "numbered" ? (
                <span className="rounded-full border border-[#e0b64c]/50 bg-[#e0b64c]/10 px-2.5 py-0.5 font-display text-[10px] font-bold tracking-widest text-[#e0b64c]">
                  UFC {ev.number}
                </span>
              ) : (
                <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2.5 py-0.5 font-display text-[10px] font-bold tracking-widest text-sky-400">
                  FIGHT NIGHT{ev.number ? ` ${ev.number}` : ""}
                </span>
              )}
              {ev.completed ? (
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-display text-[10px] font-bold tracking-widest text-emerald-400">
                  <Check className="mr-1 inline h-2.5 w-2.5" /> COMPLETED
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-[#e5322d]/40 bg-[#e5322d]/10 px-2.5 py-0.5 font-display text-[10px] font-bold tracking-widest text-[#ff6b66]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e5322d]" /> THIS SATURDAY
                </span>
              )}
            </div>
            <h3 className="mt-1.5 font-display text-2xl font-bold text-white">
              {name}
              {tagline && <span className="ml-2 text-base font-semibold text-zinc-500">· {tagline}</span>}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
              <CalendarDays className="h-3 w-3" /> {prettyDate(ev.dateISO)}
              <span className="text-zinc-700">·</span>
              <MapPin className="h-3 w-3" /> {ev.venue}, {ev.city}
              <span className="text-zinc-700">·</span>
              <Tv className="h-3 w-3" /> {ev.type === "numbered" ? "PPV MAIN" : "ESPN+"}
            </p>
          </div>
          <div className="text-right">
            <div className="num font-display text-2xl font-bold text-white">{ev.bouts.length}</div>
            <div className="text-[9px] font-display tracking-widest text-zinc-500">BOUTS BOOKED</div>
            {!ev.completed && ev.bouts.every((b) => !b.result) && (
              <button
                onClick={() => {
                  if (scrapEvent(ev.id)) {
                    toast.success(`Card scrapped — fight week ${prettyDate(isoOf(currentSaturday()))} is open again.`);
                  }
                }}
                className="mt-1.5 text-[9px] font-display tracking-widest text-zinc-600 transition-colors hover:text-[#ff6b66]"
                title="Nothing fought yet — scrap this card and re-book the week"
              >
                SCRAP CARD
              </button>
            )}
          </div>
        </div>

        {pending.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={runFullCard}
              className="red-grad h-11 flex-1 font-display font-sm font-bold tracking-widest text-white hover:opacity-90 sm:px-8 sm:flex-none"
            >
              <Play className="mr-2 h-4 w-4" /> RUN FULL CARD ({pending.length})
            </Button>
            <Button
              onClick={() => copyCard(ev)}
              variant="outline"
              className="h-11 flex-1 border-white/15 bg-white/5 font-display font-bold tracking-widest text-zinc-300 hover:bg-white/10 sm:flex-none"
              title="Copy the whole card as text — ranks, records, odds — for pasting anywhere"
            >
              <Copy className="mr-2 h-4 w-4" /> COPY CARD
            </Button>
          </div>
        )}
        {pending.length === 0 && ev.bouts.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <p className="flex-1 text-[10px] text-zinc-500">
              Every bout is in the books — records, rankings and championship lineage updated.
              {openBetsCount > 0 && ` ${openBetsCount} open bet${openBetsCount > 1 ? "s" : ""} on this event.`}
            </p>
            <Button
              onClick={() => copyCard(ev)}
              variant="outline"
              className="h-8 shrink-0 border-white/15 bg-white/5 px-3 font-display text-[10px] font-bold tracking-widest text-zinc-300 hover:bg-white/10"
              title="Copy the full card with results as text"
            >
              <Copy className="mr-1.5 h-3 w-3" /> COPY CARD
            </Button>
          </div>
        )}
        {ev.bouts.length === 0 && (
          <p className="mt-3 text-[10px] text-zinc-500">Card is empty — add a main event, prelims and early prelims below.</p>
        )}
        {mainBout && !mainBout.result && (
          <button
            onClick={() =>
              setSimSpec({
                aId: mainBout.aId,
                bId: mainBout.bId,
                label: name,
                rounds: mainBout.rounds,
                source: { eventId: ev.id, boutId: mainBout.id },
              })
            }
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-[#e5322d]/30 bg-gradient-to-r from-[#e5322d]/[0.08] to-transparent px-4 py-3 text-left transition-colors hover:border-[#e5322d]/60"
          >
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#e5322d]" />
              <div>
                <div className="text-[9px] font-display tracking-[0.2em] text-[#ff6b66]">MAIN EVENT — WATCH LIVE</div>
                <div className="text-sm font-semibold text-zinc-200">
                  {getFighter(mainBout.aId)?.name} vs {getFighter(mainBout.bId)?.name}
                </div>
              </div>
            </div>
            <Eye className="h-4 w-4 text-zinc-500" />
          </button>
        )}
      </div>

      <div className="space-y-5 px-4 py-4 sm:px-5">
        <SectionBlock ev={ev} section="main" />
        <SectionBlock ev={ev} section="prelim" />
        <SectionBlock ev={ev} section="early" />
      </div>
    </motion.section>
  );
}

// ---------- past event row ----------
function PastEventRow({ ev }: { ev: SimEvent }) {
  const [open, setOpen] = useState(false);
  const name = eventDisplayName(ev);
  const mainBout = eventBouts(ev, "main")[0];
  const mainA = mainBout ? getFighter(mainBout.aId) : null;
  const mainB = mainBout ? getFighter(mainBout.bId) : null;
  const mainWin = mainBout?.result
    ? mainBout.result.winner === "A" ? mainA : mainBout.result.winner === "B" ? mainB : null
    : null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.015]">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-white/[0.03]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-display font-bold tracking-widest ${ev.type === "numbered" ? "text-[#e0b64c]" : "text-sky-400"}`}>
              {ev.type === "numbered" ? `UFC ${ev.number}` : `FIGHT NIGHT${ev.number ? ` ${ev.number}` : ""}`}
            </span>
            <span className="num text-[10px] text-zinc-600">{prettyDate(ev.dateISO)}</span>
          </div>
          <div className="truncate font-display text-sm font-bold text-white">{name}</div>
          {mainWin && mainA && mainB && (
            <div className="truncate text-[10px] text-zinc-500">
              {mainWin.name} def. {mainWin === mainA ? mainB.name : mainA.name}
              {mainBout?.result && ` · ${methodText(mainBout.result)}`}
            </div>
          )}
        </div>
        <Trophy className="h-4 w-4 shrink-0 text-zinc-600" />
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-600 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="space-y-1.5 border-t border-white/5 px-3.5 py-3">
          {(["early", "prelim", "main"] as EventSection[]).flatMap((section) =>
            eventBouts(ev, section).map((bout) => {
              const a = getFighter(bout.aId);
              const b = getFighter(bout.bId);
              if (!a || !b || !bout.result) return null;
              const w = bout.result.winner === "A" ? a : bout.result.winner === "B" ? b : null;
              return (
                <div key={bout.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.02] px-2.5 py-1.5 text-[11px]">
                  <span className="shrink-0 text-[8px] font-display tracking-widest text-zinc-600">
                    {boutSectionLabel(ev, bout)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-zinc-400">
                    <span className="font-semibold text-zinc-200">{w ? w.name : "Draw"}</span>
                    {w ? ` def. ${w === a ? b.name : a.name}` : ` — ${a.name} vs ${b.name}`}
                  </span>
                  <span className="shrink-0 text-[10px] text-zinc-500">{methodText(bout.result)}</span>
                </div>
              );
            })
          )}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => copyCard(ev)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[9px] font-display font-bold tracking-widest text-zinc-300 transition-colors hover:bg-white/10"
              title="Copy the full card with results as text"
            >
              <Copy className="h-3 w-3" /> COPY CARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- the tab ----------
export function EventsTab() {
  useUniverseVersion();
  const week = currentSaturday();
  const weekIso = isoOf(week);
  const current = currentWeekEvent();
  const past = pastEvents();
  const all = events();
  const numberedOk = numberedAvailableThisMonth(weekIso);
  const nextNum = nextEventNumber();
  const nextFN = nextFightNightNumber();
  const auto = autoEventType(weekIso);
  const road = upcomingWeeks(6);
  const totalBouts = all.reduce((s, e) => s + e.bouts.length, 0);

  const create = (type?: "numbered" | "fightnight") => {
    const res = createEvent(type);
    if (!res.ok && res.reason) toast.error(res.reason);
    else if (res.event) toast.success(`${eventDisplayName(res.event)} created — ${prettyDate(res.event.dateISO)} at ${res.event.venue}`);
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
            <CalendarDays className="h-5 w-5 text-[#e5322d]" /> UNIVERSE EVENT CENTER
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            One card every Saturday — finish a card and the next fight week unlocks instantly, forever · results update records, rankings & titles
          </p>
        </div>
        <div className="flex gap-3 text-center">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5">
            <div className="num font-display text-lg font-bold text-white">{all.length}</div>
            <div className="text-[8px] font-display tracking-widest text-zinc-500">EVENTS</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5">
            <div className="num font-display text-lg font-bold text-white">{totalBouts}</div>
            <div className="text-[8px] font-display tracking-widest text-zinc-500">FOUGHT</div>
          </div>
        </div>
      </div>

      {/* current week */}
      {current ? (
        <EventCard ev={current} />
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] px-5 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <CalendarDays className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-white">NO EVENT THIS WEEK</h3>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-zinc-500">
            Fight week of <span className="font-semibold text-zinc-300">{prettyDate(isoOf(week))}</span> is open —
            Saturday night is dark. Book a card and every bout on it counts toward the fighters' OCTAGONHQ records.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {auto === "numbered" ? (
              <>
                <Button onClick={() => create()} className="red-grad h-12 px-8 font-display font-bold tracking-widest text-white hover:opacity-90">
                  <Dices className="mr-2 h-4 w-4" /> CREATE UFC {nextNum}
                </Button>
                <Button
                  onClick={() => create("fightnight")}
                  variant="outline"
                  className="h-12 border-sky-500/40 bg-sky-500/10 font-display font-bold tracking-widest text-sky-400 hover:bg-sky-500/20"
                >
                  CREATE FIGHT NIGHT {nextFN}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => create()}
                  className="h-12 border-sky-500/40 bg-sky-500/10 px-8 font-display font-bold tracking-widest text-sky-400 hover:bg-sky-500/20"
                >
                  <Dices className="mr-2 h-4 w-4" /> CREATE FIGHT NIGHT {nextFN}
                </Button>
                {numberedOk && (
                  <Button
                    onClick={() => create("numbered")}
                    className="red-grad h-12 px-8 font-display font-bold tracking-widest text-white hover:opacity-90"
                  >
                    CREATE UFC {nextNum}
                  </Button>
                )}
              </>
            )}
          </div>
          <p className="mt-3 text-[10px] text-zinc-600">
            {numberedOk
              ? "One numbered event per month — Fight Nights fill the other Saturdays."
              : "A numbered event already ran this month — this Saturday is a Fight Night."}
          </p>

          {/* the road ahead — the infinite Saturday schedule */}
          <div className="mx-auto mt-6 max-w-2xl">
            <div className="text-[9px] font-display tracking-[0.25em] text-zinc-600">
              THE ROAD AHEAD — A CARD EVERY SATURDAY, FOREVER
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {road.map((s) => (
                <div
                  key={s.iso}
                  className={`rounded-lg border px-2.5 py-1.5 text-center ${
                    s.type === "numbered" ? "border-[#e0b64c]/30 bg-[#e0b64c]/[0.06]" : "border-sky-500/20 bg-sky-500/[0.04]"
                  }`}
                >
                  <div className="num text-[9px] text-zinc-500">{shortDate(s.iso)}</div>
                  <div className={`text-[10px] font-display font-bold ${s.type === "numbered" ? "text-[#e0b64c]" : "text-sky-400"}`}>
                    {s.name}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[9px] text-zinc-600">Auto-scheduled — override any week when you create its card.</p>
          </div>
        </div>
      )}

      {/* past events */}
      {past.length > 0 && (
        <div>
          <h3 className="mb-2 font-display text-sm font-bold tracking-wider text-zinc-300">EVENT HISTORY</h3>
          <div className="space-y-2">
            {past.map((ev) => (
              <PastEventRow key={ev.id} ev={ev} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
