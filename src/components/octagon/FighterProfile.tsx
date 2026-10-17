"use client";

import { useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Fighter, FightLogEntry } from "@/lib/types";
import { getFighter, FIGHTER_MAP } from "@/lib/data";
import { overallRating, currentStreak } from "@/lib/engine";
import { useApp } from "./AppContext";
import { FighterAvatar, Flag, DivisionChip, RankBadge, RecordText, WinMethodBar, AttributeBar, OvrBadge } from "./shared";
import { Crown, MapPin, Users, Ruler, Trophy, Star, Swords, TrendingUp, X } from "lucide-react";

function methodShort(m: FightLogEntry["m"]): string {
  switch (m) {
    case "KO": return "KO/TKO";
    case "SUB": return "SUBMISSION";
    case "UDEC": return "DEC · UNANIMOUS";
    case "SDEC": return "DEC · SPLIT";
    case "MDEC": return "DEC · MAJORITY";
    case "DQ": return "DQ";
  }
}

function LogRow({ entry }: { entry: FightLogEntry }) {
  const opponent = FIGHTER_MAP[entry.op.toLowerCase().replace(/[.']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")];
  const { openProfile } = useApp();
  const isWin = entry.res === "W";
  const isLoss = entry.res === "L";
  const resColor =
    isWin ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" :
    isLoss ? "bg-[#e5322d]/15 text-[#ff6b66] border-[#e5322d]/40" :
    entry.res === "D" ? "bg-amber-500/15 text-amber-400 border-amber-500/40" :
    "bg-zinc-500/15 text-zinc-400 border-zinc-500/40";

  return (
    <div className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
      {/* result chip */}
      <div className={`flex h-8 w-8 items-center justify-center rounded-md border font-display text-sm font-bold ${resColor}`}>
        {entry.res}
      </div>

      {/* opponent + event */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            className="truncate text-left text-sm font-semibold text-zinc-100 hover:text-[#ff6b66] hover:underline"
            onClick={() => opponent && openProfile(opponent.id)}
          >
            {entry.op}
          </button>
          {opponent?.isChampion && (
            <span title="Current champion">
              <Crown className="h-3 w-3 text-[#e0b64c]" />
            </span>
          )}
          {entry.title && (
            <span className="inline-flex items-center gap-1 rounded border border-[#e0b64c]/50 bg-[#e0b64c]/10 px-1.5 py-px text-[9px] font-display tracking-widest text-[#e0b64c]">
              {entry.title === "interim" ? "INTERIM TITLE" : entry.title === "vacant" ? "VACANT TITLE" : "TITLE FIGHT"}
            </span>
          )}
          {entry.bonus && (
            <span className="inline-flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-px text-[9px] font-display tracking-widest text-emerald-400">
              <Star className="h-2.5 w-2.5" /> {entry.bonus}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="truncate">{entry.ev}</span>
          <span className="text-zinc-700">·</span>
          <span className="num whitespace-nowrap">{entry.date}</span>
        </div>
      </div>

      {/* method */}
      <div className="text-right">
        <div className={`text-xs font-semibold ${isWin ? "text-zinc-200" : isLoss ? "text-[#ff948f]" : "text-zinc-300"}`}>
          {methodShort(entry.m)}
        </div>
        <div className="text-[11px] text-zinc-500 num">
          {entry.m === "UDEC" || entry.m === "SDEC" || entry.m === "MDEC"
            ? "5:00"
            : `R${entry.r}${entry.t ? ` · ${entry.t}` : ""}`}
        </div>
        {entry.det && (
          <div className="mt-0.5 max-w-[160px] truncate text-[10px] text-zinc-600" title={entry.det}>
            {entry.det}
          </div>
        )}
      </div>
    </div>
  );
}

function TaleCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="flex items-center gap-1.5 text-[9px] font-display tracking-[0.15em] text-zinc-500 uppercase">
        {icon} {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold text-zinc-200">{value}</div>
    </div>
  );
}

export function FighterProfileDialog() {
  const { profileId, closeProfile } = useApp();
  const fighter: Fighter | null = profileId ? getFighter(profileId) ?? null : null;
  const log = useMemo(() => (fighter ? [...fighter.log].reverse() : []), [fighter]);

  if (!fighter) return <Dialog open={false} onOpenChange={() => {}}><DialogContent /></Dialog>;

  const ovr = overallRating(fighter);
  const streak = currentStreak(fighter);

  return (
    <Dialog open={!!profileId} onOpenChange={(v) => !v && closeProfile()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-3xl max-h-[92vh] overflow-y-auto thin-scroll rounded-2xl border-white/10 bg-[#101216] p-0 gap-0"
      >
        <DialogTitle className="sr-only">{fighter.name} profile</DialogTitle>
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-t-2xl border-b border-white/10">
          <div className="absolute inset-0 octagon-grid opacity-60" />
          <div className="absolute inset-x-0 top-0 h-1 red-grad" />
          <div className="relative px-5 py-5 sm:px-6">
            <div className="flex items-start gap-4">
              <FighterAvatar fighter={fighter} size="xl" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <RankBadge fighter={fighter} />
                  <DivisionChip division={fighter.division} />
                </div>
                <h2 className="mt-1.5 font-display text-3xl font-bold leading-none text-white">
                  {fighter.name}
                </h2>
                {fighter.nickname && (
                  <p className="mt-1 text-sm font-medium italic text-zinc-400">“{fighter.nickname}”</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                  <Flag cc={fighter.cc} />
                  <span>{fighter.country}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-[#ff6b66] font-semibold">{fighter.style}</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <OvrBadge fighter={fighter} size="lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          {/* Record strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">RECORD</div>
              <div className="mt-1 font-display text-2xl font-bold text-white num">
                {fighter.w}-{fighter.l}-{fighter.d}
                {fighter.nc ? <span className="text-sm text-zinc-500"> · {fighter.nc} NC</span> : null}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">WIN STREAK</div>
              <div className="mt-1 flex items-center gap-1.5 font-display text-2xl font-bold text-emerald-400 num">
                <TrendingUp className="h-4 w-4" /> {streak}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-3">
              <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">ENGINE ELO</div>
              <div className="mt-1 font-display text-2xl font-bold text-zinc-100 num">{fighter.elo}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-3 sm:hidden">
              <div className="flex items-center justify-between">
                <div className="text-[9px] font-display tracking-[0.2em] text-zinc-500">OVR</div>
                <div className="font-display text-2xl font-bold text-[#e0b64c] num">{ovr}</div>
              </div>
            </div>
          </div>

          {/* Win methods */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-display tracking-[0.2em] text-zinc-400">
                <Trophy className="h-3.5 w-3.5 text-[#e0b64c]" /> HOW HE WINS
              </span>
              <span className="text-[10px] text-zinc-500 num">{fighter.w} total wins</span>
            </div>
            <WinMethodBar fighter={fighter} />
          </div>

          {/* Tale of tape */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-display tracking-[0.2em] text-zinc-400">
              <Swords className="h-3.5 w-3.5 text-[#e5322d]" /> TALE OF THE TAPE
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <TaleCell icon={<Ruler className="h-3 w-3" />} label="HEIGHT" value={fighter.height ?? "—"} />
              <TaleCell icon={<Ruler className="h-3 w-3" />} label="REACH" value={fighter.reach ?? "—"} />
              <TaleCell icon={<Users className="h-3 w-3" />} label="AGE" value={`${fighter.age ?? "—"}`} />
              <TaleCell icon={<MapPin className="h-3 w-3" />} label="TEAM" value={fighter.team ?? "—"} />
            </div>
          </div>

          {/* Attributes */}
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-display tracking-[0.2em] text-zinc-400">
              <Star className="h-3.5 w-3.5 text-[#e0b64c]" /> FIGHT ENGINE ATTRIBUTES
            </h3>
            <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <AttributeBar label="Striking" value={fighter.str} />
              <AttributeBar label="Power" value={fighter.pow} />
              <AttributeBar label="Wrestling" value={fighter.wr} color="#3b82f6" />
              <AttributeBar label="Grappling" value={fighter.gr} color="#3b82f6" />
              <AttributeBar label="TD Defense" value={fighter.tdd} color="#eab308" />
              <AttributeBar label="Chin" value={fighter.chin} color="#e0b64c" />
              <AttributeBar label="Cardio" value={fighter.cardio} color="#22c55e" />
            </div>
          </div>

          {/* Fight log */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-[10px] font-display tracking-[0.2em] text-zinc-400">
                <Swords className="h-3.5 w-3.5 text-[#e5322d]" /> BOUT HISTORY — FULL DETAIL
              </h3>
              <span className="text-[10px] text-zinc-500 num">{log.length} fights</span>
            </div>
            <div className="space-y-1.5">
              {log.map((entry, i) => (
                <LogRow key={`${entry.op}-${entry.date}-${i}`} entry={entry} />
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-zinc-600">
              Recent bouts shown from an approximate historical database — records, rankings and Oct 2026 champions
              verified against official listings. Tap an opponent to open their file.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
