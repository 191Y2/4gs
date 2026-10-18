import { Fighter, DivisionId, FightEvent } from "../types";
import { HW, LHW, MW, MW_EXTRA } from "./roster-men-1";
import { WW, LW } from "./roster-men-2";
import { FW, BW, FLW } from "./roster-men-3";
import { WSW, WFLW, WBW, WOMEN_EXTRA } from "./roster-women";
import { EVENTS, EVENT_FIGHTERS } from "./events";
import { DIVISIONS, DIVISION_MAP } from "./core";
import { HW_LEGENDS, LHW_LEGENDS, MW_LEGENDS } from "./roster-legends";
import { WW_LEGENDS, LW_LEGENDS, FW_LEGENDS, BW_LEGENDS, FLW_LEGENDS } from "./roster-legends-2";
import { WBW_LEGENDS, WFLW_LEGENDS, WSW_LEGENDS } from "./roster-legends-w";
import { HW_DEPTH, LHW_DEPTH, MW_DEPTH } from "./roster-depth-1";
import { WW_DEPTH, LW_DEPTH } from "./roster-depth-2";
import { FW_DEPTH, BW_DEPTH, FLW_DEPTH } from "./roster-depth-3";
import { WBW_DEPTH, WFLW_DEPTH, WSW_DEPTH } from "./roster-depth-w";
import { JONES, JONES_PEERS } from "./roster-jones";
import { FILL_LEGENDS, FILL_MEN, FILL_WOMEN } from "./roster-fill";
import { auto, slug, fillCareer } from "./depth";
import {
  AUTO_HW, AUTO_LHW, AUTO_MW, AUTO_WW, AUTO_LW, AUTO_FW,
  AUTO_BW, AUTO_FLW, AUTO_WBW, AUTO_WFLW, AUTO_WSW,
} from "./roster-auto";

export { DIVISIONS, DIVISION_MAP } from "./core";
export { EVENTS } from "./events";

const RAW_ROSTER: Fighter[] = [
  ...HW, ...LHW, ...MW, ...MW_EXTRA,
  ...WW, ...LW,
  ...FW, ...BW, ...FLW,
  ...WSW, ...WFLW, ...WBW, ...WOMEN_EXTRA,
  ...EVENT_FIGHTERS,
  // legends (Hall of Fame & retired greats — prime-era ratings)
  ...HW_LEGENDS, ...LHW_LEGENDS, ...MW_LEGENDS, ...WW_LEGENDS,
  ...LW_LEGENDS, ...FW_LEGENDS, ...BW_LEGENDS, ...FLW_LEGENDS,
  ...WBW_LEGENDS, ...WFLW_LEGENDS, ...WSW_LEGENDS,
  // depth roster (actives, journeymen & prospects)
  ...HW_DEPTH, ...LHW_DEPTH, ...MW_DEPTH,
  ...WW_DEPTH, ...LW_DEPTH,
  ...FW_DEPTH, ...BW_DEPTH, ...FLW_DEPTH,
  ...WBW_DEPTH, ...WFLW_DEPTH, ...WSW_DEPTH,
  // Jon Bones Jones — complete UFC record — plus his opponents on file
  ...JONES_PEERS, JONES,
  // fill roster — every name referenced across all records becomes a fighter
  ...FILL_LEGENDS, ...FILL_MEN, ...FILL_WOMEN,
  // deep auto roster — every pool name is a fighter with a full career
  ...AUTO_HW, ...AUTO_LHW, ...AUTO_MW, ...AUTO_WW, ...AUTO_LW,
  ...AUTO_FW, ...AUTO_BW, ...AUTO_FLW, ...AUTO_WBW, ...AUTO_WFLW, ...AUTO_WSW,
];

// Deduplicate by id (first occurrence wins) so cross-file name clashes can't break the map
export const ROSTER: Fighter[] = Object.values(
  RAW_ROSTER.reduce<Record<string, Fighter>>((acc, f) => {
    if (!acc[f.id]) acc[f.id] = f;
    return acc;
  }, {})
);

export const FIGHTER_MAP: Record<string, Fighter> = Object.fromEntries(
  ROSTER.map((f) => [f.id, f])
);

// ---------- Complete records for everyone ----------
// Hand-written files log only recent/key bouts — backfill the early career
// so every fighter carries their FULL W-L record bout-by-bout.
for (const f of ROSTER) fillCareer(f);

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
  const ghost = auto(division ?? "HW", clean, "US", { retired: true });
  ghost.rank = null;
  GHOSTS.push(ghost);
  ROSTER.push(ghost);
  FIGHTER_MAP[ghost.id] = ghost;
  return ghost;
}

// Eager pass — sweep every bout history once at load and register any
// straggler opponents up front, so the database is fully closed on day one.
for (const f of ROSTER) {
  for (const e of f.log) {
    const id = slug(e.op);
    if (!FIGHTER_MAP[id] && !FIGHTER_MAP[ALIASES[id] ?? ""]) {
      ensureFighter(e.op, f.division);
    }
  }
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

// Hall-of-Fame icons & retired greats (for the Legends filter & showcases)
export const LEGENDS: Fighter[] = ROSTER.filter((f) => f.status === "retired");
export const HOF_ICONS: Fighter[] = ROSTER.filter((f) => f.legend);

export function p4pList(division: "men" | "women"): Fighter[] {
  return ROSTER.filter(
    (f) => DIVISION_MAP[f.division].division === division && f.status !== "retired"
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
  if (filter === "legends") list = list.filter((f) => f.status === "retired");
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

// Latest completed results ticker (Oct 2026)
export interface TickerItem {
  headline: string;
  detail: string;
  date: string;
}

export const RESULTS_TICKER: TickerItem[] = [
  { headline: "UFC 332 · Natalia Silva def. Wang Cong — UD (49-46, 48-47 x2)", detail: "New Women's Flyweight Champion crowned in Salt Lake City", date: "Oct 3" },
  { headline: "UFC 332 · Payton Talbott KO'd Deiveson Figueiredo — R1 2:09", detail: "Talbott storms into the bantamweight rankings", date: "Oct 3" },
  { headline: "UFC 332 · Esteban Ribovics KO'd King Green — R1 4:08", detail: "Statement win in the lightweight division", date: "Oct 3" },
  { headline: "UFC FN · Brendan Allen sub'd Christian Leroy Duncan — R5 4:52", detail: "Late rear naked choke seals #1 contender push", date: "Oct 10" },
  { headline: "UFC 331 · Ciryl Gane def. Alex Pereira — UD 49-46, 48-47 x2", detail: "Gane claims the undisputed heavyweight crown", date: "Sep 14" },
  { headline: "UFC 331 · Joshua Van KO'd Tatsuro Taira — R2 1:38", detail: "Second title defense for the flyweight king", date: "Sep 12" },
];

export const EVENTS_LIST: FightEvent[] = EVENTS;
