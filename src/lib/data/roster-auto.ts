import { DivisionId } from "../types";
import { AUTO_POOL, auto } from "./depth";

// ============ AUTO DEPTH ROSTER ============
// Every name in AUTO_POOL becomes a real database fighter with a complete
// generated UFC career — full bout-by-bout records, ratings & attributes.
// Deterministic (seeded by name), so no hydration surprises. Duplicates are
// stripped by the id-based dedupe in index.ts (hand-written files win).

export const AUTO_HW = build("HW");
export const AUTO_LHW = build("LHW");
export const AUTO_MW = build("MW");
export const AUTO_WW = build("WW");
export const AUTO_LW = build("LW");
export const AUTO_FW = build("FW");
export const AUTO_BW = build("BW");
export const AUTO_FLW = build("FLW");
export const AUTO_WBW = build("WBW");
export const AUTO_WFLW = build("WFLW");
export const AUTO_WSW = build("WSW");

function build(div: DivisionId) {
  return AUTO_POOL[div].map(([name, cc]) => auto(div, name, cc));
}
