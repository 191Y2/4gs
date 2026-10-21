"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Crown, Star, Zap } from "lucide-react";
import { searchFighters, DIVISIONS } from "@/lib/data";
import { Fighter, DivisionId } from "@/lib/types";
import { overallRating } from "@/lib/engine";
import { hqRankLabel, useUniverseVersion } from "@/lib/universe";
import { FighterAvatar, Flag, RecordText } from "./shared";

interface FighterPickerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  excludeIds?: string[];
  defaultDivision?: DivisionId | "all";
  onSelect: (f: Fighter) => void;
}

// rank chip driven by the LIVE OCTAGONHQ standings — updates after every
// universe bout so the picker never disagrees with the rankings tab
function HqRankChip({ fighter }: { fighter: Fighter }) {
  const label = hqRankLabel(fighter.id);
  if (label === "C") {
    return (
      <span className="inline-flex shrink-0 items-center gap-0.5 rounded border border-[#e0b64c]/60 bg-[#e0b64c]/15 px-1.5 py-0.5 text-[9px] font-display font-bold tracking-widest text-[#e0b64c]">
        <Crown className="h-2.5 w-2.5" />CHAMP
      </span>
    );
  }
  if (label === "UNRANKED") {
    return (
      <span className="inline-flex shrink-0 items-center rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-display tracking-widest text-zinc-600">
        UNRANKED
      </span>
    );
  }
  return (
    <span className="num inline-flex shrink-0 items-center rounded border border-white/20 bg-white/[0.07] px-1.5 py-0.5 text-[10px] font-bold text-zinc-200">
      {label}
    </span>
  );
}

export function FighterPickerDialog({
  open,
  onOpenChange,
  title,
  excludeIds = [],
  defaultDivision = "HW",
  onSelect,
}: FighterPickerProps) {
  useUniverseVersion(); // re-render when HQ ranks/records change
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<DivisionId | "all">(defaultDivision);
  const [filter, setFilter] = useState<"all" | "ranked" | "champions">("all");

  // reset search whenever the picker re-opens (keep last division)
  useEffect(() => {
    if (open) {
      setQuery("");
      setFilter("all");
    }
  }, [open]);

  const list = useMemo(() => {
    let l = searchFighters(query, division, filter).filter((f) => !excludeIds.includes(f.id));
    // HQ-aware filters: ranked = top-15 OCTAGONHQ, champions = current HQ champs
    if (filter === "ranked") l = l.filter((f) => /^#/.test(hqRankLabel(f.id)));
    if (filter === "champions") l = l.filter((f) => hqRankLabel(f.id) === "C");
    // sort: HQ champ first, then HQ rank, then OVR (keeps picker in sync with the rankings tab)
    l = [...l].sort((a, b) => {
      const ra = hqRankLabel(a.id);
      const rb = hqRankLabel(b.id);
      const na = ra === "C" ? 0 : ra === "UNRANKED" ? 999 : parseInt(ra.slice(1), 10);
      const nb = rb === "C" ? 0 : rb === "UNRANKED" ? 999 : parseInt(rb.slice(1), 10);
      if (na !== nb) return na - nb;
      return overallRating(b) - overallRating(a);
    });
    return l;
  }, [query, division, filter, excludeIds]);

  const menDivs = DIVISIONS.filter((d) => d.division === "men");
  const womenDivs = DIVISIONS.filter((d) => d.division === "women");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-4xl h-[85vh] p-0 gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#0f1114]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="h-1.5 red-grad" />
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">{title}</h2>
            <span className="text-[10px] font-display tracking-widest text-zinc-500">
              {list.length} FIGHTERS · OCTAGONHQ RANKS
            </span>
          </div>
          <div className="relative mt-3">
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
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {[...menDivs, ...womenDivs].map((d) => (
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
            {/* ALL kept at the very end — 670 rows is a lot, divisions first */}
            <button
              onClick={() => setDivision("all")}
              className={`rounded-md px-2.5 py-1 text-[11px] font-display font-semibold tracking-wider ${
                division === "all" ? "bg-white text-black" : "border border-white/10 bg-white/5 text-zinc-500 hover:text-white"
              }`}
            >
              ALL
            </button>
            <div className="ml-auto flex items-center gap-1">
              {(["all", "ranked", "champions"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                    filter === f ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {f === "champions" && <Crown className="h-3 w-3" />}
                  {f === "ranked" && <Star className="h-3 w-3" />}
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(85vh-205px)] px-4 py-3 thin-scroll">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {list.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onSelect(f);
                  onOpenChange(false);
                }}
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition-all hover:border-[#e5322d]/40 hover:bg-white/[0.05]"
              >
                <FighterAvatar fighter={f} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-zinc-100 group-hover:text-white">{f.name}</span>
                    {f.nickname && <span className="hidden truncate text-[11px] italic text-zinc-600 sm:block">“{f.nickname}”</span>}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
                    <Flag cc={f.cc} className="h-2.5 w-4" />
                    <RecordText fighter={f} className="text-zinc-400" />
                    <span className="text-zinc-700">·</span>
                    <span className="truncate">{f.style}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <HqRankChip fighter={f} />
                  <span className="flex items-center gap-1 text-[10px] num text-zinc-500">
                    <Zap className="h-2.5 w-2.5 text-[#e0b64c]" /> {overallRating(f)} OVR
                  </span>
                </div>
              </button>
            ))}
          </div>
          {list.length === 0 && (
            <div className="py-16 text-center text-zinc-500">
              <p className="font-display text-lg">NO FIGHTERS FOUND</p>
              <p className="mt-1 text-xs">Clear the search or switch filters.</p>
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-white/10 bg-black/40 px-5 py-2.5">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="ml-auto block text-zinc-400 hover:text-white">
            CLOSE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
