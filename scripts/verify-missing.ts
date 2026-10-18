import { ROSTER, FIGHTER_MAP } from "../src/lib/data";
import { slug } from "../src/lib/data/depth";

// slug-aware missing scan (like the runtime resolver actually works)
const bySlug = new Map(ROSTER.map((f) => [f.id, f.name]));
const missing = new Map<string, { count: number; divs: string[] }>();
for (const f of ROSTER) {
  for (const e of f.log) {
    const id = slug(e.op);
    if (!FIGHTER_MAP[id]) {
      const cur = missing.get(e.op) ?? { count: 0, divs: [] };
      cur.count++;
      if (!cur.divs.includes(f.division)) cur.divs.push(f.division);
      missing.set(e.op, cur);
    }
  }
}
console.log("TRULY MISSING (slug-unresolvable):", missing.size);
for (const [name, info] of [...missing.entries()].sort((a, b) => b[1].count - a[1].count)) {
  console.log(`${name} | refs=${info.count} | divs=${info.divs.join(",")}`);
}
void bySlug;
