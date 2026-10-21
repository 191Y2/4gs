"use client";

// ============ OCTAGONHQ UNIVERSE ============
// The UFC simulator. Fight Lab bookings are just a lab — they never touch
// records. The ONLY thing that changes a fighter's career is fighting on a
// user-created EVENT: one event per week (Saturdays, first week = Oct 17,
// 2026), numbered events + Fight Nights, cards built bout-by-bout.
//
// Event results:
//   • count toward both fighters' records (OCTAGONHQ record, starts 0-0)
//   • move championships (champ loses a title fight → belt changes hands)
//   • drive the OCTAGONHQ rankings (points from universe fights only)
//
// Everything persists to localStorage and replays on reload.

import { useEffect, useState } from "react";
import { Fighter, FightLogEntry, WinMethod, DivisionId, SimEvent, SimEventBout, EventSection } from "./types";
import { getFighter, DIVISION_MAP, ROSTER } from "./data";
import { maybeTransferBelt, BeltChange } from "./belts";
import { SimResult } from "./engine";

const STORAGE_KEY = "octagon-hq-universe-v1";
const LEGACY_CAREERS_KEY = "octagon-hq-careers-v1"; // fight-lab era cache — wiped

// The first fight week. Even if today is Oct 18, the week's Saturday is
// Oct 17 — that's day one of the universe.
export const FIRST_SATURDAY = new Date(2026, 9, 17); // Oct 17, 2026
export const FIRST_EVENT_NUMBER = 334; // next numbered event after UFC 333

// ---------- change propagation ----------
const listeners = new Set<() => void>();
let version = 0;

function bump() {
  version++;
  listeners.forEach((l) => l());
}

export function onUniverseChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useUniverseVersion(): void {
  const [, force] = useState(0);
  useEffect(() => onUniverseChange(() => force((v) => v + 1)), []);
}

// ---------- calendar ----------
// weeks run Saturday → Friday; every event happens on its week's Saturday.
// The clock is PURE universe time — the real-world calendar is irrelevant.
// The first fight week is Oct 17, 2026; the moment a card is completed the
// next Saturday unlocks, and that rolls on FOREVER: Fight Night 1 → UFC 334
// → Fight Night 2 → UFC 335… one card every Saturday, endlessly. An
// unfinished card pins the clock on its own Saturday until it's run or
// scrapped.
export function currentSaturday(): Date {
  if (state.events.length === 0) return new Date(FIRST_SATURDAY);
  const latest = state.events.reduce((m, e) => (e.dateISO > m.dateISO ? e : m));
  if (!latest.completed) return dateOfIso(latest.dateISO);
  // card done — the next fight week unlocks instantly, forever
  const next = dateOfIso(latest.dateISO);
  next.setDate(next.getDate() + 7);
  return next;
}

