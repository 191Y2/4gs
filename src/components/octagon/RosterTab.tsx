"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { searchFighters, DIVISIONS, ROSTER, LEGENDS } from "@/lib/data";
import { DivisionId, Fighter } from "@/lib/types";
import { overallRating, currentStreak } from "@/lib/engine";
import { simRecord, useUniverseVersion } from "@/lib/universe";
import { useApp } from "./AppContext";
import { useBeltsVersion } from "@/lib/belts";
import { FighterAvatar, Flag, RecordText, RankBadge, WinMethodBar } from "./shared";
import { Search, X, Crown, Star, Zap, TrendingUp, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";

function FighterTile({ fighter, i }: { fighter: Fighter; i: number }) {
  const { openProfile } = useApp();
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.02, 0.3) }}
      onClick={() => openProfile(fighter.id)}
      className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#e5322d]/40 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between">
        <FighterAvatar fighter={fighter} size="md" />
        <div className="flex flex-col items-end gap-1">
          {fighter.legend ? (
            <span className="inline-flex items-center gap-1 rounded border border-[#e0b64c]/60 bg-gradient-to-r from-[#e0b64c]/25 to-[#e0b64c]/10 px-1.5 py-0.5 text-[9px] font-display font-bold tracking-widest text-[#e0b64c]">
              <Trophy className="h-2.5 w-2.5" /> HOF
            </span>
          ) : (
            <RankBadge fighter={fighter} />
          )}
          {currentStreak(fighter) >= 3 && (
            <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400 num">
              <TrendingUp className="h-2.5 w-2.5" /> {currentStreak(fighter)} IN A ROW
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 truncate font-display text-base font-bold text-white group-hover:text-[#ff6b66]">
        {fighter.name}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
        <Flag cc={fighter.cc} className="h-2.5 w-4" />
        <RecordText fighter={fighter} className="text-zinc-400" />
        <span className="rounded border border-[#e0b64c]/30 bg-[#e0b64c]/[0.08] px-1 py-px text-[9px] font-bold text-[#e0b64c]/90 num">
          {simRecord(fighter).w}-{simRecord(fighter).l}-{simRecord(fighter).d} HQ
        </span>
        <span className="text-zinc-700">·</span>
        <span className="truncate">{fighter.style}</span>
      </div>
      <div className="mt-3"><WinMethodBar fighter={fighter} /></div>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] text-zinc-600">{fighter.team}</span>
        <span className="flex items-center gap-1 font-display text-lg font-bold num text-zinc-300">
          <Zap className="h-3 w-3 text-[#e0b64c]" /> {overallRating(fighter)}
        </span>
      </div>
    </motion.button>
  );
}

export function RosterTab() {
  useBeltsVersion(); // crowns & champion filters stay live when belts move
  useUniverseVersion(); // HQ records on tiles stay live when events settle
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<DivisionId | "all">("all");
  const [filter, setFilter] = useState<"all" | "ranked" | "champions" | "legends">("all");
  const [sort, setSort] = useState<"ovr" | "elo" | "name">("ovr");

  const list = useMemo(() => {
    let l = searchFighters(query, division, filter);
    if (sort === "ovr") l = [...l].sort((a, b) => overallRating(b) - overallRating(a));
    else if (sort === "elo") l = [...l].sort((a, b) => b.elo - a.elo);
    else l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [query, division, filter, sort]);

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">FIGHTER DATABASE</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {ROSTER.length} fighters · {LEGENDS.length} legends & Hall-of-Famers — all in their prime · full bout histories · tap any fighter
        </p>
      </div>

      {/* controls */}
      <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, nickname, country, team, style…"
            className="border-white/10 bg-black/40 pl-9 text-zinc-100 placeholder:text-zinc-600 focus:border-[#e5322d]/60"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setDivision("all")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-display font-semibold tracking-wider ${
              division === "all" ? "red-grad text-white" : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            ALL
          </button>
          {DIVISIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDivision(d.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-display font-semibold tracking-wider ${
                division === d.id ? "text-white" : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
              }`}
              style={division === d.id ? { background: d.color, borderColor: d.color } : undefined}
            >
              {d.shortName}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1">
            {(["all", "ranked", "champions", "legends"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                  filter === f ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                }`}
              >
                {f === "champions" && <Crown className="h-3 w-3" />}
                {f === "ranked" && <Star className="h-3 w-3" />}
                {f === "legends" && <Trophy className="h-3 w-3" />}
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="font-display tracking-widest">SORT</span>
          {(["ovr", "elo", "name"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded px-2 py-0.5 font-semibold uppercase ${
                sort === s ? "bg-[#e5322d]/20 text-[#ff6b66]" : "text-zinc-500 hover:text-white"
              }`}
            >
              {s === "ovr" ? "Overall" : s === "elo" ? "Elo" : "A–Z"}
            </button>
          ))}
          <span className="ml-auto num">{list.length} results</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((f, i) => (
          <FighterTile key={f.id} fighter={f} i={i} />
        ))}
      </div>
      {list.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
          <p className="font-display text-lg text-zinc-500">NO FIGHTERS FOUND</p>
          <p className="mt-1 text-xs text-zinc-600">Try clearing the search or filters.</p>
        </div>
      )}
    </div>
  );
}
