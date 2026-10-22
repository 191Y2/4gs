"use client";

import { useEffect, useState } from "react";
import { Fighter, DivisionId } from "./types";
import { DIVISION_MAP, ROSTER } from "./data";

// ============ DYNAMIC CHAMPIONSHIPS — ONE BELT PER FIGHTER ============
// Rules of this universe:
//   • a reigning champ ALWAYS puts his belt on the line — his bouts are
//     contested at his belt's weight class, so a beaten champ always
//     drops the belt to the man who beat him
//   • a champ can chase another division's belt (the user books that
//     fight): champ vs champ = SUPERFIGHT, both belts on the line — the
//     winner takes the loser's belt, and his OWN old belt is immediately
//     VACATED. No double champs, no division held hostage: one man, one
//     belt, always. Men's and women's belts work exactly the same way.
//   • a VACANT belt is won back in the main event / co-main: the top bout
//     of that weight class on the main card becomes the title fight
//     (main event beats co-main; anything deeper on the card is just a
//     fight). Division changes only ever happen through bouts the USER
//     books — never automatically.

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
  newChamp: Fighter | null; // null → the belt was VACATED
  oldChamp: Fighter | null; // null → the belt was vacant (crown claimed)
  div: DivisionId;
  divName: string;
}

// plain-English line for toasts — covers dethronings, vacant crowns and
// automatic vacates
export function beltChangeText(c: BeltChange): string {
  if (!c.newChamp) {
    return `VACATED — ${c.oldChamp ? c.oldChamp.name : "the champ"} gives up the ${c.divName} belt`;
  }
  if (!c.oldChamp) {
    return `NEW CHAMPION! ${c.newChamp.name} claims the vacant ${c.divName} belt`;
  }
  return `NEW CHAMPION! ${c.newChamp.name} dethrones ${c.oldChamp.name} — the ${c.divName} belt changes hands`;
}

// every division whose belt this fighter currently holds
export function champDivisions(f: Fighter): DivisionId[] {
  if (f.champOf && f.champOf.length > 0) return f.champOf;
  return f.isChampion ? [f.division] : [];
}

// true when nobody on the roster holds this division's belt
export function beltVacant(div: DivisionId): boolean {
  return !ROSTER.some((f) => champDivisions(f).includes(div));
}

// champion vs champion — a superfight with BOTH belts on the line (same
// gender only; men's and women's belts never cross). The winner walks out
// with the loser's belt; his own old belt gets vacated.
export function isSuperfight(a: Fighter, b: Fighter): boolean {
  const beltsA = champDivisions(a);
  const beltsB = champDivisions(b);
  if (beltsA.length === 0 || beltsB.length === 0) return false;
  return DIVISION_MAP[a.division].division === DIVISION_MAP[b.division].division;
}

// where a bout is contested. A reigning champ fights at HIS belt's weight —
// the challenger comes to the champ, so the belt is always on the line and
// a beaten champ always drops it (never a weight below his belt). Champ vs
// champ = superfight at the heavier weight. Neither holds a belt → heavier
// weight class (plain cross-division booking / catchweight).
export function boutWeightClass(a: Fighter, b: Fighter): DivisionId {
  if (a.division === b.division) return a.division;
  const sameGender =
    DIVISION_MAP[a.division].division === DIVISION_MAP[b.division].division;
  const beltsA = sameGender ? champDivisions(a) : [];
  const beltsB = sameGender ? champDivisions(b) : [];
  if (beltsA.length > 0 && beltsB.length === 0) return beltsA[0];
  if (beltsB.length > 0 && beltsA.length === 0) return beltsB[0];
  return (DIVISION_MAP[a.division]?.limit ?? 0) >= (DIVISION_MAP[b.division]?.limit ?? 0)
    ? a.division
    : b.division;
}

// is the reigning champ of the bout's weight class one of these two? (For
// a VACANT belt the title fight is decided by card position instead —
// see isVacantCrown in universe.ts: main event / co-main of the vacated
// division.)
export function isTitleBout(a: Fighter, b: Fighter): boolean {
  const wc = boutWeightClass(a, b);
  return champDivisions(a).includes(wc) || champDivisions(b).includes(wc);
}

