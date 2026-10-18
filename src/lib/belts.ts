"use client";

import { useEffect, useState } from "react";
import { Fighter, DivisionId } from "./types";
import { DIVISION_MAP } from "./data";

// ============ DYNAMIC CHAMPIONSHIPS ============
// Champions can LOSE their belts. When a simulated fight ends and an active
// champion of that division is beaten by an active challenger (same weight
// class — no superfights moving belts), the belt transfers instantly and
// every screen re-renders with the new king.

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

export function maybeTransferBelt(
  a: Fighter,
  b: Fighter,
  winner: "A" | "B" | "DRAW" | "NC"
): BeltChange | null {
  if (winner !== "A" && winner !== "B") return null;
  if (a.division !== b.division) return null;
  if (a.status === "retired" || b.status === "retired") return null;
  const champ = a.isChampion ? a : b.isChampion ? b : null;
  if (!champ) return null;
  const win = winner === "A" ? a : b;
  if (win === champ) return null;

  // the crown changes hands
  champ.isChampion = false;
  if (champ.rank == null) champ.rank = 1;
  win.isChampion = true;
  win.rank = null;
  bump();
  return { newChamp: win, oldChamp: champ, div: a.division, divName: DIVISION_MAP[a.division].name };
}
