import { Fighter, DivisionId, FightEvent } from "../types";
import { HW, LHW, MW, MW_EXTRA } from "./roster-men-1";
import { WW, LW } from "./roster-men-2";
import { FW, BW, FLW } from "./roster-men-3";
import { WSW, WFLW, WBW, WOMEN_EXTRA } from "./roster-women";
import { EVENTS, EVENT_FIGHTERS } from "./events";
import { DIVISIONS, DIVISION_MAP } from "./core";

export { DIVISIONS, DIVISION_MAP } from "./core";
export { EVENTS } from "./events";

export const ROSTER: Fighter[] = [
  ...HW, ...LHW, ...MW, ...MW_EXTRA,
  ...WW, ...LW,
  ...FW, ...BW, ...FLW,
  ...WSW, ...WFLW, ...WBW, ...WOMEN_EXTRA,
  ...EVENT_FIGHTERS,
];

export const FIGHTER_MAP: Record<string, Fighter> = Object.fromEntries(
  ROSTER.map((f) => [f.id, f])
);

export function getFighter(id: string): Fighter | undefined {
  return FIGHTER_MAP[id];
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

export const CHAMPIONS: Fighter[] = ROSTER.filter((f) => f.isChampion);

export function p4pList(division: "men" | "women"): Fighter[] {
  return ROSTER.filter((f) => DIVISION_MAP[f.division].division === division)
    .sort((a, b) => b.elo - a.elo)
    .slice(0, 10);
}

export function searchFighters(
  query: string,
  division?: DivisionId | "all",
  filter?: "all" | "ranked" | "champions"
): Fighter[] {
  let list = ROSTER;
  if (division && division !== "all") list = list.filter((f) => f.division === division);
  if (filter === "ranked") list = list.filter((f) => f.isChampion || (f.rank !== null && f.rank <= 15));
  if (filter === "champions") list = list.filter((f) => f.isChampion);
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
