// OCTAGON HQ — belt engine harness (Task 15 spec)
// Storyline test of the ONE-BELT-PER-FIGHTER rules on the real roster:
//   A. classic dethrone — beaten champ drops the belt
//   B. superfight — champ vs champ: winner takes loser's belt, OWN belt vacated
//   C. vacant crown — top main-card bout of the vacated division becomes the
//      title fight (main event beats co-main)
//   D. non-title bouts never move belts
//   E. idempotent replay
//   F. women's belts work identically
//   G. no automatic division changes outside user-booked title fights
import { ROSTER, getFighter } from "../src/lib/data";
import {
  transferBelts,
  boutWeightClass,
  beltVacant,
  isTitleBout,
  isSuperfight,
  champDivisions,
} from "../src/lib/belts";
import {
  createEvent,
  addBout,
  recordEventBout,
  isVacantCrown,
  universeBouts,
} from "../src/lib/universe";
import { Fighter, DivisionId, SimResult } from "../src/lib/types";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${extra ? ` — ${extra}` : ""}`);
  }
}
function beltsOf(id: string): DivisionId[] {
  const f = getFighter(id);
  return f ? champDivisions(f) : [];
}
function byName(frag: string, div?: DivisionId): Fighter {
  const f = ROSTER.find(
    (x) => x.name.toLowerCase().includes(frag.toLowerCase()) && (!div || x.division === div)
  );
  if (!f) throw new Error(`fighter not found: ${frag} (${div ?? "any"})`);
  return f;
}
const sim = (winner: "A" | "B"): SimResult => ({
  winner,
  method: "KO",
  detail: "Head Kick",
  round: 2,
  time: "1:30",
  rounds: [],
  sigStrikesA: 42,
  sigStrikesB: 18,
});

const gaethje = byName("gaethje");
const islam = byName("makhachev");
const belal = byName("belal", "WW");
console.log("=== ACT 0 · prebuilt state ===");
check("Gaethje is LW champ", beltsOf(gaethje.id).includes("LW"));
check("Makhachev is WW champ", beltsOf(islam.id).includes("WW"));
check("LW belt not vacant", !beltVacant("LW"));

console.log("=== ACT 1 · where bouts happen (champ defends at HIS belt's weight) ===");
const fwGuy = byName("ortega", "FW"); // non-champ FW fighter
check(
  "LW champ vs FW fighter → contested at LW (not a lower weight)",
  boutWeightClass(gaethje, fwGuy) === "LW"
);
check("…and it is a title fight", isTitleBout(gaethje, fwGuy));
check("two non-champs cross-division → heavier weight, NOT a title fight", !isTitleBout(byName("poirier", "LW"), byName("ortega", "FW")));

console.log("=== ACT 2 · classic dethrone (the Islam/Justin bug) ===");
check("Gaethje vs Makhachev is a superfight", isSuperfight(gaethje, islam));
check("superfight contested at the heavier weight (WW)", boutWeightClass(gaethje, islam) === "WW");
// user's exact scenario: Gaethje (LW champ) beats Makhachev (WW champ)
const changesB = transferBelts(gaethje, islam, "A", boutWeightClass(gaethje, islam), true);
check("belt moved to Gaethje", beltsOf(gaethje.id).includes("WW"));
check("Gaethje holds ONLY the WW belt (no double champ)", beltsOf(gaethje.id).length === 1 && beltsOf(gaethje.id)[0] === "WW", JSON.stringify(beltsOf(gaethje.id)));
check("his old LW belt was VACATED", beltVacant("LW"));
check("Makhachev is no longer champ", beltsOf(islam.id).length === 0);
check("Gaethje moved to the WW roster (division follows the belt)", gaethje.division === "WW", gaethje.division);
check("changes reported: WW to Gaethje + LW vacated", changesB.length === 2 && !!changesB.find((c) => c.div === "WW" && c.newChamp?.id === gaethje.id) && !!changesB.find((c) => c.div === "LW" && c.newChamp === null));

console.log("=== ACT 3 · idempotent replay ===");
transferBelts(gaethje, islam, "A", "WW", true);
check("replaying the same result changes nothing", beltsOf(gaethje.id).length === 1 && beltsOf(gaethje.id)[0] === "WW" && beltVacant("LW"));

console.log("=== ACT 4 · non-title bouts NEVER move belts ===");
const before = beltsOf(belal.id).length;
transferBelts(belal, gaethje, "A", "WW", false);
check("champ loses a non-title bout → keeps belt (isTitle=false)", beltsOf(gaethje.id).length === 1 && beltsOf(gaethje.id)[0] === "WW");
void before;

console.log("=== ACT 5 · vacant crown (LW belt is empty — main/co-main decides) ===");
const ev = createEvent().event!;
const poirier = byName("poirier", "LW");
const oliveira = byName("oliveira", "LW");
const dariush = byName("dariush", "LW");
const gamrot = byName("gamrot", "LW");
const mainBout = addBout(ev.id, poirier.id, oliveira.id, "main")!;      // main event, order 0
const coMainBout = addBout(ev.id, dariush.id, gamrot.id, "main")!;     // co-main, order 1
check("main-event LW bout is the vacant-title fight", isVacantCrown(ev, mainBout));
check("co-main LW bout is NOT (main event takes it, obviously)", !isVacantCrown(ev, coMainBout));
const prelimBout = addBout(ev.id, byName("moicano", "LW").id, byName("hooker", "LW").id, "prelim")!;
check("a prelim fight of the vacated division is just a fight", !isVacantCrown(ev, prelimBout));
const out5 = recordEventBout(ev.id, mainBout.id, sim("B"));
check("recording the vacant-title fight crowned Oliveira", beltsOf(oliveira.id).includes("LW") && !beltVacant("LW"));
check("toast line: vacant crown wording", !!out5?.belts.find((c) => c.oldChamp === null && c.newChamp?.id === oliveira.id));
check("title flag frozen on the bout (replay reproduces it)", mainBout.title === true);
check("ledger has exactly 1 rec", universeBouts().length === 1);
recordEventBout(ev.id, coMainBout.id, sim("A"));
check("co-main stayed a non-title fight (no second LW belt)", beltsOf(oliveira.id).length === 1 && universeBouts().length === 2);

console.log("=== ACT 6 · women's belts work the same ===");
const harrison = byName("harrison");
const nsilva = byName("natalia");
check("Harrison (WBW) vs N.Silva (WFLW) is a superfight", isSuperfight(harrison, nsilva));
transferBelts(harrison, nsilva, "A", boutWeightClass(harrison, nsilva), true);
check("Harrison took the W-FLW belt", beltsOf(harrison.id).includes("WFLW"));
check("her WBW belt vacated — one belt per fighter", beltVacant("WBW") && beltsOf(harrison.id).length === 1);
check("she now sits in the W-FLW roster", harrison.division === "WFLW", harrison.division);

console.log("=== ACT 7 · no automatic division changes ===");
const fwBefore = fwGuy.division;
transferBelts(fwGuy, byName("song", "BW"), "B", "BW", false);
check("non-champ cross-division loss does NOT move his division", fwGuy.division === fwBefore);

console.log(`\n${fail === 0 ? "ALL PASS" : "FAILURES"} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
