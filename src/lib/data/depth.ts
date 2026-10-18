import { Fighter, DivisionId, FightLogEntry } from "../types";
import { f, slug } from "./core";

// ============ DEPTH ROSTER GENERATOR ============
// Builds journeymen, prospects & deep-roster fighters from compact specs.
// Every fighter gets a FULL UFC career log (all their W/L fights), with
// weight class, method, round, event & date per bout.
// IMPORTANT: fully deterministic (seeded by name) so server & client
// render identical bout histories — no hydration mismatches.

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a) >>> 0;
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// str, pow, wr, gr, tdd, chin, cardio modifiers per style archetype
const STYLE_ATTRS: Record<string, [number, number, number, number, number, number, number]> = {
  Wrestler:   [-2, -4, 24, 12, 18, 6, 8],
  Grappler:   [-4, -6, 12, 26, 8, 6, 10],
  BJJ:        [-6, -8, 4, 28, 6, 8, 10],
  Striker:    [18, 16, -8, -10, -2, 6, 4],
  Kickboxer:  [20, 14, -10, -12, -4, 6, 4],
  Boxer:      [22, 18, -12, -14, -6, 8, 2],
  Brawler:    [10, 24, -14, -12, -8, 12, 4],
  Sambo:      [6, 4, 14, 16, 10, 8, 8],
  MMA:        [8, 6, 8, 8, 8, 8, 8],
  Karate:     [16, 8, -10, -12, -2, 4, 6],
  Taekwondo:  [16, 10, -12, -14, -4, 4, 4],
  "Muay Thai": [18, 12, -4, -6, 0, 8, 6],
  Judo:       [-2, -2, 18, 18, 12, 6, 8],
};
const STYLE_KEYS = Object.keys(STYLE_ATTRS);

function clampAttr(v: number): number {
  return Math.max(20, Math.min(96, Math.round(v)));
}

