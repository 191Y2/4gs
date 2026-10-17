// ============ OCTAGON HQ — Core Types ============

export type DivisionId =
  | "HW" | "LHW" | "MW" | "WW" | "LW" | "FW" | "BW" | "FLW"
  | "WBW" | "WFLW" | "WSW";

export interface Division {
  id: DivisionId;
  name: string;
  shortName: string;
  limit: number; // lbs
  division: "men" | "women";
  color: string; // accent for division chips
}

export type WinMethod = "KO" | "SUB" | "UDEC" | "SDEC" | "MDEC" | "DQ";

export interface FightLogEntry {
  op: string;          // opponent
  ev: string;          // event label
  date: string;        // ISO-ish "Oct 3, 2026"
  res: "W" | "L" | "D" | "NC";
  m: WinMethod;
  det?: string;        // e.g. "Head Kick", "Rear Naked Choke"
  r: number;           // round (0 = N/A)
  t?: string;          // time "2:09"
  title?: " undisputed" | "interim" | "vacant";
  bonus?: "POTN" | "FOTN";
}

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  division: DivisionId;
  rank: number | null; // null = unranked
  isChampion?: boolean;
  country: string;
  cc: string;          // ISO-2 for flagcdn
  height?: string;     // "5'11\""
  reach?: string;      // "74\""
  age?: number;
  team?: string;
  style?: string;
  w: number; l: number; d: number; nc?: number;
  ko: number; sub: number; dec: number; // win method split
  elo: number;         // curated engine rating
  // 0-100 attributes drive the simulator
  str: number;   // striking technique & output
  pow: number;   // knockout power
  wr: number;    // wrestling / takedowns
  gr: number;    // grappling / submission threat
  tdd: number;   // takedown defense
  chin: number;  // durability
  cardio: number; // 5-round stamina
  log: FightLogEntry[];
}

export interface BoutOdds {
  eloA: number;
  eloB: number;
  pA: number;          // 0-1 win probability (the math)
  pB: number;
  oddsA: number;       // American, house line with vig
  oddsB: number;
  fairA: number;       // American, fair line (no vig)
  fairB: number;
}

export interface SimRound {
  round: number;
  text: string;
  aLanded: number;
  bLanded: number;
  finish?: string; // finish narration if fight ends this round
}

export interface SimResult {
  winner: "A" | "B" | "DRAW" | "NC";
  method: WinMethod;
  detail?: string;
  round: number;
  time: string;
  scorecards?: [number, number, number][]; // per judge [a, b]... simplified
  rounds: SimRound[];
  sigStrikesA: number;
  sigStrikesB: number;
}

export type BetStatus = "open" | "won" | "lost" | "void";

export interface Bet {
  id: string;
  bettorFighterId: string;   // fighter user backed
  bettorName: string;
  opponentId: string;
  opponentName: string;
  eventLabel: string;        // "UFC 333 · Volkanovski vs Evloev" or "Fight Lab"
  stake: number;
  odds: number;              // American line at placement
  decOdds: number;
  status: BetStatus;
  placedAt: number;
  settledAt?: number;
  payout?: number;           // profit if won
  methodNote?: string;       // "Won via KO/TKO R2"
}

export interface EventBout {
  aId: string;
  bId: string;
  order: number;
  label?: string;   // "Main Event", "Co-Main", "Main Card", "Prelim"
  title?: string;   // "UFC Featherweight Title"
  rounds: 3 | 5;
  oddsA?: number;   // house line override (real odds where known)
  oddsB?: number;
}

export interface FightEvent {
  id: string;
  name: string;
  tagline?: string;
  date: string;     // "2026-10-18"
  venue: string;
  city: string;
  country: string;
  broadcaster: string;
  bouts: EventBout[];
  status: "upcoming" | "completed";
}