function setChamp(div: DivisionId, f: Fighter): void {
  const belts = new Set(champDivisions(f));
  belts.add(div);
  f.champOf = [...belts];
  f.isChampion = true;
  f.rank = null;
  // Winning a belt in ANOTHER division moves the fighter's fighting weight
  // to that division (men's ↔ men's, women's ↔ women's). The move only ever
  // happens through a user-booked bout — never automatically.
  if (
    div !== f.division &&
    DIVISION_MAP[div].division === DIVISION_MAP[f.division].division
  ) {
    f.division = div;
  }
}

// drop one belt from a fighter (beaten, or auto-vacated). When the last
// belt goes he drops back into the ranked contenders.
function clearChamp(div: DivisionId, f: Fighter): void {
  const belts = champDivisions(f).filter((d) => d !== div);
  f.champOf = belts;
  if (belts.length === 0) {
    f.isChampion = false;
    if (f.rank == null) f.rank = 1; // placeholder until the standings re-rank
  }
}

// how the UI crowns a champion (healed legacy saves could briefly carry
// 2+ belts; the engine never creates them anymore)
export function beltCountLabel(n: number): string {
  if (n <= 1) return "CHAMPION";
  if (n === 2) return "DOUBLE CHAMP";
  if (n === 3) return "TRIPLE CHAMP";
  if (n === 4) return "QUADRUPLE CHAMP";
  if (n === 5) return "QUINTUPLE CHAMP";
  return `${n}-DIVISION CHAMP`;
}

// THE belt logic, run the moment a universe bout is decided:
//   • non-title bout → nothing moves, ever
//   • beaten champ → his belt goes to the winner
//   • vacant belt (main/co-main crown fight) → the winner takes the throne
//   • superfight (champ vs champ) → the loser's belt goes to the winner,
//     and the belt the winner came in with is VACATED — no double champs
// Whatever happens, the winner walks out holding exactly ONE belt: the one
// he just won. `isTitle` comes from the bout's recorded title flag.
// Idempotent: replaying the same result (rehydrate) changes nothing.
export function transferBelts(
  a: Fighter,
  b: Fighter,
  winner: "A" | "B" | "DRAW" | "NC",
  wc?: DivisionId,
  isTitle = false,
): BeltChange[] {
  if (winner !== "A" && winner !== "B") return [];
  if (!wc || !isTitle) return []; // belts never move outside a title fight
  const win = winner === "A" ? a : b;
  const lose = winner === "A" ? b : a;
  const winBelts = champDivisions(win); // captured BEFORE any mutation
  const loseBelts = champDivisions(lose);
  const changes: BeltChange[] = [];

  if (winBelts.length > 0 && loseBelts.length > 0) {
    // SUPERFIGHT — the loser's belt(s) go to the winner…
    for (const div of loseBelts) {
      clearChamp(div, lose);
      setChamp(div, win);
      changes.push({ newChamp: win, oldChamp: lose, div, divName: DIVISION_MAP[div].name });
    }
    // …and the belt(s) the winner came in with are vacated — no double champs
    for (const div of winBelts) {
      if (loseBelts.includes(div)) continue;
      clearChamp(div, win);
      changes.push({ newChamp: null, oldChamp: win, div, divName: DIVISION_MAP[div].name });
    }
    // one belt per fighter on the way out (healed legacy multi-belt saves)
    const keep = loseBelts.includes(wc) ? wc : loseBelts[0];
    for (const div of champDivisions(win)) {
      if (div === keep) continue;
      clearChamp(div, win);
      changes.push({ newChamp: null, oldChamp: win, div, divName: DIVISION_MAP[div].name });
    }
  } else {
    if (loseBelts.includes(wc)) {
      // classic title fight — the beaten champ drops the belt to the winner
      clearChamp(wc, lose);
      setChamp(wc, win);
      changes.push({ newChamp: win, oldChamp: lose, div: wc, divName: DIVISION_MAP[wc].name });
    } else if (beltVacant(wc)) {
      // vacant crown — the main/co-main winner takes the empty throne
      setChamp(wc, win);
      changes.push({ newChamp: win, oldChamp: null, div: wc, divName: DIVISION_MAP[wc].name });
    }
    // if the winner came in carrying other belts they're vacated — ONE
    // belt per fighter, the one he just won
    for (const div of winBelts) {
      if (div === wc) continue;
      clearChamp(div, win);
      changes.push({ newChamp: null, oldChamp: win, div, divName: DIVISION_MAP[div].name });
    }
  }

  if (changes.length > 0) bump();
  return changes;
}
