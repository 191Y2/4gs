import { NextResponse } from "next/server";
import { ROSTER } from "@/lib/data";

// Build-time helper: dumps the fully-assembled roster (all fighters with
// their complete bout histories, ghosts included) as JSON. Run once and save
// to src/lib/data/roster.prebuilt.json so the client never has to generate
// careers at runtime — that's what makes page loads instant.
export async function GET() {
  return NextResponse.json({ fighters: ROSTER });
}