export function isoOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function dateOfIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function prettyDate(iso: string): string {
  return dateOfIso(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function shortDate(iso: string): string {
  return dateOfIso(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---------- state ----------
interface UniverseState {
  events: SimEvent[];
  ledger: UniverseBout[];
}

export interface UniverseBout {
  aId: string;
  bId: string;
  winner: "A" | "B" | "DRAW" | "NC";
  method: WinMethod;
  detail?: string;
  round: number;
  time: string;
  evName: string;      // "UFC 334"
  section: EventSection;
  date: string;        // "Oct 17, 2026"
  wc?: DivisionId;     // weight class the fight was contested at
  title?: boolean;     // title fight flag
}

let state: UniverseState = { events: [], ledger: [] };
let hydrated = false;

function save() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full / disabled — universe still lives this session
  }
}

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ---------- record application ----------
function methodSplit(m: WinMethod): "ko" | "sub" | "dec" {
  if (m === "KO") return "ko";
  if (m === "SUB") return "sub";
  return "dec";
}

function boutWeightClass(a: Fighter, b: Fighter): DivisionId {
  if (a.division === b.division) return a.division;
  return (DIVISION_MAP[a.division]?.limit ?? 0) >= (DIVISION_MAP[b.division]?.limit ?? 0)
    ? a.division
    : b.division;
}

// same-division bout with an active reigning champion = title fight
export function isTitleBout(a: Fighter, b: Fighter): boolean {
  if (a.division !== b.division) return false;
  if (a.status === "retired" || b.status === "retired") return false;
  return !!(a.isChampion || b.isChampion);
}

function sectionLabel(bout: SimEventBout, ev: SimEvent): string {
  const list = ev.bouts.filter((b) => b.section === bout.section);
  const idx = list.findIndex((b) => b.id === bout.id);
  if (bout.section === "main") {
    if (idx === 0) return "MAIN EVENT";
    if (idx === 1) return "CO-MAIN EVENT";
    return "MAIN CARD";
  }
  if (bout.section === "prelim") return "PRELIMS";
  return "EARLY PRELIMS";
}

// apply one universe bout to both fighters (live + replay)
function applyBout(a: Fighter, b: Fighter, rec: UniverseBout) {
  const resA: FightLogEntry["res"] =
    rec.winner === "A" ? "W" : rec.winner === "B" ? "L" : rec.winner === "DRAW" ? "D" : "NC";
  const resB: FightLogEntry["res"] =
    rec.winner === "B" ? "W" : rec.winner === "A" ? "L" : rec.winner === "DRAW" ? "D" : "NC";

  const base = {
    ev: `${rec.evName} · ${rec.section === "main" ? "MAIN EVENT" : rec.section === "prelim" ? "PRELIMS" : "EARLY PRELIMS"}`,
    date: rec.date,
    m: rec.method,
    det: rec.detail,
    r: rec.round,
    t: rec.time,
    wc: rec.wc,
    title: rec.title ? ("T" as const) : undefined,
    sim: true as const,
  };
  a.log.push({ ...base, op: b.name, res: resA });
  b.log.push({ ...base, op: a.name, res: resB });

  // OCTAGONHQ universe records (starts 0-0 — real W-L never changes)
  if (resA === "W") a.simW = (a.simW ?? 0) + 1;
  else if (resA === "L") a.simL = (a.simL ?? 0) + 1;
  else if (resA === "D") a.simD = (a.simD ?? 0) + 1;
  if (resB === "W") b.simW = (b.simW ?? 0) + 1;
  else if (resB === "L") b.simL = (b.simL ?? 0) + 1;
  else if (resB === "D") b.simD = (b.simD ?? 0) + 1;
}

export function simRecord(f: Fighter): { w: number; l: number; d: number } {
  return { w: f.simW ?? 0, l: f.simL ?? 0, d: f.simD ?? 0 };
}

// ---------- venues ----------
const VENUES: { venue: string; city: string }[] = [
  { venue: "T-Mobile Arena", city: "Las Vegas, NV" },
  { venue: "Etihad Arena", city: "Abu Dhabi, UAE" },
  { venue: "The O2", city: "London, UK" },
  { venue: "Madison Square Garden", city: "New York, NY" },
  { venue: "Kaseya Center", city: "Miami, FL" },
  { venue: "RAC Arena", city: "Perth, Australia" },
  { venue: "Fontainebleau Las Vegas", city: "Las Vegas, NV" },
  { venue: "Ginasio do Ibirapuera", city: "São Paulo, Brazil" },
  { venue: "Enterprise Center", city: "St. Louis, MO" },
  { venue: "Qudos Bank Arena", city: "Sydney, Australia" },
  { venue: "Co-op Live", city: "Manchester, UK" },
  { venue: " Rogers Arena", city: "Vancouver, Canada" },
];

// ---------- event API ----------
export function events(): SimEvent[] {
  return state.events;
}

export function universeBouts(): UniverseBout[] {
  return state.ledger;
}

export function universeActive(): boolean {
  return state.ledger.length > 0;
}

export function currentWeekEvent(): SimEvent | undefined {
  const iso = isoOf(currentSaturday());
  return state.events.find((e) => e.dateISO === iso);
}

export function pastEvents(): SimEvent[] {
  const iso = isoOf(currentSaturday());
  return state.events.filter((e) => e.dateISO < iso).sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

export function eventDisplayName(ev: SimEvent): string {
  if (ev.type === "numbered") return `UFC ${ev.number}`;
  if (ev.number != null) return `UFC Fight Night ${ev.number}`;
  // pre-numbering fight night — fall back to a main-event name
  const main = ev.bouts.find((b) => b.section === "main");
  if (main) {
    const a = getFighter(main.aId);
    const b = getFighter(main.bId);
    if (a && b) return `UFC Fight Night: ${a.name.split(" ").slice(-1)[0]} vs ${b.name.split(" ").slice(-1)[0]}`;
  }
  return "UFC Fight Night";
}

// main-event tagline for card headers ("Topuria vs Evloev")
export function eventTagline(ev: SimEvent): string | null {
  const main = ev.bouts.find((b) => b.section === "main");
  if (!main) return null;
  const a = getFighter(main.aId);
  const b = getFighter(main.bId);
  if (!a || !b) return null;
  return `${a.name.split(" ").slice(-1)[0]} vs ${b.name.split(" ").slice(-1)[0]}`;
}

export function eventBouts(ev: SimEvent, section: EventSection): SimEventBout[] {
  return ev.bouts.filter((b) => b.section === section).sort((a, b) => a.order - b.order);
}

export function boutSectionLabel(ev: SimEvent, bout: SimEventBout): string {
  return sectionLabel(bout, ev);
}

// one numbered event per calendar month — after that it's Fight Nights
export function numberedAvailableThisMonth(dateISO: string): boolean {
  const d = dateOfIso(dateISO);
  return !state.events.some((e) => {
    if (e.type !== "numbered") return false;
    const ed = dateOfIso(e.dateISO);
    return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth();
  });
}

export function nextEventNumber(): number {
  const max = state.events.reduce((m, e) => Math.max(m, e.number ?? 0), 0);
  return Math.max(FIRST_EVENT_NUMBER, max + 1);
}

// Fight Nights carry their own infinite counter — Fight Night 1, 2, 3…
export function nextFightNightNumber(): number {
  let max = 0;
  let count = 0;
  for (const e of state.events) {
    if (e.type !== "fightnight") continue;
    count++;
    max = Math.max(max, e.number ?? 0);
  }
  return Math.max(count, max) + 1;
}

// The event the calendar itself books this Saturday: the inaugural card is
// Fight Night 1; after that, the month's numbered (PPV) slot belongs to the
// first week of the month that hasn't spent it — every other week is a
// Fight Night. One click, the sequence just rolls.
export function autoEventType(dateISO: string): "numbered" | "fightnight" {
  if (state.events.length === 0) return "fightnight";
  return numberedAvailableThisMonth(dateISO) ? "numbered" : "fightnight";
}

export interface WeekSlot {
  iso: string;
  type: "numbered" | "fightnight";
  name: string;
}

// THE ROAD AHEAD — the infinite schedule: the next Saturdays and the events
// the calendar would auto-book on them (override any week at creation).
export function upcomingWeeks(count = 6): WeekSlot[] {
  const slots: WeekSlot[] = [];
  let d = currentSaturday();
  let ufc = nextEventNumber();
  let fn = nextFightNightNumber();
  const numberedMonths = new Set(
    state.events.filter((e) => e.type === "numbered").map((e) => e.dateISO.slice(0, 7))
  );
  for (let i = 0; i < count; i++) {
    const iso = isoOf(d);
    const ym = iso.slice(0, 7);
    const type: "numbered" | "fightnight" =
      i === 0 ? autoEventType(iso) : numberedMonths.has(ym) ? "fightnight" : "numbered";
    slots.push({ iso, type, name: type === "numbered" ? `UFC ${ufc}` : `UFC Fight Night ${fn}` });
    if (type === "numbered") {
      ufc++;
      numberedMonths.add(ym);
    } else {
      fn++;
    }
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
  }
  return slots;
}

// scrap an unbuilt card (nothing fought yet, so nothing to unwind) — the
// fight week re-opens for a fresh booking
export function scrapEvent(eventId: string): boolean {
  const ev = state.events.find((e) => e.id === eventId);
  if (!ev || ev.completed) return false;
  if (ev.bouts.some((b) => b.result)) return false;
  state.events = state.events.filter((e) => e.id !== eventId);
  save();
  bump();
  return true;
}

export interface CreateEventResult {
  ok: boolean;
  reason?: string;
  event?: SimEvent;
}

export function createEvent(type?: "numbered" | "fightnight"): CreateEventResult {
  const iso = isoOf(currentSaturday());
  const chosen = type ?? autoEventType(iso);
  if (state.events.some((e) => e.dateISO === iso)) {
    return { ok: false, reason: "This week already has an event — run it, scrap it, or check the card." };
  }
  if (chosen === "numbered" && !numberedAvailableThisMonth(iso)) {
    return { ok: false, reason: "A numbered event already ran this month — book a Fight Night." };
  }
  const spot = VENUES[state.events.length % VENUES.length];
  const ev: SimEvent = {
    id: uid(),
    type: chosen,
    number: chosen === "numbered" ? nextEventNumber() : nextFightNightNumber(),
    dateISO: iso,
    venue: spot.venue.trim(),
    city: spot.city,
    bouts: [],
    completed: false,
    createdAt: Date.now(),
  };
  state.events = [...state.events, ev];
  save();
  bump();
  return { ok: true, event: ev };
}

export function addBout(eventId: string, aId: string, bId: string, section: EventSection): SimEventBout | null {
  const ev = state.events.find((e) => e.id === eventId);
  const a = getFighter(aId);
  const b = getFighter(bId);
  if (!ev || !a || !b || a.id === b.id) return null;
  // same fighter can't be booked twice on one card
  if (ev.bouts.some((x) => x.aId === a.id || x.bId === a.id || x.aId === b.id || x.bId === b.id)) return null;
  const order = ev.bouts.filter((x) => x.section === section).length;
  const bout: SimEventBout = {
    id: uid(),
    aId: a.id,
    bId: b.id,
    section,
    order,
    rounds: isTitleBout(a, b) ? 5 : 3,
    title: isTitleBout(a, b) || undefined,
    result: null,
  };
  ev.bouts = [...ev.bouts, bout];
  save();
  bump();
  return bout;
}

export function removeBout(eventId: string, boutId: string): void {
  const ev = state.events.find((e) => e.id === eventId);
  if (!ev) return;
  const bout = ev.bouts.find((b) => b.id === boutId);
  if (bout?.result) return; // already fought — it's history now
  ev.bouts = ev.bouts.filter((b) => b.id !== boutId);
  ev.bouts.filter((b) => b.section === bout?.section).forEach((b, i) => (b.order = i));
  save();
  bump();
}

export function moveBout(eventId: string, boutId: string, dir: -1 | 1): void {
  const ev = state.events.find((e) => e.id === eventId);
  if (!ev) return;
  const bout = ev.bouts.find((b) => b.id === boutId);
  if (!bout || bout.result) return;
  const list = ev.bouts.filter((b) => b.section === bout.section).sort((a, b) => a.order - b.order);
  const idx = list.findIndex((b) => b.id === boutId);
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= list.length) return;
  const other = list[swapIdx];
  if (other.result) return;
  const t = bout.order;
  bout.order = other.order;
  other.order = t;
  save();
  bump();
}

export interface RecordOutcome {
  evName: string;
  belt?: BeltChange;
  note: string;
}

// THE moment a universe event bout is decided: careers update, the belt can
// change hands, and the ledger grows. Lab fights NEVER call this.
export function recordEventBout(eventId: string, boutId: string, sim: SimResult): RecordOutcome | null {
  const ev = state.events.find((e) => e.id === eventId);
  const bout = ev?.bouts.find((b) => b.id === boutId);
  if (!ev || !bout || bout.result) return null;
  const a = getFighter(bout.aId);
  const b = getFighter(bout.bId);
  if (!a || !b) return null;

  // championship status is computed at the bell — belts can already have
  // moved earlier on this same card
  const title = bout.title || isTitleBout(a, b);
  const date = prettyDate(ev.dateISO);
  const rec: UniverseBout = {
    aId: a.id,
    bId: b.id,
    winner: sim.winner,
    method: sim.method,
    detail: sim.detail,
    round: sim.round,
    time: sim.time,
    evName: eventDisplayName(ev),
    section: bout.section,
    date,
    wc: boutWeightClass(a, b),
    title,
  };
  applyBout(a, b, rec);
  state.ledger = [...state.ledger, rec];

  bout.result = {
    winner: sim.winner,
    method: sim.method,
    detail: sim.detail,
    round: sim.round,
    time: sim.time,
  };
  if (title && sim.winner !== "A" && sim.winner !== "B") bout.title = undefined;

  // champion can lose the belt right here
  const belt = maybeTransferBelt(a, b, sim.winner);

  if (ev.bouts.every((x) => x.result)) ev.completed = true;
  save();
  bump();

  const w = sim.winner === "A" ? a : b;
  const l = sim.winner === "A" ? b : a;
  return {
    evName: eventDisplayName(ev),
    belt: belt ?? undefined,
    note:
      sim.winner === "DRAW" || sim.winner === "NC"
        ? `${a.name} vs ${b.name} — a draw goes on both records at ${eventDisplayName(ev)}`
        : `${w.name} def. ${l.name} — written onto both career records`,
  };
}

// ---------- OCTAGONHQ rankings ----------
// Points come ONLY from universe event fights: decision win +3, finish +4,
// title-fight win +1, draw +1. Champion sits on top; ties break on wins,
// finishes, then real-world seeding.
export interface Standing {
  fighter: Fighter;
  pts: number;
  simW: number;
  simL: number;
  simD: number;
  finishes: number;
  rank: number | "C";
}

function pointsFromLedger(): Map<string, { pts: number; finishes: number }> {
  const map = new Map<string, { pts: number; finishes: number }>();
  for (const b of state.ledger) {
    const winnerId = b.winner === "A" ? b.aId : b.winner === "B" ? b.bId : null;
    const finish = b.method === "KO" || b.method === "SUB";
    if (winnerId) {
      const cur = map.get(winnerId) ?? { pts: 0, finishes: 0 };
      cur.pts += (finish ? 4 : 3) + (b.title ? 1 : 0);
      if (finish) cur.finishes += 1;
      map.set(winnerId, cur);
    } else {
      for (const id of [b.aId, b.bId]) {
        const cur = map.get(id) ?? { pts: 0, finishes: 0 };
        cur.pts += 1;
        map.set(id, cur);
      }
    }
  }
  return map;
}

export function divisionStandings(div: DivisionId): Standing[] {
  const pts = pointsFromLedger();
  const roster = getDivision(div);
  const champ = roster.find((f) => f.isChampion);
  const others = roster
    .filter((f) => !f.isChampion)
    .map((f) => {
      const p = pts.get(f.id) ?? { pts: 0, finishes: 0 };
      const s = simRecord(f);
      return { fighter: f, pts: p.pts, finishes: p.finishes, simW: s.w, simL: s.l, simD: s.d, rank: 0 as number | "C" };
    })
    .sort((x, y) => {
      if (y.pts !== x.pts) return y.pts - x.pts;
      if (y.simW !== x.simW) return y.simW - x.simW;
      if (y.finishes !== x.finishes) return y.finishes - x.finishes;
      const rx = x.fighter.rank ?? 99;
      const ry = y.fighter.rank ?? 99;
      if (rx !== ry) return rx - ry;
      return y.fighter.elo - x.fighter.elo;
    });
  const out: Standing[] = [];
  if (champ) {
    const p = pts.get(champ.id) ?? { pts: 0, finishes: 0 };
    const s = simRecord(champ);
    out.push({ fighter: champ, pts: p.pts, finishes: p.finishes, simW: s.w, simL: s.l, simD: s.d, rank: "C" });
  }
  others.forEach((o, i) => {
    o.rank = i + 1;
    out.push(o as Standing);
  });
  return out;
}

// OCTAGONHQ rank label for a fighter: "C" (champ), "#1".."#15", or "UNRANKED".
// Mirrors DivisionsTab — only the top 15 contenders are ranked.
// Cached per universe version so bulk consumers (picker sort) stay instant.
let rankLabelCache: { version: number; map: Map<string, string> } | null = null;

export function hqRankMap(): Map<string, string> {
  if (rankLabelCache && rankLabelCache.version === version) return rankLabelCache.map;
  const map = new Map<string, string>();
  for (const d of Object.keys(DIVISION_MAP) as DivisionId[]) {
    for (const s of divisionStandings(d)) {
      map.set(s.fighter.id, s.rank === "C" ? "C" : s.rank <= 15 ? `#${s.rank}` : "UNRANKED");
    }
  }
  rankLabelCache = { version, map };
  return map;
}

export function hqRankLabel(fighterId: string): string {
  const f = ROSTER.find((x) => x.id === fighterId);
  if (!f) return "UNRANKED";
  if (f.isChampion) return "C";
  return hqRankMap().get(f.id) ?? "UNRANKED";
}

// division roster for standings
function getDivision(div: DivisionId): Fighter[] {
  return ROSTER.filter((f) => f.division === div);
}

// universe pound-for-pound: champs by points, then top points scorers
export function simP4P(gender: "men" | "women"): { fighter: Fighter; pts: number; rank: number | "C" }[] {
  const pts = pointsFromLedger();
  const pool = ROSTER.filter((f) => DIVISION_MAP[f.division].division === gender);
  const champs = pool.filter((f) => f.isChampion);
  const rest = pool.filter((f) => !f.isChampion);
  const champsRanked = champs.map((f) => ({ fighter: f, pts: pts.get(f.id)?.pts ?? 0, rank: "C" as number | "C" }));
  const restRanked = rest
    .map((f) => ({ fighter: f, pts: pts.get(f.id)?.pts ?? 0, rank: 0 as number | "C" }))
    .sort((a, b) => b.pts - a.pts || b.fighter.elo - a.fighter.elo)
    .slice(0, Math.max(0, 10 - champs.length));
  return [...champsRanked, ...restRanked].slice(0, 10);
}

// ---------- persistence ----------
export function rehydrateUniverse(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  // wipe the old fight-lab careers cache — those records were never real
  try {
    window.localStorage.removeItem(LEGACY_CAREERS_KEY);
  } catch {
    /* ignore */
  }
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as UniverseState;
    if (!parsed || !Array.isArray(parsed.events) || !Array.isArray(parsed.ledger)) return;
    state = { events: parsed.events, ledger: [] };
    // migrate: legacy fight nights get their infinite numbers (Fight Night
    // 1, 2, 3… in fight order); the old display name is kept so any open
    // wallet bets placed under it still settle
    let fn = 1;
    let changed = false;
    const ordered = [...state.events].sort((a, b) => (a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0));
    for (const ev of ordered) {
      if (ev.type !== "fightnight") continue;
      if (ev.number == null) {
        ev.legacyName = eventDisplayName(ev); // capture BEFORE numbering
        ev.number = fn;
        changed = true;
      }
      fn = Math.max(fn, ev.number + 1);
    }
    if (changed) save();
    // replay bouts in order — records, sim counters AND belt transfers
    for (const rec of parsed.ledger) {
      const a = getFighter(rec.aId);
      const b = getFighter(rec.bId);
      if (!a || !b || a.id === b.id) continue;
      applyBout(a, b, rec);
      maybeTransferBelt(a, b, rec.winner);
      state.ledger.push(rec);
    }
    bump();
  } catch {
    state = { events: [], ledger: [] };
  }
}

// wipe the universe and reload back to real Oct 17, 2026 data
export function resetUniverse(): void {
  state = { events: [], ledger: [] };
  save();
  if (typeof window !== "undefined") window.location.reload();
}
