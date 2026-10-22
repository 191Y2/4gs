"use client";

import { Fighter } from "@/lib/types";
import { DIVISION_MAP } from "@/lib/data";
import { overallRating } from "@/lib/engine";
import { hqRankLabel } from "@/lib/universe";
import { champDivisions, beltCountLabel } from "@/lib/belts";
import { Crown } from "lucide-react";

// ---------- Flag (works on Windows, unlike flag emoji) ----------
export function Flag({ cc, className = "h-3.5 w-5" }: { cc: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${cc.toLowerCase()}.png`}
      alt=""
      className={`${className} rounded-[2px] object-cover ring-1 ring-white/20`}
      loading="lazy"
    />
  );
}

// ---------- Monogram avatar ----------
export function FighterAvatar({
  fighter,
  size = "md",
  className = "",
}: {
  fighter: Fighter;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const div = DIVISION_MAP[fighter.division];
  const initials = fighter.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const dims =
    size === "sm" ? "h-9 w-9 text-xs" : size === "md" ? "h-12 w-12 text-sm" : size === "lg" ? "h-16 w-16 text-lg" : "h-24 w-24 text-2xl";
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`${dims} flex items-center justify-center rounded-full font-display font-semibold ${
          fighter.isChampion
            ? "ring-2 ring-[#e0b64c] ring-offset-2 ring-offset-[#0d0e11]"
            : "ring-1 ring-white/15"
        }`}
        style={{
          background: `linear-gradient(140deg, ${div.color}55, rgba(20,22,26,0.9) 70%)`,
        }}
      >
        {initials}
      </div>
      {fighter.isChampion && (
        <div className="absolute -top-1 -right-1 rounded-full bg-[#e0b64c] text-black p-0.5 shadow">
          <Crown className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}

// ---------- OVR badge ----------
export function OvrBadge({ fighter, size = "md" }: { fighter: Fighter; size?: "sm" | "md" | "lg" }) {
  const ovr = overallRating(fighter);
  const tier =
    ovr >= 90 ? "text-[#e0b64c] border-[#e0b64c]/60 bg-[#e0b64c]/10" :
    ovr >= 80 ? "text-[#ff6b66] border-[#e5322d]/50 bg-[#e5322d]/10" :
    "text-zinc-300 border-white/15 bg-white/5";
  const dims = size === "lg" ? "h-16 w-16 text-3xl" : size === "md" ? "h-11 w-11 text-xl" : "h-8 w-8 text-sm";
  return (
    <div className={`flex flex-col items-center ${size === "lg" ? "gap-1" : ""}`}>
      <div className={`${dims} ${tier} border rounded-xl flex items-center justify-center font-display font-bold num`}>
        {ovr}
      </div>
      {size === "lg" && <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-display">OVR</span>}
    </div>
  );
}

// ---------- Division chip ----------
export function DivisionChip({ division, className = "" }: { division: string; className?: string }) {
  const d = DIVISION_MAP[division as keyof typeof DIVISION_MAP];
  if (!d) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-display tracking-wider uppercase ${className}`}
      style={{ background: `${d.color}1a`, color: d.color, border: `1px solid ${d.color}44` }}
    >
      {d.shortName} · {d.limit} LB
    </span>
  );
}

// ---------- Rank badge (LIVE OCTAGONHQ rank — matches the rankings tab) ----------
export function RankBadge({ fighter }: { fighter: Fighter }) {
  const label = hqRankLabel(fighter.id);
  if (label === "C") {
    const belts = champDivisions(fighter);
    return (
      <span className="inline-flex items-center gap-1 rounded bg-[#e0b64c]/15 border border-[#e0b64c]/50 px-1.5 py-0.5 text-[10px] font-display tracking-widest text-[#e0b64c]">
        <Crown className="h-3 w-3" />
        {belts.length > 1 ? `${beltCountLabel(belts.length)} — ${belts.map((d) => DIVISION_MAP[d].shortName).join(" + ")}` : "CHAMPION"}
      </span>
    );
  }
  if (label !== "UNRANKED") {
    return (
      <span className="inline-flex items-center rounded bg-white/5 border border-white/15 px-1.5 py-0.5 text-[10px] font-display tracking-widest text-zinc-300">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded bg-white/[0.03] border border-white/10 px-1.5 py-0.5 text-[10px] font-display tracking-widest text-zinc-500">
      UNRANKED
    </span>
  );
}

// ---------- Record display ----------
export function RecordText({ fighter, className = "" }: { fighter: Fighter; className?: string }) {
  return (
    <span className={`num font-semibold ${className}`}>
      {fighter.w}-{fighter.l}-{fighter.d}
      {fighter.nc ? ` (${fighter.nc} NC)` : ""}
    </span>
  );
}

// ---------- Win-method stacked bar ----------
export function WinMethodBar({ fighter }: { fighter: Fighter }) {
  const total = Math.max(1, fighter.ko + fighter.sub + fighter.dec);
  return (
    <div className="w-full">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div className="bg-[#e5322d]" style={{ width: `${(fighter.ko / total) * 100}%` }} />
        <div className="bg-[#3b82f6]" style={{ width: `${(fighter.sub / total) * 100}%` }} />
        <div className="bg-zinc-500" style={{ width: `${(fighter.dec / total) * 100}%` }} />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 num">
        <span className="text-[#ff6b66] font-semibold">{fighter.ko} KO</span>
        <span className="text-[#6ba1fa] font-semibold">{fighter.sub} SUB</span>
        <span className="text-zinc-300 font-semibold">{fighter.dec} DEC</span>
      </div>
    </div>
  );
}

// ---------- Attribute bar ----------
export function AttributeBar({ label, value, color = "#e5322d" }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-[10px] font-display tracking-wider text-zinc-400 uppercase">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }}
        />
      </div>
      <span className="w-6 shrink-0 text-right text-[10px] num text-zinc-300">{value}</span>
    </div>
  );
}

// ---------- American odds chip ----------
export function OddsChip({ odds, side }: { odds: number; side: "A" | "B" }) {
  const isFav = odds < 0;
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold num ${
        isFav ? "border-[#e5322d]/40 bg-[#e5322d]/10 text-[#ff6b66]" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
      } ${side === "B" ? "rotate-180" : ""}`}
    >
      {odds > 0 ? `+${odds}` : odds}
    </span>
  );
}
