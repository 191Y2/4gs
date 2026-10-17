import { Fighter, DivisionId, FightLogEntry, Division } from "../types";

// ---------- Divisions ----------
export const DIVISIONS: Division[] = [
  { id: "HW", name: "Heavyweight", shortName: "HW", limit: 265, division: "men", color: "#F43F5E" },
  { id: "LHW", name: "Light Heavyweight", shortName: "LHW", limit: 205, division: "men", color: "#FB7185" },
  { id: "MW", name: "Middleweight", shortName: "MW", limit: 185, division: "men", color: "#F97316" },
  { id: "WW", name: "Welterweight", shortName: "WW", limit: 170, division: "men", color: "#EAB308" },
  { id: "LW", name: "Lightweight", shortName: "LW", limit: 155, division: "men", color: "#84CC16" },
  { id: "FW", name: "Featherweight", shortName: "FW", limit: 145, division: "men", color: "#22C55E" },
  { id: "BW", name: "Bantamweight", shortName: "BW", limit: 135, division: "men", color: "#06B6D4" },
  { id: "FLW", name: "Flyweight", shortName: "FLW", limit: 125, division: "men", color: "#3B82F6" },
  { id: "WBW", name: "Women's Bantamweight", shortName: "WBW", limit: 135, division: "women", color: "#A855F7" },
  { id: "WFLW", name: "Women's Flyweight", shortName: "W-FLW", limit: 125, division: "women", color: "#D946EF" },
  { id: "WSW", name: "Women's Strawweight", shortName: "W-SW", limit: 115, division: "women", color: "#EC4899" },
];

export const DIVISION_MAP: Record<DivisionId, Division> = Object.fromEntries(
  DIVISIONS.map((d) => [d.id, d])
) as Record<DivisionId, Division>;

// ---------- Fighter builder ----------
export function f(
  division: DivisionId,
  rank: number,
  name: string,
  nickname: string | null,
  cc: string,
  w: number,
  l: number,
  d: number,
  ko: number,
  sub: number,
  age: number,
  height: string,
  reach: string,
  team: string,
  style: string,
  elo: number,
  str: number,
  pow: number,
  wr: number,
  gr: number,
  tdd: number,
  chin: number,
  cardio: number,
  log: FightLogEntry[]
): Fighter {
  const dec = Math.max(0, w - ko - sub);
  return {
    id: slug(name),
    name,
    nickname: nickname ?? undefined,
    division,
    rank: rank === 0 ? null : rank >= 99 ? null : rank,
    isChampion: rank === 0,
    country: countryName(cc),
    cc,
    height,
    reach,
    age,
    team,
    style,
    w, l, d,
    ko, sub, dec,
    elo,
    str, pow, wr, gr, tdd, chin, cardio,
    log,
  };
}

// log entry builder — L(opponent, event, date, result, method, round, time?, detail?, title?, bonus?)
export function L(
  op: string,
  ev: string,
  date: string,
  res: "W" | "L" | "D" | "NC",
  m: FightLogEntry["m"],
  r: number,
  t?: string,
  det?: string,
  title?: FightLogEntry["title"],
  bonus?: FightLogEntry["bonus"]
): FightLogEntry {
  return { op, ev, date, res, m, r, t, det, title, bonus };
}

export function slug(name: string): string {
  return name.toLowerCase().replace(/[.']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const CC_NAMES: Record<string, string> = {
  US: "United States", BR: "Brazil", RU: "Russia", FR: "France", GB: "United Kingdom",
  AU: "Australia", CA: "Canada", NZ: "New Zealand", IE: "Ireland", MX: "Mexico",
  JP: "Japan", CN: "China", KR: "South Korea", KZ: "Kazakhstan", UZ: "Uzbekistan",
  GE: "Georgia", AM: "Armenia", AZ: "Azerbaijan", UA: "Ukraine", PL: "Poland",
  DE: "Germany", NL: "Netherlands", SE: "Sweden", FI: "Finland", DK: "Denmark",
  NO: "Norway", CZ: "Czechia", HR: "Croatia", RS: "Serbia", MD: "Moldova",
  LT: "Lithuania", ES: "Spain", PT: "Portugal", IT: "Italy", IL: "Israel",
  ZA: "South Africa", NG: "Nigeria", CM: "Cameroon", MA: "Morocco", DZ: "Algeria",
  EG: "Egypt", TN: "Tunisia", IQ: "Iraq", IR: "Iran", TR: "Turkey", AE: "UAE",
  SA: "Saudi Arabia", KG: "Kyrgyzstan", TJ: "Tajikistan", IN: "India", PH: "Philippines",
  TH: "Thailand", ID: "Indonesia", MM: "Myanmar", EC: "Ecuador", PE: "Peru",
  CO: "Colombia", VE: "Venezuela", PA: "Panama", CR: "Costa Rica", CU: "Cuba",
  DO: "Dominican Republic", JM: "Jamaica", HT: "Haiti", AR: "Argentina", CL: "Chile",
  BO: "Bolivia", PY: "Paraguay", UY: "Uruguay", IS: "Iceland", CH: "Switzerland",
  AT: "Austria", BE: "Belgium", GR: "Greece", HU: "Hungary", RO: "Romania",
  BG: "Bulgaria", SK: "Slovakia", SI: "Slovenia", BA: "Bosnia", EE: "Estonia",
  LV: "Latvia", BY: "Belarus", ET: "Ethiopia", KE: "Kenya", SN: "Senegal",
  CI: "Ivory Coast", GH: "Ghana", AO: "Angola", NA: "Namibia", ZW: "Zimbabwe",
  ZM: "Zambia", MW: "Malawi", NP: "Nepal", PK: "Pakistan", BD: "Bangladesh",
  LK: "Sri Lanka", VN: "Vietnam", MY: "Malaysia", SG: "Singapore", TW: "Taiwan",
  HK: "Hong Kong", MO: "Macau", MN: "Mongolia",
};

export function countryName(cc: string): string {
  return CC_NAMES[cc] ?? cc;
}
