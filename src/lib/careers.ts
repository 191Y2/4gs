"use client";

// ============ CAREER LEDGER ============
// Every simulated fight is REAL in your universe. When the Fight Lab (or an
// event sim) produces a winner, the result is written to BOTH fighters'
// career records — W/L/D/NC, method, round, time, the weight class the fight
// was contested at, and whether it was a title fight — exactly like their
// pre-2026 history. The ledger persists to localStorage and replays onto the
// roster on reload, so careers keep growing across sessions.

import { useEffect, useState } from "react";
import { Fighter, FightLogEntry, WinMethod, DivisionId } from "./types";
import { getFighter, DIVISION_MAP } from "./data";
import { maybeTransferBelt } from "./belts";

const STORAGE_KEY = "octagon-hq-careers-v1";

// what gets persisted for one simulated bout
export interface CareerBout {
  aId: string;
  bId: string;
  winner: "A" | "B" | "DRAW" | "NC";
  method: WinMethod;
  detail?: string;
  round: number;
  time: string;
  ev: string;          // event label shown in bout history
  date: string;        // "Oct 18, 2026"
  wc?: DivisionId;     // weight class the fight was contested at
  title?: boolean;     // title fight flag
}

export interface SimSpecLite {
  label: string;
  title?: string;
}

// ---------- change propagation (same pattern as belts) ----------
const listeners = new Set<() => void>();
let version = 0;

function bump() {
  version++;
  listeners.forEach((l) => l());
}

export function careersVersion(): number {
  return version;
}

export function useCareersVersion(): void {
  const [, force] = useState(0);
  useEffect(() => onCareersChange(() => force((v) => v + 1)), []);
}

export function onCareersChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// ---------- ledger ----------
let ledger: CareerBout[] = [];
let hydrated = false;

function save() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  } catch {
    // storage full / disabled — careers still live this session
  }
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// heavier division wins a cross-division superfight booking (by weight limit)
function boutWeightClass(a: Fighter, b: Fighter): DivisionId {
  if (a.division === b.division) return a.division;
  return (DIVISION_MAP[a.division]?.limit ?? 0) >= (DIVISION_MAP[b.division]?.limit ?? 0)
    ? a.division
    : b.division;
}

function isTitleFight(a: Fighter, b: Fighter, spec: SimSpecLite): boolean {
  if (spec.title) return true; // event card says it's a title bout
  // same-division bout with an active reigning champion = title fight
  if (a.division !== b.division) return false;
  if (a.status === "retired" || b.status === "retired") return false;
  return !!(a.isChampion || b.isChampion);
}

function methodSplit(m: WinMethod): "ko" | "sub" | "dec" {
  if (m === "KO") return "ko";
  if (m === "SUB") return "sub";
  return "dec";
}

// apply one bout to both fighters' records (used for live results AND replay)
function applyBout(a: Fighter, b: Fighter, rec: CareerBout) {
  const resA: FightLogEntry["res"] =
    rec.winner === "A" ? "W" : rec.winner === "B" ? "L" : rec.winner === "DRAW" ? "D" : "NC";
  const resB: FightLogEntry["res"] =
    rec.winner === "B" ? "W" : rec.winner === "A" ? "L" : rec.winner === "DRAW" ? "D" : "NC";

  const base = {
    ev: rec.ev,
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

  // record counters
  if (resA === "W") {
    a.w++;
    a[methodSplit(rec.method)]++;
  } else if (resA === "L") a.l++;
  else if (resA === "D") a.d++;
  else a.nc = (a.nc ?? 0) + 1;

  if (resB === "W") {
    b.w++;
    b[methodSplit(rec.method)]++;
  } else if (resB === "L") b.l++;
  else if (resB === "D") b.d++;
  else b.nc = (b.nc ?? 0) + 1;
}

export interface CareerUpdate {
  winnerName: string;
  loserName: string;
  drew: boolean;
}

// call the moment a simulation produces its result — the fight happened,
// so it goes on the books immediately (even if the replay is still animating)
export function recordSimResult(
  a: Fighter,
  b: Fighter,
  sim: { winner: "A" | "B" | "DRAW" | "NC"; method: WinMethod; detail?: string; round: number; time: string },
  spec: SimSpecLite
): CareerUpdate | null {
  if (!a || !b || a.id === b.id) return null;
  const rec: CareerBout = {
    aId: a.id,
    bId: b.id,
    winner: sim.winner,
    method: sim.method,
    detail: sim.detail,
    round: sim.round,
    time: sim.time,
    ev: spec.label.startsWith("Fight Lab") ? "Fight Lab" : spec.label,
    date: todayLabel(),
    wc: boutWeightClass(a, b),
    title: isTitleFight(a, b, spec),
  };
  applyBout(a, b, rec);
  ledger.push(rec);
  save();
  bump();
  const drew = sim.winner === "DRAW" || sim.winner === "NC";
  return {
    winnerName: sim.winner === "A" ? a.name : b.name,
    loserName: sim.winner === "A" ? b.name : a.name,
    drew,
  };
}

// replay the saved universe onto a fresh roster after reload
export function rehydrateCareers(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as CareerBout[];
    if (!Array.isArray(parsed)) return;
    ledger = [];
    for (const rec of parsed) {
      const a = getFighter(rec.aId);
      const b = getFighter(rec.bId);
      if (!a || !b || a.id === b.id) continue; // unknown fighter — skip bout
      applyBout(a, b, rec);
      // belt transfers replay in order too — a champ you dethroned in the
      // Fight Lab stays dethroned after a reload
      maybeTransferBelt(a, b, rec.winner);
      ledger.push(rec);
    }
    save();
    bump();
  } catch {
    ledger = [];
  }
}

export function simBoutsCount(): number {
  return ledger.length;
}

// wipe the sim universe and reload back to the real Oct 2026 history
export function resetCareers(): void {
  ledger = [];
  hydrated = true;
  save();
  if (typeof window !== "undefined") window.location.reload();
}
