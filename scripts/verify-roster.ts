import { ROSTER, LEGENDS, HOF_ICONS, CHAMPIONS, p4pList, DIVISION_MAP } from "../src/lib/data";

const byDiv: Record<string, number> = {};
const retiredByDiv: Record<string, number> = {};
for (const f of ROSTER) {
  byDiv[f.division] = (byDiv[f.division] ?? 0) + 1;
  if (f.status === "retired") retiredByDiv[f.division] = (retiredByDiv[f.division] ?? 0) + 1;
}
console.log("TOTAL FIGHTERS:", ROSTER.length);
console.log("RETIRED/LEGENDS:", LEGENDS.length, "| HOF icons:", HOF_ICONS.length, "| Champions:", CHAMPIONS.length);
for (const [d, n] of Object.entries(byDiv)) {
  console.log(`${DIVISION_MAP[d as keyof typeof DIVISION_MAP].name}: ${n} (${retiredByDiv[d] ?? 0} retired)`);
}
const ids = ROSTER.map((f) => f.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log("DUPLICATE IDS:", dupes.length ? dupes : "none");
const noLog = ROSTER.filter((f) => f.log.length === 0);
console.log("FIGHTERS WITH EMPTY LOG:", noLog.length ? noLog.map((f) => f.name) : "none");
const p4p = p4pList("men").map((f) => f.name);
console.log("MEN P4P TOP 5 (active only):", p4p.slice(0, 5));
const badRounds = ROSTER.flatMap((f) => f.log.filter((e) => e.r < 0 || e.r > 5));
console.log("BAD ROUNDS:", badRounds.length);
for (const name of ["Jon Jones", "Khabib Nurmagomedov", "Georges St-Pierre", "Anderson Silva", "Amanda Nunes", "Ronda Rousey", "Demetrious Johnson", "Conor McGregor"]) {
  const f = ROSTER.find((x) => x.name === name);
  console.log(f ? `OK: ${name} — ${f.w}-${f.l} elo ${f.elo} ${f.log.length} bouts` : `MISSING: ${name}`);
}
