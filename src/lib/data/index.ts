import { Fighter, DivisionId } from "../types";
import { DIVISIONS, DIVISION_MAP } from "./core";
import { auto, slug } from "./depth";
import prebuilt from "./roster.prebuilt.json";

export { DIVISIONS, DIVISION_MAP } from "./core";

// ============ ROSTER ============
// The full 670-fighter database (champions, rankings, complete UFC-only
// careers, legends, every opponent referenced in any record) is PREBUILT at
// dump time — see /api/roster-dump. Loading the JSON directly means zero
// runtime career generation, which is what makes the app load instantly.
//
// In this universe NOBODY is retired — every legend fights in their prime
// (status normalized to "active" for all 670). The source "retired" flag is
// kept below only to drive the LEGENDS showcase list.
const RAW = (prebuilt as { fighters: Fighter[] }).fighters;
const LEGEND_IDS = new Set(RAW.filter((f) => f.status === "retired").map((f) => f.id));

export const ROSTER: Fighter[] = RAW.map((f) => ({ ...f, status: "active" as const }));

export const FIGHTER_MAP: Record<string, Fighter> = Object.fromEntries(
  ROSTER.map((f) => [f.id, f])
);

// ---------- Alias resolution ----------
// Names that appear in records under a different spelling than the database.
const ALIASES: Record<string, string> = {
  "weili-zhang": "zhang-weili",
  "xiaonan-yan": "yan-xiaonan",
  "korean-zombie": "chan-sung-jung",
  "king-green": "bobby-green",
  "ian-machado-garry": "ian-garry",
};

export function getFighter(id: string): Fighter | undefined {
  return FIGHTER_MAP[id] ?? FIGHTER_MAP[ALIASES[id] ?? ""];
}

// ---------- Ghost registration ----------
// "If you find a fighter in a record that doesn't exist, add them to the
// database." Any opponent name that appears in a bout history but isn't on
// file gets auto-registered here with a deterministic generated profile &
// full career — so every name in every record is clickable.
export const GHOSTS: Fighter[] = [];

export function ensureFighter(name: string, division?: DivisionId): Fighter | undefined {
  const clean = name?.trim();
  if (!clean) return undefined;
  const id = slug(clean);
  const canonical = ALIASES[id] ?? id;
  const existing = FIGHTER_MAP[canonical];
  if (existing) return existing;
  const ghost = auto(division ?? "HW", clean, "US", {});
  ghost.rank = null;
  ghost.status = "active";
  GHOSTS.push(ghost);
  ROSTER.push(ghost);
  FIGHTER_MAP[ghost.id] = ghost;
  return ghost;
}

export function divisionRoster(div: DivisionId): Fighter[] {
  return ROSTER.filter((f) => f.division === div)
    .sort((a, b) => {
      if (a.isChampion && !b.isChampion) return -1;
      if (!a.isChampion && b.isChampion) return 1;
      const ra = a.rank ?? 99;
      const rb = b.rank ?? 99;
      if (ra !== rb) return ra - rb;
      return b.elo - a.elo;
    });
}

// live champion list — recomputed on access so belt transfers (belts.ts)
// are reflected immediately by any re-rendering screen
export function champions(): Fighter[] {
  return ROSTER.filter((f) => f.isChampion);
}

// Legends showcase — HOF icons plus the veteran greats (everyone fights in
// their prime here, "legend" is a showcase label, not a retirement)
export const LEGENDS: Fighter[] = ROSTER.filter((f) => LEGEND_IDS.has(f.id));
export const HOF_ICONS: Fighter[] = ROSTER.filter((f) => f.legend);

export function p4pList(division: "men" | "women"): Fighter[] {
  return ROSTER.filter(
    (f) => DIVISION_MAP[f.division].division === division
  )
    .sort((a, b) => b.elo - a.elo)
    .slice(0, 10);
}

export function searchFighters(
  query: string,
  division?: DivisionId | "all",
  filter?: "all" | "ranked" | "champions" | "legends"
): Fighter[] {
  let list = ROSTER;
  if (division && division !== "all") list = list.filter((f) => f.division === division);
  if (filter === "ranked") list = list.filter((f) => f.isChampion || (f.rank !== null && f.rank <= 15));
  if (filter === "champions") list = list.filter((f) => f.isChampion);
  if (filter === "legends") list = list.filter((f) => LEGEND_IDS.has(f.id));
  const q = query.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.nickname ?? "").toLowerCase().includes(q) ||
        f.country.toLowerCase().includes(q) ||
        (f.team ?? "").toLowerCase().includes(q) ||
        (f.style ?? "").toLowerCase().includes(q)
    );
  }
  return list;
}