const KO_DETAILS = [
  "Right Hand", "Left Hook", "Overhand Right", "Punches", "Head Kick", "Ground & Pound",
  "Elbows", "Flying Knee", "Uppercut", "Spinning Back Fist", "Counter Right", "Hook Kick", "Liver Kick",
];
const SUB_DETAILS = [
  "Rear Naked Choke", "Armbar", "Guillotine", "Triangle Choke", "Arm-Triangle", "D'Arce Choke",
  "Kimura", "Heel Hook", "Kneebar", "Anaconda Choke", "Face Crank", "Von Flue Choke",
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// numbered-event ranges per year (approximate real UFC numbering)
const NUMBERED: Record<number, [number, number]> = {
  2005: [52, 58], 2006: [57, 66], 2007: [65, 79], 2008: [80, 92],
  2009: [92, 107], 2010: [108, 124], 2011: [125, 140], 2012: [139, 155],
  2013: [156, 168], 2014: [169, 182], 2015: [182, 194], 2016: [195, 207],
  2017: [208, 219], 2018: [220, 232], 2019: [233, 245], 2020: [246, 256],
  2021: [257, 269], 2022: [270, 283], 2023: [284, 296], 2024: [297, 307],
  2025: [308, 320], 2026: [321, 333],
};

function eventLabel(r: () => number, year: number): string {
  const roll = r();
  if (roll < 0.5) return "UFC Fight Night";
  if (roll < 0.62) {
    // era-appropriate broadcast partnerships
    if (year >= 2019) return "UFC on ESPN";
    if (year >= 2013) return "UFC on FOX";
    if (year >= 2012) return "UFC on FX";
    if (year >= 2011) return "UFC on Versus";
    if (year >= 2007) return "UFC Fight Night";
    return "UFC Fight Night";
  }
  const [lo, hi] = NUMBERED[year] ?? [321, 333];
  return `UFC ${lo + Math.floor(r() * (hi - lo + 1))}`;
}

function roundTime(r: () => number): string {
  const m = Math.floor(r() * 5);
  const s = Math.floor(r() * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Deterministic FULL career synthesis — every W/L fight on record gets a log
// entry: opponent, event, date, result, method, round, time, weight class,
// title status & bonuses. Career arcs push title shots for elite ratings.
function genLog(
  name: string,
  div: DivisionId,
  w: number,
  l: number,
  ko: number,
  sub: number,
  elo: number,
  retired: boolean,
  age: number
): FightLogEntry[] {
  const r = mulberry32(hashStr(name + "::career"));
  const total = Math.min(w + l, 30);
  if (total < 1) return [];
  const scale = total / (w + l);
  let winsLeft = Math.max(1, Math.round(w * scale));
  let lossesLeft = Math.max(0, total - winsLeft);

  const pool = POOLS[div];
  const used = new Set<string>();
  const entries: FightLogEntry[] = [];

  // career end anchor: actives end ~mid-2026, retirees end years back
  const lastAbs =
    retired
      ? 12 * Math.max(2004, 2026 - Math.max(1, Math.round((age - 34) * 0.9 + r() * 3))) + Math.floor(r() * 12)
      : 12 * 2026 + (3 + Math.floor(r() * 7)); // Apr–Oct 2026

  // walk the whole career chronologically
  let monthsBack = Math.round(total * 4.2) + 2 + Math.floor(r() * 10);

  // title arc for elite fighters
  const eliteShot = elo >= 1650;
  const championish = elo >= 1750;
  const shotIdx = eliteShot && !championish ? Math.floor(total * (0.55 + r() * 0.3)) : -1;
  const reignStart = championish ? Math.floor(total * 0.5) : -1;
  const defenses = reignStart >= 0 ? 2 + Math.floor(r() * 3) : 0;

  for (let i = 0; i < total; i++) {
    const isTitle =
      i === shotIdx ||
      (reignStart >= 0 && i >= reignStart && i - reignStart <= defenses);

    // decide result without replacement (keeps record exact)
    let isWin: boolean;
    if (reignStart >= 0 && i === reignStart) isWin = true;
    else if (reignStart >= 0 && i > reignStart && i - reignStart <= defenses) isWin = r() < 0.8;
    else if (i === shotIdx) isWin = r() < 0.35;
    else if (winsLeft + lossesLeft > 0) isWin = r() < winsLeft / (winsLeft + lossesLeft);
    else isWin = false;
    if (isWin) winsLeft = Math.max(0, winsLeft - 1);
    else lossesLeft = Math.max(0, lossesLeft - 1);

    // opponent — unique where the pool allows
    let op = pool[Math.floor(r() * pool.length)] ?? "Journeyman";
    let guard = 0;
    while (used.has(op) && guard++ < 8) op = pool[Math.floor(r() * pool.length)] ?? op;
    used.add(op);

    // method & round
    let m: FightLogEntry["m"];
    let det: string | undefined;
    let rd: number;
    let t: string | undefined;
    if (isWin) {
      const dec = Math.max(0, w - ko - sub);
      const roll = r() * Math.max(1, w);
      if (roll < ko * scale || (roll < ko && ko * scale < 1)) {
        m = "KO"; det = KO_DETAILS[Math.floor(r() * KO_DETAILS.length)];
        rd = r() < 0.35 ? 1 : r() < 0.72 ? 2 : isTitle ? 3 + Math.floor(r() * 2) : 3;
        t = roundTime(r);
      } else if (roll < (ko + sub) * scale || roll < ko + sub) {
        m = "SUB"; det = SUB_DETAILS[Math.floor(r() * SUB_DETAILS.length)];
        rd = r() < 0.3 ? 1 : r() < 0.7 ? 2 : isTitle ? 3 + Math.floor(r() * 2) : 3;
        t = roundTime(r);
      } else {
        m = r() < 0.82 ? "UDEC" : r() < 0.94 ? "SDEC" : "MDEC";
        void dec;
        rd = isTitle ? 5 : 3;
        t = "5:00";
      }
    } else {
      const roll = r();
      if (roll < 0.42) {
        m = "KO"; det = KO_DETAILS[Math.floor(r() * KO_DETAILS.length)];
        rd = r() < 0.4 ? 1 : r() < 0.75 ? 2 : 3;
        t = roundTime(r);
      } else if (roll < 0.58) {
        m = "SUB"; det = SUB_DETAILS[Math.floor(r() * SUB_DETAILS.length)];
        rd = r() < 0.35 ? 1 : 2;
        t = roundTime(r);
      } else if (roll < 0.995) {
        m = r() < 0.85 ? "UDEC" : "SDEC";
        rd = isTitle ? 5 : 3;
        t = "5:00";
      } else {
        m = "DQ"; det = "Illegal Strikes";
        rd = 1;
        t = roundTime(r);
      }
    }

    // date
    const abs = lastAbs - monthsBack;
    const year = Math.floor(abs / 12);
    const monthIdx = ((abs % 12) + 12) % 12;
    const date = `${MONTHS[monthIdx]} ${Math.max(2005, year)}`;

    // title flag
    let title: FightLogEntry["title"];
    if (isTitle) {
      if (reignStart >= 0 && i === reignStart) title = r() < 0.3 ? "V" : "T";
      else if (i === shotIdx) title = "T";
      else title = "T";
    }

    const bonus =
      isWin && (m === "KO" || m === "SUB") && r() < 0.15
        ? "POTN"
        : isWin && isTitle && (m === "UDEC" || m === "SDEC") && r() < 0.3
          ? "FOTN"
          : undefined;

    entries.push({
      op,
      ev: eventLabel(r, Math.max(2005, year)),
      date,
      res: isWin ? "W" : "L",
      m,
      r: rd,
      t,
      det,
      title,
      bonus,
      wc: div,
    });

    monthsBack -= 3 + Math.floor(r() * 4);
    if (r() < 0.07) monthsBack -= 8 + Math.floor(r() * 6); // injury layoff
    if (monthsBack < 1) monthsBack = 1 + Math.floor(r() * 3);
  }

  return entries; // oldest first, like the hand-written files
}

export interface DepthOpts {
  retired?: boolean;
  legend?: boolean;
}

// fillCareer — hand-written roster files only log a fighter's recent/key
// bouts. This prepends the missing earlier career so every fighter's log
// covers their FULL W-L record. Existing hand-written entries are never
// touched; the synthesized history is deterministic (seeded by name) and
// lands strictly before the earliest logged fight.
export function fillCareer(f: Fighter): void {
  if (f.id === "jon-jones") return; // UFC-only log by design (28-1 includes 6 pre-UFC wins)
  const target = Math.min(f.w + f.l, 30);
  let need = target - f.log.length;
  if (need <= 0) return;

  // W/L still unaccounted for
  const winsIn = f.log.filter((e) => e.res === "W").length;
  const lossesIn = f.log.filter((e) => e.res === "L").length;
  let wins = Math.max(0, f.w - winsIn);
  let losses = Math.max(0, f.l - lossesIn);
  const have = wins + losses;
  if (have > need) {
    const s = need / have;
    const w2 = Math.floor(wins * s);
    losses = Math.min(need - w2, Math.round(losses * s));
    wins = need - losses;
  } else if (have < need) {
    losses += need - wins - losses;
  }
  if (wins < 0) wins = 0;
  if (losses < 0) losses = 0;

  const r = mulberry32(hashStr(f.name + "::backfill"));
  const pool = POOLS[f.division];
  const used = new Set(f.log.map((e) => e.op));
  const entries: FightLogEntry[] = [];

  // anchor: just before the earliest logged bout (or mid-2024)
  const earliest = dateToAbs(f.log[0]?.date) ?? 12 * 2024 + 6;
  let monthsBack = Math.round(need * 4.2) + 2 + Math.floor(r() * 8);

  for (let i = 0; i < need; i++) {
    const total = wins + losses;
    const isWin = total > 0 ? r() < wins / total : false;
    if (isWin) wins = Math.max(0, wins - 1);
    else losses = Math.max(0, losses - 1);

    let op = pool[Math.floor(r() * pool.length)] ?? "Journeyman";
    let guard = 0;
    while (used.has(op) && guard++ < 8) op = pool[Math.floor(r() * pool.length)] ?? op;
    used.add(op);

    let m: FightLogEntry["m"];
    let det: string | undefined;
    let rd: number;
    let t: string | undefined;
    if (isWin) {
      const roll = r() * Math.max(1, f.w);
      if (roll < f.ko) {
        m = "KO"; det = KO_DETAILS[Math.floor(r() * KO_DETAILS.length)];
        rd = r() < 0.35 ? 1 : r() < 0.72 ? 2 : 3;
        t = roundTime(r);
      } else if (roll < f.ko + f.sub) {
        m = "SUB"; det = SUB_DETAILS[Math.floor(r() * SUB_DETAILS.length)];
        rd = r() < 0.3 ? 1 : r() < 0.7 ? 2 : 3;
        t = roundTime(r);
      } else {
        m = r() < 0.82 ? "UDEC" : r() < 0.94 ? "SDEC" : "MDEC";
        rd = 3;
        t = "5:00";
      }
    } else {
      const roll = r();
      if (roll < 0.42) {
        m = "KO"; det = KO_DETAILS[Math.floor(r() * KO_DETAILS.length)];
        rd = r() < 0.4 ? 1 : r() < 0.75 ? 2 : 3;
        t = roundTime(r);
      } else if (roll < 0.58) {
        m = "SUB"; det = SUB_DETAILS[Math.floor(r() * SUB_DETAILS.length)];
        rd = r() < 0.35 ? 1 : 2;
        t = roundTime(r);
      } else {
        m = r() < 0.85 ? "UDEC" : "SDEC";
        rd = 3;
        t = "5:00";
      }
    }

    const abs = earliest - monthsBack;
    const year = Math.max(1994, Math.floor(abs / 12));
    const monthIdx = ((abs % 12) + 12) % 12;

    entries.push({
      op,
      ev: eventLabel(r, year),
      date: `${MONTHS[monthIdx]} ${year}`,
      res: isWin ? "W" : "L",
      m,
      r: rd,
      t,
      det,
      wc: f.division,
      bonus: isWin && (m === "KO" || m === "SUB") && r() < 0.12 ? "POTN" : undefined,
    });

    monthsBack -= 3 + Math.floor(r() * 4);
    if (r() < 0.07) monthsBack -= 8 + Math.floor(r() * 6);
    if (monthsBack < 1) monthsBack = 1 + Math.floor(r() * 3);
  }

  // monthsBack starts large and shrinks, so entries[0] is the OLDEST bout and
  // the last entry lands just before the earliest hand-written fight — prepend
  // directly for a clean chronological record.
  f.log = [...entries, ...f.log];
}

// "Mar 19, 2011" → absolute month index (12*year + month)
function dateToAbs(date: string | undefined): number | undefined {
  if (!date) return undefined;
  const match = /^([A-Za-z]{3})\s+\d{1,2},\s*(\d{4})$/.exec(date);
  if (!match) return undefined;
  const mi = MONTHS.indexOf(match[1]);
  const yi = parseInt(match[2], 10);
  if (mi < 0 || isNaN(yi)) return undefined;
  return 12 * yi + mi;
}

// d() — compact depth fighter builder.
// d(div, rank, name, nick, cc, w, l, dr, ko, sub, age, height, reach, team, style, elo, opts?)
export function d(
  div: DivisionId,
  rank: number,
  name: string,
  nick: string | null,
  cc: string,
  w: number,
  l: number,
  dr: number,
  ko: number,
  sub: number,
  age: number,
  height: string,
  reach: string,
  team: string,
  style: string,
  elo: number,
  opts?: DepthOpts
): Fighter {
  const r = mulberry32(hashStr(name));
  const base = Math.max(14, Math.min(80, (elo - 1350) / 4.6));
  const mods = STYLE_ATTRS[style] ?? STYLE_ATTRS.MMA;
  const jit = () => (r() * 9 - 4.5);
  const retired = !!opts?.retired;
  const log = genLog(name, div, w, l, ko, sub, elo, retired, age);
  const fighter = f(
    div, rank, name, nick, cc, w, l, dr, ko, sub, age, height, reach, team, style, elo,
    clampAttr(base + mods[0] + jit()),
    clampAttr(base + mods[1] + jit()),
    clampAttr(base + mods[2] + jit()),
    clampAttr(base + mods[3] + jit()),
    clampAttr(base + mods[4] + jit()),
    clampAttr(base + mods[5] + jit()),
    clampAttr(base + mods[6] + jit()),
    log
  );
  if (retired) fighter.status = "retired";
  if (opts?.legend) fighter.legend = true;
  return fighter;
}

// auto() — full auto-built fighter from just name + country (deterministic).
// Used for the deep depth roster and for on-demand ghost registration of any
// opponent that appears in a record but isn't in the database yet.
export function auto(
  div: DivisionId,
  name: string,
  cc: string,
  opts?: { retired?: boolean }
): Fighter {
  const r = mulberry32(hashStr(name + "::auto"));
  const w = 4 + Math.floor(r() * 13);
  const l = 2 + Math.floor(r() * 8);
  const ko = Math.round(w * (0.2 + r() * 0.5));
  const sub = Math.round(Math.max(0, w - ko) * (0.1 + r() * 0.45));
  const age = 25 + Math.floor(r() * 13);
  const elo = 1370 + Math.floor(r() * 250);
  const style = STYLE_KEYS[Math.floor(r() * STYLE_KEYS.length)];
  const [height, reach] = tapeFor(div, r);
  const team = TEAMS[Math.floor(r() * TEAMS.length)];
  return d(div, 99, name, null, cc, w, l, 0, ko, sub, age, height, reach, team, style, elo, {
    retired: opts?.retired,
  });
}

const TEAMS = [
  "Jackson Wink MMA", "American Top Team", "AKA", "Tiger Muay Thai", "SBG Ireland",
  "Tristar Gym", "Kill Cliff FC", "Team Alpha Male", "Elevation Fight Team", "MMA Factory",
  "Syndicate MMA", "Xtreme Couture", "Fighting Nerds", "Checkmat", "Team Nogueira",
  "Gracie Barra", "ATT Coconut Creek", "Tiger Muay Thai", "Hard Knocks 365", "Combat Club",
];

function tapeFor(div: DivisionId, r: () => number): [string, string] {
  const h = (min: number, max: number) => {
    const ft = min + Math.floor(r() * (max - min + 1));
    const inch = Math.floor(r() * 12);
    return `${ft}'${inch}"`;
  };
  const rc = (min: number, max: number) => `${min + Math.floor(r() * (max - min + 1))}"`;
  switch (div) {
    case "HW": return [h(6, 6), rc(76, 84)];
    case "LHW": return [h(6, 6), rc(73, 80)];
    case "MW": return [h(5, 6), rc(72, 79)];
    case "WW": return [h(5, 6), rc(69, 77)];
    case "LW": return [h(5, 6), rc(68, 75)];
    case "FW": return [h(5, 5), rc(67, 74)];
    case "BW": return [h(5, 5), rc(64, 70)];
    case "FLW": return [h(5, 5), rc(62, 68)];
    default: return [h(5, 5), rc(63, 70)];
  }
}

// lg() — hand-crafted legend: f() + retired/legend flags.
export function lg(
  div: DivisionId,
  rank: number,
  name: string,
  nick: string | null,
  cc: string,
  w: number,
  l: number,
  dr: number,
  ko: number,
  sub: number,
  nc: number,
  age: number,
  height: string,
  reach: string,
  team: string,
  style: string,
  elo: number,
  str: number, pow: number, wr: number, gr: number, tdd: number, chin: number, cardio: number,
  log: FightLogEntry[]
): Fighter {
  const fighter = f(div, rank, name, nick, cc, w, l, dr, ko, sub, age, height, reach, team, style, elo,
    str, pow, wr, gr, tdd, chin, cardio, log);
  fighter.status = "retired";
  fighter.legend = true;
  if (nc) fighter.nc = nc;
  return fighter;
}

// ret() — hand-crafted retired vet (no HOF badge).
export function ret(...args: Parameters<typeof lg>): Fighter {
  const fighter = lg(...args);
  fighter.legend = false;
  return fighter;
}

// ---------- AUTO ROSTER POOLS ----------
// [name, country-code]. Every one of these becomes a real database fighter
// with a full generated UFC career — and they also serve as the opponent
// pool for synthesized records, so every name in every record resolves.
export const AUTO_POOL: Record<DivisionId, [string, string][]> = {
  HW: [
    ["Karl Williams", "US"], ["Mick Parkin", "GB"], ["Blagoy Ivanov", "BG"], ["Rodrigo Nascimento", "BR"],
    ["Marcin Tybura", "PL"], ["Mohammed Usman", "US"], ["Justin Tafa", "NZ"], ["Austen Lane", "US"],
    ["Don'Tale Mayes", "US"], ["Alexandr Romanov", "MD"], ["Marcos Rogério de Lima", "BR"], ["Augusto Sakai", "BR"],
    ["Chase Sherman", "US"], ["Jake Collier", "US"], ["Josh Parisian", "US"], ["Parker Porter", "US"],
    ["Yorgan De Castro", "CV"], ["Jared Vanderaa", "US"], ["Walt Harris", "US"], ["Chris Daukaus", "US"],
    ["Tanner Boser", "CA"], ["Hamdy Abdelwahab", "EG"], ["Tallison Teixeira", "BR"], ["Anton Turkalj", "SE"],
    ["Denis Goltsov", "RU"], ["Junior Tafa", "NZ"], ["Thomas Peterson", "US"], ["Rizvan Kuniev", "RU"],
    ["Mario Pinto", "PT"], ["Michael Johnson", "US"],
  ],
  LHW: [
    ["Ryan Spann", "US"], ["Johnny Walker", "BR"], ["Volkan Oezdemir", "CH"], ["Paul Craig", "GB"],
    ["Jimmy Crute", "AU"], ["Ion Cuțelaba", "MD"], ["Da Un Jung", "KR"], ["Misha Cirkunov", "LV"],
    ["Ovince Saint Preux", "US"], ["Ibo Aslan", "TR"], ["Caio Machado", "BR"], ["Gian Villante", "US"],
    ["Ed Herman", "US"], ["Modestas Bukauskas", "LT"], ["Vitor Petrino", "BR"], ["Zhang Mingyang", "CN"],
    ["Navajo Stirling", "NZ"], ["Bogdan Guskov", "UA"], ["Azamat Murzakanov", "RU"], ["Khalil Rountree", "US"],
    ["Oumar Sy", "FR"], ["Bruno Lopes", "BR"],
  ],
  MW: [
    ["Jared Cannonier", "US"], ["Jack Hermansson", "NO"], ["Marvin Vettori", "IT"], ["Shara Magomedov", "RU"],
    ["Brunno Ferreira", "BR"], ["Rodolfo Vieira", "BR"], ["Jun Yong Park", "KR"], ["Eryk Anders", "US"],
    ["Brad Tavares", "US"], ["Jacob Malkoun", "AU"], ["Derek Brunson", "US"], ["Uriah Hall", "JM"],
    ["Armen Petrosyan", "IT"], ["Denis Tiuliulin", "RU"], ["Cody Brundage", "US"], ["Roman Kopylov", "RU"],
    ["Sam Alvey", "US"], ["Kyle Daukaus", "US"], ["Kelvin Gastelum", "MX"], ["Nassourdine Imavov", "FR"],
    ["Michel Pereira", "BR"], ["Roman Dolidze", "GE"], ["Anthony Hernandez", "US"], ["Ikram Aliskerov", "RU"],
    ["Abus Magomedov", "RU"], ["Gerald Meerschaert", "US"], ["Andre Petroski", "US"], ["Reinier de Ridder", "NL"],
  ],
  WW: [
    ["Gilbert Burns", "BR"], ["Vicente Luque", "BR"], ["Neil Magny", "US"], ["Geoff Neal", "US"],
    ["Randy Brown", "JM"], ["Michael Chiesa", "US"], ["Bryan Barberena", "US"], ["Gunnar Nelson", "IS"],
    ["Santiago Ponzinibbio", "AR"], ["Oban Elliott", "GB"], ["Themba Gorimbo", "ZW"], ["Alex Morono", "US"],
    ["Matt Brown", "US"], ["Kevin Lee", "US"], ["Mike Malott", "CA"], ["Mounir Lazzez", "TN"],
    ["Billy Goff", "US"], ["Khaos Williams", "US"], ["AJ Fletcher", "US"], ["Dhiego Lima", "BR"],
    ["Sean Brady", "US"], ["Colby Covington", "US"], ["Kevin Holland", "US"],
    ["Daniel Rodriguez", "US"], ["Song Kenan", "CN"], ["Bryan Battle", "US"], ["Carlos Prates", "BR"],
    ["Gabriel Bonfim", "BR"],
  ],
  LW: [
    ["Jalin Turner", "US"], ["Jim Miller", "US"], ["Drew Dober", "US"], ["Bobby Green", "US"],
    ["Nasrat Haqparast", "DE"], ["Joel Alvarez", "ES"], ["Thiago Moisés", "BR"], ["Damir Ismagulov", "RU"],
    ["Mateusz Rebecki", "PL"], ["Rafa García", "MX"], ["Drakkar Klose", "US"], ["Jamie Mullarkey", "AU"],
    ["Ludovit Klein", "SK"], ["Ignacio Bahamondes", "CL"], ["Alexander Hernandez", "US"], ["Fares Ziam", "FR"],
    ["Terrance McKinney", "US"], ["John Makdessi", "CA"], ["Charlie Campbell", "US"], ["Trevor Peek", "US"],
    ["Kurt Holobaugh", "US"], ["Natan Levy", "IL"], ["Evan Elder", "US"], ["Joe Lowdon", "GB"],
    ["Rick Glenn", "US"], ["Dan Hooker", "NZ"], ["Mateusz Gamrot", "PL"], ["Renato Moicano", "BR"],
    ["Beneil Dariush", "IR"], ["Rafael Fiziev", "KZ"], ["Grant Dawson", "US"], ["Marc Diakiese", "GB"],
    ["Joaquim Silva", "BR"], ["Sam Patterson", "GB"], ["Maurício Ruffy", "BR"],
  ],
  FW: [
    ["Dan Ige", "US"], ["Josh Emmett", "US"], ["Giga Chikadze", "GE"], ["Alex Caceres", "US"],
    ["Julian Erosa", "US"], ["Sean Woodson", "US"], ["Bill Algeo", "US"], ["Darren Elkins", "US"],
    ["Ryan Hall", "US"], ["Ricardo Lamas", "US"], ["Dennis Bermudez", "US"], ["Shane Burgos", "US"],
    ["Doo Ho Choi", "KR"], ["Edson Barboza", "BR"], ["Sodiq Yusuff", "NG"], ["Hakeem Dawodu", "CA"],
    ["Christian Rodriguez", "US"], ["Andre Fili", "US"], ["Jack Shore", "GB"], ["David Onama", "CM"],
    ["Pat Sabatini", "US"], ["Damon Jackson", "US"], ["Jeong Yeong Lee", "KR"], ["Chase Hooper", "US"],
    ["Enrique Barzola", "PE"], ["Yair Rodríguez", "MX"], ["Diego Lopes", "BR"], ["Brian Ortega", "US"],
    ["Arnold Allen", "GB"], ["Movsar Evloev", "RU"], ["Calvin Kattar", "US"], ["Joanderson Brito", "BR"],
    ["Jean Silva", "BR"], ["Steve Garcia", "US"],
  ],
  BW: [
    ["Rob Font", "US"], ["Adrian Yanez", "US"], ["Jonathan Martinez", "US"], ["Ricky Simón", "US"],
    ["Chris Gutierrez", "US"], ["Kyler Phillips", "US"], ["Cody Stamann", "US"], ["Brian Kelleher", "US"],
    ["Julio Arce", "US"], ["Da'Mon Blackshear", "US"], ["Caolán Loughran", "GB"], ["Javid Basharat", "GB"],
    ["Farid Basharat", "AF"], ["Rani Yahya", "BR"], ["Jimmie Rivera", "US"], ["Thomas Almeida", "BR"],
    ["Raphael Assunção", "BR"], ["John Dodson", "US"], ["John Lineker", "BR"], ["Eddie Wineland", "US"],
    ["Cody Garbrandt", "US"], ["Vinicius Oliveira", "BR"], ["Gastón Bolanos", "PE"], ["Marcus McGhee", "US"],
    ["Douglas Silva de Andrade", "BR"], ["Sean O'Malley", "US"], ["Cory Sandhagen", "US"],
    ["Umar Nurmagomedov", "RU"], ["Deiveson Figueiredo", "BR"], ["Marlon Vera", "EC"],
    ["Pedro Munhoz", "BR"], ["Song Yadong", "CN"], ["Mario Bautista", "US"], ["Raul Rosas Jr.", "MX"],
    ["Miles Johns", "US"],
  ],
  FLW: [
    ["Matheus Nicolau", "BR"], ["Tagir Ulanbekov", "RU"], ["Jake Hadley", "GB"], ["Jafel Filho", "BR"],
    ["Matt Schnell", "US"], ["Tyson Nam", "US"], ["Allan Nascimento", "BR"], ["Carlos Hernandez", "US"],
    ["Felipe dos Santos", "BR"], ["Malcolm Gordon", "CA"], ["Tatsuro Taira", "JP"], ["Sumudaerji", "CN"],
    ["Cody Durden", "US"], ["Alex Reyes", "US"], ["Francisco Figueiredo", "BR"], ["Brandon Royval", "US"],
    ["Amir Albazi", "IQ"], ["Brandon Moreno", "MX"], ["Tim Elliott", "US"], ["Steve Erceg", "AU"],
    ["Asu Almabaev", "KZ"], ["Muhammad Mokaev", "AE"], ["Kai Kara-France", "NZ"],
  ],
  WBW: [
    ["Irene Aldana", "MX"], ["Ketlen Vieira", "BR"], ["Mayra Bueno Silva", "BR"], ["Pannie Kianzad", "SE"],
    ["Jessica-Rose Clark", "AU"], ["Sijara Eubanks", "US"], ["Marion Reneau", "US"], ["Sara McMann", "US"],
    ["Hailey Cowan", "US"], ["Chelsea Chandler", "US"], ["Leah Letson", "US"], ["Tamires Vidal", "BR"],
    ["Nora Cornolle", "FR"], ["Ailin Perez", "AR"], ["Joselyne Edwards", "PA"], ["Julianna Peña", "US"],
    ["Raquel Pennington", "US"], ["Yana Santos", "RU"], ["Jasmine Jasudavicius", "CA"],
  ],
  WFLW: [
    ["Maryna Moroz", "UA"], ["Ariane Lipski", "BR"], ["JJ Aldrich", "US"], ["Montana De La Rosa", "US"],
    ["Cortney Casey", "US"], ["Mariya Agapova", "KZ"], ["Andrea Lee", "US"], ["Jessica Eye", "US"],
    ["Roxanne Modafferi", "US"], ["Katlyn Chookagian", "US"], ["Jennifer Maia", "BR"], ["Viviane Araujo", "BR"],
    ["Molly McCann", "GB"], ["Casey O'Neill", "AU"], ["Shanna Young", "US"], ["Alexa Grasso", "MX"],
    ["Manon Fiorot", "FR"], ["Valentina Shevchenko", "KG"], ["Karina Silva", "BR"], ["Wang Cong", "CN"],
  ],
  WSW: [
    ["Amanda Ribas", "BR"], ["Marina Rodriguez", "BR"], ["Luana Pinheiro", "BR"], ["Iasmin Lucindo", "BR"],
    ["Angela Hill", "US"], ["Loma Lookboonmee", "TH"], ["Sam Hughes", "US"], ["Yazmin Jauregui", "MX"],
    ["Stephanie Luciano", "BR"], ["Emily Ducote", "US"], ["Cynthia Calvillo", "US"], ["Polyana Viana", "BR"],
    ["Montserrat Ruiz", "MX"], ["Juliana Miller", "BR"], ["Vanessa Demopoulos", "US"], ["Yan Xiaonan", "CN"],
    ["Amanda Lemos", "BR"], ["Jéssica Andrade", "BR"], ["Tatiana Suarez", "US"], ["Loopy Godinez", "MX"],
    ["Virna Jandiroba", "BR"], ["Jaqueline Amorim", "BR"], ["Gillian Robertson", "CA"], ["Tabatha Ricci", "BR"],
    ["Rose Namajunas", "US"],
  ],
};

// ---------- Opponent pools per division (real UFC names) ----------
// BASE names + the entire AUTO_POOL — every generated record's opponents
// exist as database fighters.
export const POOLS: Record<DivisionId, string[]> = {
  HW: [
    "Karl Williams", "Mick Parkin", "Blagoy Ivanov", "Rodrigo Nascimento", "Marcin Tybura",
    "Mohammed Usman", "Justin Tafa", "Austen Lane", "Don'Tale Mayes", "Alexandr Romanov",
    "Marcos Rogério de Lima", "Augusto Sakai", "Chase Sherman", "Jake Collier", "Josh Parisian",
    "Parker Porter", "Yorgan De Castro", "Jared Vanderaa", "Walt Harris", "Chris Daukaus",
    "Tanner Boser", "Hamdy Abdelwahab", "Tallison Teixeira", "Anton Turkalj",
    "Ciryl Gane", "Tom Aspinall", "Alexander Volkov", "Sergei Pavlovich", "Curtis Blaydes",
    "Jailton Almeida", "Serghei Spivac", "Tai Tuivasa", "Josh Hokit", "Waldo Cortes-Acosta",
    "Greg Hardy", "Yorgan De Castro", "Shamil Abdurakhimov", "Yusuf Nazarov", "Duncan French",
  ],
  LHW: [
    "Ryan Spann", "Johnny Walker", "Volkan Oezdemir", "Paul Craig", "Jimmy Crute",
    "Ion Cuțelaba", "Da Un Jung", "Misha Cirkunov", "Ovince Saint Preux", "Ibo Aslan",
    "Caio Machado", "Gian Villante", "Ed Herman", "Modestas Bukauskas",
    "Vitor Petrino", "Zhang Mingyang", "Navajo Stirling", "Bogdan Guskov", "Azamat Murzakanov",
    "Khalil Rountree", "Oumar Sy", "Bruno Lopes",
    "Magomed Ankalaev", "Carlos Ulberg", "Aleksandar Rakić", "Jan Błachowicz", "Jiří Procházka",
    "Jamahal Hill", "Nikita Krylov", "Alonzo Menifield", "Devin Clark", "Zach Reese", "Rodrigo Nascimento",
  ],
  MW: [
    "Jared Cannonier", "Jack Hermansson", "Marvin Vettori", "Shara Magomedov", "Brunno Ferreira",
    "Rodolfo Vieira", "Jun Yong Park", "Eryk Anders", "Chris Curtis", "Brad Tavares",
    "Jacob Malkoun", "Derek Brunson", "Uriah Hall", "Gegard Mousasi", "Armen Petrosyan",
    "Denis Tiuliulin", "Cody Brundage", "Roman Kopylov", "Sam Alvey", "Kyle Daukaus",
    "Kelvin Gastelum", "Nassourdine Imavov", "Michel Pereira", "Roman Dolidze", "Anthony Hernandez",
    "Ikram Aliskerov", "Abus Magomedov", "Gerald Meerschaert", "Andre Petroski", "Reinier de Ridder",
    "Sean Strickland", "Dricus Du Plessis", "Khamzat Chimaev", "Robert Whittaker", "Israel Adesanya",
    "Caio Borralho", "Joe Pyfer", "Jared Cannonier", "Gregory Rodrigues", "Denis Fonseca",
  ],
  WW: [
    "Gilbert Burns", "Vicente Luque", "Neil Magny", "Geoff Neal", "Randy Brown",
    "Michael Chiesa", "Bryan Barberena", "Gunnar Nelson", "Santiago Ponzinibbio", "Oban Elliott",
    "Themba Gorimbo", "Alex Morono", "Matt Brown", "Kevin Lee", "Mike Malott",
    "Mounir Lazzez", "Billy Goff", "Khaos Williams", "AJ Fletcher", "Dhiego Lima",
    "Ian Garry", "Sean Brady", "Colby Covington", "Kevin Holland", "Daniel Rodriguez",
    "Song Kenan", "Bryan Battle", "Carlos Prates", "Gabriel Bonfim",
    "Belal Muhammad", "Shavkat Rakhmonov", "Jack Della Maddalena", "Leon Edwards", "Kamaru Usman",
    "Joaquin Buckley", "Stephen Thompson", "Michael Page", "Ian Garry", "Gilbert Burns",
  ],
  LW: [
    "Jalin Turner", "Jim Miller", "Drew Dober", "Bobby Green", "Nasrat Haqparast",
    "Joel Alvarez", "Thiago Moisés", "Damir Ismagulov", "Mateusz Rebecki", "Rafa García",
    "Drakkar Klose", "Jamie Mullarkey", "Ludovit Klein", "Ignacio Bahamondes", "Alexander Hernandez",
    "Fares Ziam", "Terrance McKinney", "John Makdessi", "Charlie Campbell", "Trevor Peek",
    "Kurt Holobaugh", "Natan Levy", "Evan Elder", "Joe Lowdon", "Rick Glenn",
    "Dan Hooker", "Mateusz Gamrot", "Renato Moicano", "Beneil Dariush", "Rafael Fiziev",
    "Grant Dawson", "Marc Diakiese", "Joaquim Silva", "Sam Patterson", "Maurício Ruffy",
    "Islam Makhachev", "Arman Tsarukyan", "Charles Oliveira", "Justin Gaethje", "Dustin Poirier",
    "Michael Chandler", "Paddy Pimblett", "Beneil Dariush", "Bobby Green", "Erick Gonzalez",
  ],
  FW: [
    "Dan Ige", "Josh Emmett", "Giga Chikadze", "Alex Caceres", "Julian Erosa",
    "Sean Woodson", "Bill Algeo", "Darren Elkins", "Ryan Hall", "Ricardo Lamas",
    "Dennis Bermudez", "Shane Burgos", "Doo Ho Choi", "Edson Barboza", "Sodiq Yusuff",
    "Hakeem Dawodu", "Christian Rodriguez", "Andre Fili", "Jack Shore", "David Onama",
    "Pat Sabatini", "Damon Jackson", "Jeong Yeong Lee", "Chase Hooper", "Enrique Barzola",
    "Yair Rodríguez", "Diego Lopes", "Brian Ortega", "Arnold Allen", "Movsar Evloev",
    "Calvin Kattar", "Joanderson Brito", "Jean Silva", "Steve Garcia",
    "Alexander Volkanovski", "Ilia Topuria", "Max Holloway", "Yair Rodríguez", "Josh Emmett",
  ],
  BW: [
    "Rob Font", "Adrian Yanez", "Jonathan Martinez", "Ricky Simón", "Chris Gutierrez",
    "Kyler Phillips", "Cody Stamann", "Brian Kelleher", "Julio Arce", "Da'Mon Blackshear",
    "Caolán Loughran", "Javid Basharat", "Farid Basharat", "Rani Yahya", "Jimmie Rivera",
    "Thomas Almeida", "Raphael Assunção", "John Dodson", "John Lineker", "Eddie Wineland",
    "Cody Garbrandt", "Vinicius Oliveira", "Gastón Bolanos", "Marcus McGhee", "Douglas Silva de Andrade",
    "Sean O'Malley", "Cory Sandhagen", "Umar Nurmagomedov", "Deiveson Figueiredo", "Marlon Vera",
    "Pedro Munhoz", "Song Yadong", "Mario Bautista", "Raul Rosas Jr.", "Miles Johns",
    "Merab Dvalishvili", "Petr Yan", "Henry Cejudo", "Dominick Cruz", "T.J. Dillashaw",
  ],
  FLW: [
    "Matheus Nicolau", "Tagir Ulanbekov", "Jake Hadley", "Jafel Filho", "Matt Schnell",
    "Tyson Nam", "Allan Nascimento", "Carlos Hernandez", "Felipe dos Santos", "Malcolm Gordon",
    "Tatsuro Taira", "Sumudaerji", "Cody Durden", "Alex Reyes", "Francisco Figueiredo",
    "Brandon Royval", "Amir Albazi", "Brandon Moreno", "Tim Elliott", "Steve Erceg",
    "Asu Almabaev", "Muhammad Mokaev", "Kai Kara-France",
    "Joshua Van", "Alexandre Pantoja", "Jake Hadley", "Codey Rawlings", "C.J. Vergara",
  ],
  WBW: [
    "Irene Aldana", "Ketlen Vieira", "Mayra Bueno Silva", "Pannie Kianzad", "Jessica-Rose Clark",
    "Sijara Eubanks", "Marion Reneau", "Sara McMann", "Hailey Cowan", "Chelsea Chandler",
    "Leah Letson", "Tamires Vidal", "Nora Cornolle", "Ailin Perez", "Joselyne Edwards",
    "Julianna Peña", "Raquel Pennington", "Yana Santos", "Jasmine Jasudavicius",
    "Kayla Harrison", "Miesha Tate", "Holly Holm", "Ronda Rousey", "Amanda Nunes",
  ],
  WFLW: [
    "Maryna Moroz", "Ariane Lipski", "JJ Aldrich", "Montana De La Rosa", "Cortney Casey",
    "Mariya Agapova", "Andrea Lee", "Jessica Eye", "Roxanne Modafferi", "Katlyn Chookagian",
    "Jennifer Maia", "Viviane Araujo", "Molly McCann", "Casey O'Neill", "Shanna Young",
    "Alexa Grasso", "Manon Fiorot", "Valentina Shevchenko", "Karina Silva", "Wang Cong",
    "Natalia Silva", "Erin Blanchfield", "Rose Namajunas", "JJ Aldrich",
  ],
  WSW: [
    "Amanda Ribas", "Marina Rodriguez", "Luana Pinheiro", "Iasmin Lucindo", "Angela Hill",
    "Loma Lookboonmee", "Sam Hughes", "Yazmin Jauregui", "Stephanie Luciano", "Emily Ducote",
    "Cynthia Calvillo", "Polyana Viana", "Montserrat Ruiz", "Juliana Miller", "Vanessa Demopoulos",
    "Yan Xiaonan", "Amanda Lemos", "Jéssica Andrade", "Tatiana Suarez", "Loopy Godinez",
    "Virna Jandiroba", "Jaqueline Amorim", "Gillian Robertson", "Tabatha Ricci", "Rose Namajunas",
    "Weili Zhang", "Mackenzie Dern", "Carla Esparza", "Joanna Jędrzejczyk",
  ],
};

// keep pool entries clean (no "?" placeholders — they were scrubbing artifacts)
for (const div of Object.keys(POOLS) as DivisionId[]) {
  POOLS[div] = POOLS[div]
    .map((n) => n.replace(/\?/g, "").trim())
    .filter(Boolean)
    .map((n) => n);
  // merge the auto pool names so every possible opponent resolves
  for (const [n] of AUTO_POOL[div]) {
    if (!POOLS[div].includes(n)) POOLS[div].push(n);
  }
}

export { slug };
