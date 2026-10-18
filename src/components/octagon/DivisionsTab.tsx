"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DIVISIONS } from "@/lib/data";
import { overallRating } from "@/lib/engine";
import { DivisionId } from "@/lib/types";
import { divisionStandings, universeActive, useUniverseVersion } from "@/lib/universe";
import { useApp } from "./AppContext";
import { FighterAvatar, Flag, RecordText } from "./shared";
import { Crown, ChevronDown } from "lucide-react";

function DivisionSection({ divId, index }: { divId: DivisionId; index: number }) {
  const { openProfile } = useApp();
  const standings = divisionStandings(divId);
  const legendCount = standings.filter((s) => s.fighter.status === "retired").length;
  const champ = standings.find((s) => s.rank === "C");
  const contenders = standings.filter((s) => s.rank !== "C");
  const div = DIVISIONS.find((d) => d.id === divId)!;
  const [open, setOpen] = useState(true);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015]"
    >
      {/* header */}
      <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 text-left transition-colors hover:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg font-display text-[10px] font-bold"
              style={{ background: `${div.color}22`, color: div.color, border: `1px solid ${div.color}55` }}
            >
              {div.shortName}
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">{div.name.toUpperCase()}</h3>
              <p className="text-[10px] text-zinc-500">
                {standings.length} fighters{legendCount > 0 ? ` · ${legendCount} retired legends` : ""} · limit {div.limit} lb
              </p>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${open ? "" : "-rotate-90"}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-white/5">
          {/* champion banner */}
          {champ && (
            <button
              onClick={() => openProfile(champ.fighter.id)}
              className="group flex w-full items-center gap-4 border-b border-[#e0b64c]/15 bg-gradient-to-r from-[#e0b64c]/[0.08] to-transparent px-4 py-3.5 text-left transition-colors hover:from-[#e0b64c]/[0.14]"
            >
              <FighterAvatar fighter={champ.fighter} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Crown className="h-3.5 w-3.5 text-[#e0b64c]" />
                  <span className="text-[9px] font-display tracking-[0.25em] text-[#e0b64c]">CHAMPION</span>
                </div>
                <div className="mt-0.5 truncate font-display text-lg font-bold text-white group-hover:text-[#e0b64c]">
                  {champ.fighter.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <Flag cc={champ.fighter.cc} className="h-2.5 w-4" />
                  <span className="num font-bold text-[#e0b64c]">
                    {champ.simW}-{champ.simL}-{champ.simD}
                  </span>
                  <span className="text-zinc-600">OCTAGONHQ</span>
                  <span className="text-zinc-700">·</span>
                  <RecordText fighter={champ.fighter} />
                  <span className="text-zinc-700">·</span>
                  <span>{champ.fighter.style}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="num font-display text-2xl font-bold text-[#e0b64c]">{champ.pts}</div>
                <div className="text-[9px] font-display tracking-widest text-zinc-500">PTS</div>
              </div>
            </button>
          )}

          {/* ranked contenders */}
          <div className="divide-y divide-white/5">
            {contenders.slice(0, 15).map((s) => (
              <button
                key={s.fighter.id}
                onClick={() => openProfile(s.fighter.id)}
                className="group flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="num w-8 shrink-0 text-center font-display text-xs font-bold text-zinc-600">
                  {s.rank}
                </span>
                <FighterAvatar fighter={s.fighter} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-zinc-200 group-hover:text-white">
                    {s.fighter.name}
                    {s.fighter.nickname && <span className="ml-1.5 hidden text-[10px] italic text-zinc-600 sm:inline">“{s.fighter.nickname}”</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                    <Flag cc={s.fighter.cc} className="h-2 w-3.5" />
                    <span className={`num font-bold ${s.pts > 0 ? "text-[#e0b64c]" : "text-zinc-400"}`}>
                      {s.simW}-{s.simL}-{s.simD}
                    </span>
                    <RecordText fighter={s.fighter} className="text-zinc-600" />
                  </div>
                </div>
                <span className={`num font-display text-sm font-bold ${s.pts > 0 ? "text-[#e0b64c]" : "text-zinc-600"}`}>
                  {s.pts}
                </span>
                <span className="num font-display text-sm font-bold text-zinc-400">{s.fighter.elo}</span>
                <span className={`num font-display text-sm font-bold ${
                  overallRating(s.fighter) >= 90 ? "text-[#e0b64c]" : overallRating(s.fighter) >= 80 ? "text-[#ff6b66]" : "text-zinc-500"
                }`}>
                  {overallRating(s.fighter)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

export function DivisionsTab() {
  useUniverseVersion(); // standings re-render the moment an event settles
  const [gender, setGender] = useState<"men" | "women">("men");
  const divs = DIVISIONS.filter((d) => d.division === gender);
  const active = universeActive();

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">OCTAGONHQ RANKINGS</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {active
              ? "Standings driven purely by universe event results — decision win +3 pts · finish +4 · title win +1"
              : "Everyone starts 0-0 — pre-event order is the real-world seeding. Run an event and the rankings take over."}
          </p>
        </div>
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          {(["men", "women"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-4 py-1.5 font-display text-xs font-bold tracking-widest ${
                gender === g ? "red-grad text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {g.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {divs.map((d, i) => (
          <DivisionSection key={d.id} divId={d.id} index={i} />
        ))}
      </div>
    </div>
  );
}
