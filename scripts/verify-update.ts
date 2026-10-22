import { ROSTER, GHOSTS, FIGHTER_MAP, LEGENDS, champions } from "../src/lib/data";

const byDiv: Record<string, number> = {};
for (const f of ROSTER) byDiv[f.division] = (byDiv[f.division] ?? 0) + 1;

console.log("TOTAL:", ROSTER.length);
console.log("BY DIVISION:", byDiv);
console.log("LEGENDS(retired):", LEGENDS.length, "CHAMPIONS:", champions().length, "GHOSTS:", GHOSTS.length);

// Jon Jones checks
const jones = FIGHTER_MAP["jon-jones"];
console.log("\nJONES:", jones ? `${jones.name} · ${jones.division} · log=${jones.log.length} fights · w-l-nc=${jones.w}-${jones.l}-${jones.nc}` : "MISSING");
const jonesMissingOpponents = [...new Set(jones?.log.map((e) => e.op) ?? [])].filter((op) => !ROSTER.some((f) => f.name === op));
console.log("JONES OPPONENTS NOT IN DB (will ghost-register):", jonesMissingOpponents);

// missing-opponent scan across whole roster
const names = new Set(ROSTER.map((f) => f.name));
const missing = new Map<string, number>();
for (const f of ROSTER) {
  for (const e of f.log) {
    if (!names.has(e.op)) missing.set(e.op, (missing.get(e.op) ?? 0) + 1);
  }
}
console.log("\nALL-ROSTER MISSING OPPONENT NAMES:", missing.size);
console.log([...missing.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25));

// log length stats — full careers?
const lens = ROSTER.map((f) => f.log.length).sort((a, b) => a - b);
const median = lens[Math.floor(lens.length / 2)];
const shortLogs = ROSTER.filter((f) => f.log.length < 4 && f.w + f.l >= 4).length;
console.log("\nLOG LENGTH: median =", median, "min =", lens[0], "max =", lens[lens.length - 1]);
console.log("fighters with <4 log entries despite 4+ pro fights (hand-written partials):", shortLogs);

// a few sample fighters
for (const nm of ["Sean O'Malley", "Karl Williams", "Brandon Moreno", "Loopy Godinez", "Dominick Reyes", "Matt Hamill"]) {
  const f = ROSTER.find((x) => x.name === nm);
  console.log(`${nm}:`, f ? `✓ ${f.division} ${f.w}-${f.l} log=${f.log.length}` : "✗ MISSING");
}
