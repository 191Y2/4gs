"use client";

import { useEffect, useState } from "react";
import { Fighter, DivisionId } from "./types";
import { DIVISION_MAP } from "./data";

// ============ DYNAMIC CHAMPIONSHIPS ============
// Champions can LOSE their belts, and champions can COLLIDE. A same-division
// bout with a reigning champ is a classic title fight; a champ vs champ
// cross-division bout is a SUPERFIGHT with both belts on the line — the
// winner walks away a DOUBLE CHAMP. Belt ownership is tracked per division
// (champOf), so one man can hold two belts at once and drops only the belt
// he loses.

const listeners = new Set<() => void>();
let version = 0;

function bump() {
  version++;
  listeners.forEach((l) => l());
}

export function onBeltsChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function beltsVersion(): number {
  return version;
}

// Drop this hook into any tab that renders champions/crowns — it forces a
// re-render the moment a belt changes hands.
export function useBeltsVersion(): void {
  const [, force] = useState(0);
  useEffect(() => onBeltsChange(() => force((v) => v + 1)), []);
}

export interface BeltChange {
  newChamp: Fighter;
  oldChamp: Fighter;
  div: DivisionId;
  divName: string;
}

// every division whose belt this fighter currently holds
export function champDivisions(f: Fighter): DivisionId[] {
  if (f.champOf && f.champOf.length > 0) return f.champOf;
  return f.isChampion ? [f.division] : [];
}

// champion vs champion from two different divisions — a superfight with
// BOTH titles on the line (same gender only; men's and women's belts never
// cross). Winner becomes a double champ.
export function isSuperfight(a: Fighter, b: Fighter): boolean {
  const beltsA = champDivisions(a);
  const beltsB = champDivisions(b);
  if (beltsA.length === 0 || beltsB.length === 0) return false;
  if (a.division === b.division) return false; // same division = classic title fight
  return DIVISION_MAP[a.division].division === DIVISION_MAP[b.division].division;
}

function setChamp(div: DivisionId, f: Fighter): void {
  const belts = new Set(champDivisions(f));
  belts.add(div);
  f.champOf = [...belts];
  f.isChampion = true;
  f.rank = null;
}

function clearChamp(div: DivisionId, f: Fighter): void {
  const belts = champDivisions(f).filter((d) => d !== div);
  f.champOf = belts;
  if (belts.length === 0) {
    f.isChampion = false;
    if (f.rank == null) f.rank = 1; // placeholder until the standings re-rank
  }
}

// THE belt logic, run the moment a universe bout is decided:
//   • classic title fight (same division, champ beaten) — belt moves
//   • superfight (champ vs champ, cross-division) — EVERY belt the loser
//     holds moves to the winner: the winner leaves as double champ, the
//     loser leaves empty-handed
// Idempotent: replaying the same result (rehydrate) changes nothing.
export function transferBelts(
  a: Fighter,
  b: Fighter,
  winner: "A" | "B" | "DRAW" | "NC"
): BeltChange[] {
  if (winner !== "A" && winner !== "B") return [];
  const win = winner === "A" ? a : b;
  const lose = winner === "A" ? b : a;
  const winBelts = new Set(champDivisions(win));
  const loseBelts = champDivisions(lose);
  const changes: BeltChange[] = [];

  if (isSuperfight(a, b)) {
    // champion vs champion — both titles on the line
    for (const div of loseBelts) {
      if (winBelts.has(div)) continue;
      clearChamp(div, lose);
      setChamp(div, win);
      changes.push({ newChamp: win, oldChamp: lose, div, divName: DIVISION_MAP[div].name });
    }
  } else if (a.division === b.division) {
    // classic title fight — the beaten champ drops the belt
    const div = a.division;
    if (loseBelts.includes(div) && !winBelts.has(div)) {
      clearChamp(div, lose);
      setChamp(div, win);
      changes.push({ newChamp: win, oldChamp: lose, div, divName: DIVISION_MAP[div].name });
    }
  }
  if (changes.length > 0) bump();
  return changes;
}
