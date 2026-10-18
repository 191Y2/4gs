import { Fighter, BoutOdds, SimResult, SimRound, WinMethod, DivisionId } from "./types";

export type { SimResult, SimRound, BoutOdds, WinMethod };

// ============ OCTAGON HQ — Fight Math Engine ============
// Everything here is pure math: Elo → probability → moneyline → simulator.
// The outcome distribution matches the probability model, so betting lines
// are provably fair (house edge = vig only). No "overall rating" shortcuts.

export const VIG = 0.05; // 5% house margin

export function winProbability(eloA: number, eloB: number): number {
  // Classic Elo expectation, blended with a small style/attributes term
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

export function americanFromProb(p: number, vig = VIG): number {
  // implied probability with house margin baked in
  const pi = Math.min(0.985, Math.max(0.015, p * (1 + vig)));
  let odds: number;
  if (pi >= 0.5) {
    odds = -Math.round((100 * pi) / (1 - pi));
  } else {
    odds = Math.round((100 * (1 - pi)) / pi);
  }
  // round to sportsbook-style lines
  if (Math.abs(odds) >= 100) {
    const step = Math.abs(odds) >= 400 ? 25 : odds > 0 ? 20 : 10;
    const sign = odds < 0 ? -1 : 1;
    odds = sign * Math.round(Math.abs(odds) / step) * step;
    if (odds > 0 && odds < 100) odds = 100 + Math.round((odds - 100) / 10) * 10;
  }
  return odds;
}

export function fairAmerican(p: number): number {
  const pf = Math.min(0.99, Math.max(0.01, p));
  return pf >= 0.5
    ? -Math.round((100 * pf) / (1 - pf))
    : Math.round((100 * (1 - pf)) / pf);
}

export function decimalFromAmerican(odds: number): number {
  return odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
}

export function americanFromDecimal(dec: number): number {
  const profit = dec - 1;
  return profit >= 1 ? Math.round(profit * 100) : -Math.round(100 / profit);
}

export function probFromAmerican(odds: number): number {
  return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

export function computeOdds(a: Fighter, b: Fighter, houseA?: number, houseB?: number): BoutOdds {
  // attribute matchup term — small nudge so styles matter, not just Elo
  const styleA =
    (a.str * 0.3 + a.pow * 0.2 + a.wr * 0.2 + a.gr * 0.15 + a.tdd * 0.1 + a.chin * 0.05) / 100;
  const styleB =
    (b.str * 0.3 + b.pow * 0.2 + b.wr * 0.2 + b.gr * 0.15 + b.tdd * 0.1 + b.chin * 0.05) / 100;
  const base = winProbability(a.elo, b.elo);
  // blend 85% elo / 15% attributes, clamped
  let pA = 0.85 * base + 0.15 * styleA - 0.075;
  pA = Math.min(0.97, Math.max(0.03, pA));
  return {
    eloA: a.elo,
    eloB: b.elo,
    pA,
    pB: 1 - pA,
    oddsA: houseA ?? americanFromProb(pA),
    oddsB: houseB ?? americanFromProb(1 - pA),
    fairA: fairAmerican(pA),
    fairB: fairAmerican(1 - pA),
  };
}

// ---------- Overall rating (for display only — NEVER used for outcomes) ----------
// Linear mapping of the engine Elo onto an EA-style 55-99 scale, plus small
// finishing-rate and win-streak bonuses. Elo itself encodes rank, record and
// championship pedigree, so the OVR follows the divisions faithfully.
export function overallRating(f: Fighter): number {
  const finishRate = (f.ko + f.sub) / Math.max(1, f.w);
  const base = 55 + (f.elo - 1350) / 13;
  const streak = currentStreak(f);
  const streakBonus = Math.min(3, Math.max(0, streak - 3) * 0.75);
  return Math.round(Math.min(99, Math.max(55, base + finishRate * 4 + streakBonus)));
}

export function currentStreak(f: Fighter): number {
  // log is chronological — count consecutive wins from the most recent bout
  // backwards, so a fresh Fight Lab result moves the streak live
  let streak = 0;
  for (let i = f.log.length - 1; i >= 0; i--) {
    if (f.log[i].res === "W") streak++;
    else break;
  }
  return streak;
}

// ---------- Simulator ----------
function pickFinishRound(f: Fighter, loser: Fighter, method: WinMethod): number {
  // early power, later cardio; grapplers finish mid-round
  const powFactor = f.pow / 100;
  const chinFactor = loser.chin / 100;
  let mu = method === "KO" ? 1.8 + chinFactor * 1.4 : 2.4 + chinFactor * 1.2;
  mu += (1 - powFactor) * 0.8;
  const round = Math.max(1, Math.min(5, Math.round(mu + (Math.random() - 0.5) * 1.6)));
  return round;
}

function sampleMethod(winner: Fighter, loser: Fighter): { method: WinMethod; det?: string } {
  const koRate = winner.ko / Math.max(1, winner.ko + winner.sub + winner.dec);
  const subRate = winner.sub / Math.max(1, winner.ko + winner.sub + winner.dec);
  // durable opponent lowers KO chance; slick grappler lowers sub... simplify via chin/gr
  const koAdj = koRate * (1 - (loser.chin - 70) / 250);
  const subAdj = subRate * (1 - (loser.tdd - 70) / 300);
  const roll = Math.random();
  const koP = Math.max(0.03, Math.min(0.72, koAdj));
  const subP = Math.max(0.02, Math.min(0.5, subAdj));
  if (roll < koP) {
    return { method: "KO", det: koDetail(winner) };
  }
  if (roll < koP + subP) {
    return { method: "SUB", det: subDetail(winner) };
  }
  // decision flavor
  const uRoll = Math.random();
  return { method: uRoll < 0.62 ? "UDEC" : uRoll < 0.85 ? "SDEC" : "MDEC" };
}

const KO_DETAILS = ["Head Kick", "Right Hook", "Left Hook", "Uppercut", "Flying Knee", "Cross", "Left Straight", "Hook Combo", "Elbow", "Ground & Pound", "Spinning Back Fist", "Superman Punch"];
const SUB_DETAILS = ["Rear Naked Choke", "Guillotine", "Armbar", "Triangle Choke", "D'Arce Choke", "Anaconda Choke", "Kimura", "Arm-Triangle Choke", "Heel Hook", "Kneebar", "Face Crank"];

function koDetail(f: Fighter): string {
  const pool = f.pow > 85 ? KO_DETAILS.slice(0, 8) : KO_DETAILS;
  return pool[Math.floor(Math.random() * pool.length)];
}
function subDetail(f: Fighter): string {
  const pool = f.gr > 85 ? SUB_DETAILS.slice(0, 7) : SUB_DETAILS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function timeInRound(): string {
  const m = Math.floor(Math.random() * 5);
  const s = Math.floor(Math.random() * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function scorecards(pA: number): [number, number][] {
  // three judges; dominance → wider cards
  const dom = Math.abs(pA - 0.5) * 2; // 0..1
  return [0, 1, 2].map(() => {
    const wide = Math.random() < dom * 0.8;
    const close = Math.random() < 0.22;
    const a = 48 + (Math.random() < 0.15 ? 1 : 0);
    const b = wide ? 45 + Math.round(Math.random()) : close ? 47 : 46;
    return [a, b] as [number, number];
  });
}

export function simulateFight(a: Fighter, b: Fighter, rounds: 3 | 5 = 3, pAOverride?: number): SimResult {
  const odds = computeOdds(a, b);
  const pA = pAOverride ?? odds.pA;

  // 1) sample the winner directly from the probability model (this is the math)
  const winner: "A" | "B" = Math.random() < pA ? "A" : "B";
  const win = winner === "A" ? a : b;
  const lose = winner === "A" ? b : a;

  // 2) sample method & round conditioned on styles
  const { method, det } = sampleMethod(win, lose);
  const totalRounds = method === "KO" || method === "SUB" ? pickFinishRound(win, lose, method) : rounds;

  // 3) build round-by-round narration
  const roundTexts = [
    "feels out the range, trading kicks at distance",
    "opens up in combination, both men land hard",
    "turns into a war — the crowd is on its feet",
    "paces himself, picking shots and mixing levels",
    "empties the tank — everything he has left",
  ];

  const roundsLog: SimRound[] = [];
  let sigA = 0;
  let sigB = 0;
  const edge = Math.abs(pA - 0.5);

  for (let r = 1; r <= totalRounds; r++) {
    const baseLands = 18 + Math.floor(Math.random() * 14);
    const winLands = Math.round(baseLands * (1 + edge * 0.55));
    const loseLands = Math.round(baseLands * (1 - edge * 0.4) * (0.75 + Math.random() * 0.45));
    const aLands = winner === "A" ? winLands : loseLands;
    const bLands = winner === "B" ? winLands : loseLands;
    sigA += aLands;
    sigB += bLands;

    const narrA = a.name.split(" ").slice(-1)[0];
    const narrB = b.name.split(" ").slice(-1)[0];

    let text: string;
    if (r === totalRounds && (method === "KO" || method === "SUB")) {
      text =
        method === "KO"
          ? `${narrA} catches ${narrB} with a ${det?.toLowerCase() ?? "clean shot"} and ${narrB} goes down — the referee waves it off!`
          : `${narrA} sinks in a ${det?.toLowerCase() ?? "submission"} on ${narrB} and forces the tap!`;
    } else {
      const flavor = roundTexts[Math.min(r - 1, 4)];
      const grappleNote =
        win.wr > 78 && Math.random() < 0.45
          ? `${narrA} lands a takedown and works control time.`
          : win.str > 78 && Math.random() < 0.4
            ? `${narrA} is out-landing ${narrB} on the feet.`
            : "";
      text = `${narrA} and ${narrB} ${flavor}. ${grappleNote}`.trim();
    }

    roundsLog.push({
      round: r,
      text,
      aLanded: aLands,
      bLanded: bLands,
      finish: r === totalRounds && (method === "KO" || method === "SUB") ? det : undefined,
    });
  }

  const finishRoundStrikes = () => {
    // last round is shorter for finishes
    if (method === "KO" || method === "SUB") {
      if (winner === "A") sigA = sigA - roundsLog[roundsLog.length - 1].aLanded + Math.floor(Math.random() * 12);
      else sigB = sigB - roundsLog[roundsLog.length - 1].bLanded + Math.floor(Math.random() * 12);
      roundsLog[roundsLog.length - 1].aLanded = Math.floor(Math.random() * 10) + 3;
      roundsLog[roundsLog.length - 1].bLanded = Math.floor(Math.random() * 8) + 2;
    }
  };
  finishRoundStrikes();

  return {
    winner,
    method,
    detail: det,
    round: totalRounds,
    time: method === "KO" || method === "SUB" ? timeInRound() : "5:00",
    scorecards: method === "UDEC" || method === "SDEC" || method === "MDEC" ? scorecards(pA) : undefined,
    rounds: roundsLog,
    sigStrikesA: sigA,
    sigStrikesB: sigB,
  };
}

export function methodLabel(m: WinMethod): string {
  switch (m) {
    case "KO": return "KO/TKO";
    case "SUB": return "Submission";
    case "UDEC": return "Dec — Unanimous";
    case "SDEC": return "Dec — Split";
    case "MDEC": return "Dec — Majority";
    case "DQ": return "DQ";
  }
}

export function resultSummary(sim: SimResult, a: Fighter, b: Fighter): string {
  const w = sim.winner === "A" ? a : b;
  const l = sim.winner === "A" ? b : a;
  if (sim.method === "KO") return `${w.name} def. ${l.name} via KO/TKO (${sim.detail}) — R${sim.round} ${sim.time}`;
  if (sim.method === "SUB") return `${w.name} def. ${l.name} via Sub (${sim.detail}) — R${sim.round} ${sim.time}`;
  return `${w.name} def. ${l.name} via ${sim.method === "UDEC" ? "Unanimous" : sim.method === "SDEC" ? "Split" : "Majority"} Decision (${sim.round === 5 ? "49-46, 48-47, 48-47" : "29-28, 29-28, 29-28"})`;
}

// ---------- Formatting helpers ----------
export function fmtOdds(o: number): string {
  return o > 0 ? `+${o}` : `${o}`;
}

export function fmtMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function flagUrl(cc: string): string {
  return `https://flagcdn.com/w40/${cc.toLowerCase()}.png`;
}
