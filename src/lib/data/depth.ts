import { Fighter, DivisionId, FightLogEntry } from "../types";
import { f, slug } from "./core";

// ============ DEPTH ROSTER GENERATOR ============
// Builds unranked journeymen & prospects from compact one-line specs.
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

function eventLabel(r: () => number, year: number): string {
  if (r() < 0.55) return "UFC Fight Night";
  const pool: Record<number, [number, number]> = {
    2022: [280, 283], 2023: [284, 296], 2024: [297, 307],
    2025: [308, 320], 2026: [321, 333],
  };
  const [lo, hi] = pool[year] ?? [321, 333];
  return `UFC ${lo + Math.floor(r() * (hi - lo + 1))}`;
}

function roundTime(r: () => number): string {
  const m = Math.floor(r() * 5);
  const s = Math.floor(r() * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Deterministic bout-log synthesis — plausible recent history consistent
// with each fighter's W/L record and win-method split.
function genLog(
  name: string,
  w: number,
  l: number,
  ko: number,
  sub: number,
  pool: string[]
): FightLogEntry[] {
  const r = mulberry32(hashStr(name));
  const total = w + l;
  const entries: FightLogEntry[] = [];
  const n = Math.min(pool.length, 4 + Math.floor(r() * 3)); // 4-6 entries
  const used = new Set<string>();
  const winRate = total > 0 ? Math.min(0.85, Math.max(0.3, w / total)) : 0.6;

  // walk backwards from ~Oct 2026 in 3-6 month steps
  let year = 2026;
  let month = 9 - Math.floor(r() * 4);
  const order: FightLogEntry[] = [];
  for (let i = 0; i < n; i++) {
    const op = pool[Math.floor(r() * pool.length)];
    if (used.has(op)) continue;
    used.add(op);
    const isWin = r() < winRate;
    let m: FightLogEntry["m"];
    let det: string | undefined;
    let rd: number;
    let t: string | undefined;
    if (isWin) {
      // pick method consistent with this fighter's win split
      const dec = Math.max(0, w - ko - sub);
      const roll = r() * Math.max(1, w);
      if (roll < ko) {
        m = "KO"; det = KO_DETAILS[Math.floor(r() * KO_DETAILS.length)];
        rd = r() < 0.35 ? 1 : r() < 0.72 ? 2 : 3;
        t = roundTime(r);
      } else if (roll < ko + sub) {
        m = "SUB"; det = SUB_DETAILS[Math.floor(r() * SUB_DETAILS.length)];
        rd = r() < 0.3 ? 1 : r() < 0.7 ? 2 : 3;
        t = roundTime(r);
      } else {
        m = r() < 0.82 ? "UDEC" : "SDEC";
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
    const bonus = isWin && (m === "KO" || m === "SUB") && r() < 0.18 ? "POTN" : undefined;
    const ev = eventLabel(r, year);
    const date = `${MONTHS[((month % 12) + 12) % 12]} ${year}`;
    order.push({ op, ev, date, res: isWin ? "W" : "L", m, r: rd, t, det, bonus });
    month -= 3 + Math.floor(r() * 4);
    while (month < 0) {
      month += 12;
      year -= 1;
    }
    if (year < 2022) break;
  }
  entries.push(...order.reverse()); // oldest first, like the hand-written files
  return entries;
}

export interface DepthOpts {
  retired?: boolean;
  legend?: boolean;
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
  const log = genLog(name, w, l, ko, sub, POOLS[div]);
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
  if (opts?.retired) fighter.status = "retired";
  if (opts?.legend) fighter.legend = true;
  return fighter;
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

// ---------- Opponent pools per division (real UFC names, mixed roster/non-roster) ----------
export const POOLS: Record<DivisionId, string[]> = {
  HW: [
    "Karl Williams", "Mick Parkin", "Blagoy Ivanov", "Rodrigo Nascimento", "Marcin Tybura",
    "Mohammed Usman", "Justin Tafa", "Austen Lane", "Don'Tale Mayes", "Alexandr Romanov",
    "Marcos Rogério de Lima", "Augusto Sakai", "Chase Sherman", "Jake Collier", "Josh Parisian",
    "Parker Porter", "Yorgan De Castro", "Jared Vanderaa", "Walt Harris", "Chris Daukaus",
    "Tanner Boser", "Hamdy Abdelwahab", "Tallison Teixeira", "Anton Turkalj", "Michael Johnson",
  ],
  LHW: [
    "Ryan Spann", "Johnny Walker", "Volkan Oezdemir", "Paul Craig", "Jimmy Crute",
    "Ion Cuțelaba", "Da Un Jung", "Misha Cirkunov", "Ovince Saint Preux", "Ibo Aslan",
    "Caio Machado", "Gian Villante", "Ed Herman", "Modestas Bukauskas", "Rodrigo Nascimento",
    "Vitor Petrino", "Zhang Mingyang", "Navajo Stirling", "Bogdan Guskov", "Azamat Murzakanov",
  ],
  MW: [
    "Jared Cannonier", "Jack Hermansson", "Marvin Vettori", "Shara Magomedov", "Brunno Ferreira",
    "Rodolfo Vieira", "Jun Yong Park", "Eryk Anders", "Chris Curtis", "Brad Tavares",
    "Jacob Malkoun", "Derek Brunson", "Uriah Hall", "Gegard Mousasi", "Armen Petrosyan",
    "Denis Tiuliulin", "Cody Brundage", "Roman Kopylov", "Sam Alvey", "Kyle Daukaus",
  ],
  WW: [
    "Gilbert Burns", "Vicente Luque", "Neil Magny", "Geoff Neal", "Randy Brown",
    "Michael Chiesa", "Bryan Barberena", "Gunnar Nelson", "Santiago Ponzinibbio", "Oban Elliott",
    "Themba Gorimbo", "Alex Morono", "Matt Brown", "Kevin Lee", "Mike Malott",
    "Mounir Lazzez", "Billy Goff", "Khaos Williams", "AJ Fletcher", "Dhiego Lima",
  ],
  LW: [
    "Jalin Turner", "Jim Miller", "Drew Dober", "Bobby Green", "Nasrat Haqparast",
    "Joel Alvarez", "Thiago Moisés", "Damir Ismagulov", "Mateusz Rebecki", "Rafa García",
    "Drakkar Klose", "Jamie Mullarkey", "Ludovit Klein", "Ignacio Bahamondes", "Alexander Hernandez",
    "Fares Ziam", "Terrance McKinney", "John Makdessi", "Charlie Campbell", "Trevor Peek",
    "Kurt Holobaugh", "Natan Levy", "Evan Elder", "Joe Lowdon", "Rick Glenn",
  ],
  FW: [
    "Dan Ige", "Josh Emmett", "Giga Chikadze", "Alex Caceres", "Julian Erosa",
    "Sean Woodson", "Bill Algeo", "Darren Elkins", "Ryan Hall", "Ricardo Lamas",
    "Dennis Bermudez", "Shane Burgos", "Doo Ho Choi", "Edson Barboza", "Sodiq Yusuff",
    "Hakeem Dawodu", "Christian Rodriguez", "Andre Fili", "Jack Shore", "David Onama",
    "Pat Sabatini", "Damon Jackson", "Jeong Yeong Lee", "Chase Hooper", "Enrique Barzola",
  ],
  BW: [
    "Rob Font", "Adrian Yanez", "Jonathan Martinez", "Ricky Simón", "Chris Gutierrez",
    "Kyler Phillips", "Cody Stamann", "Brian Kelleher", "Julio Arce", "Da'Mon Blackshear",
    "Caolán Loughran", "Javid Basharat", "Farid Basharat", "Rani Yahya", "Jimmie Rivera",
    "Thomas Almeida", "Raphael Assunção", "John Dodson", "John Lineker", "Eddie Wineland",
    "Cody Garbrandt", "Vinicius Oliveira", "Gastón Bolanos", "Marcus McGhee", "Douglas Silva de Andrade",
  ],
  FLW: [
    "Matheus Nicolau", "Tagir Ulanbekov", "Jake Hadley", "Jafel Filho", "Matt Schnell",
    "Tyson Nam", "Allan Nascimento", "Carlos Hernandez", "Felipe dos Santos", "Malcolm Gordon",
    "Tatsuro Taira", "Sumudaerji", "Cody Durden", "Alex Reyes", "Francisco Figueiredo",
  ],
  WBW: [
    "Irene Aldana", "Ketlen Vieira", "Mayra Bueno Silva", "Pannie Kianzad", "Jessica-Rose Clark",
    "Sijara Eubanks", "Marion Reneau", "Sara McMann", "Hailey Cowan", "Chelsea Chandler",
    "Leah Letson", "Tamires Vidal", "Nora Cornolle", "Ailin Perez", "Joselyne Edwards",
  ],
  WFLW: [
    "Maryna Moroz", "Ariane Lipski", "JJ Aldrich", "Montana De La Rosa", "Cortney Casey",
    "Mariya Agapova", "Andrea Lee", "Jessica Eye", "Roxanne Modafferi", "Katlyn Chookagian",
    "Jennifer Maia", "Viviane Araujo", "Molly McCann", "Casey O'Neill", "Shanna Young",
  ],
  WSW: [
    "Amanda Ribas", "Marina Rodriguez", "Luana Pinheiro", "Iasmin Lucindo", "Angela Hill",
    "Loma Lookboonmee", "Sam Hughes", "Yazmin Jauregui", "Stephanie Luciano", "Emily Ducote",
    "Cynthia Calvillo", "Polyana Viana", "Montserrat Ruiz", "Juliana Miller", "Vanessa Demopoulos",
  ],
};

// keep pool entries clean (no "?" placeholders — they were scrubbing artifacts)
for (const div of Object.keys(POOLS) as DivisionId[]) {
  POOLS[div] = POOLS[div].map((n) => n.replace(/\?/g, "").trim()).filter(Boolean);
}

export { slug };
