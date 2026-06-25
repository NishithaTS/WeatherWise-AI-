import React from "react";
import { Award, CheckCircle2, Lock, Star, Trophy, Users, Compass, ShieldCheck } from "lucide-react";
import { HistoryRecord } from "../types";

interface AchievementsSystemProps {
  records: HistoryRecord[];
}

export default function AchievementsSystem({ records }: AchievementsSystemProps) {
  const searchCount = records.length;

  const achievementsList = [
    {
      id: "first-search",
      title: "First Search Explorer",
      description: "Triggered your very first WeatherWise atmospheric calculation.",
      metric: "1 Search required",
      unlocked: searchCount >= 1,
      icon: Compass,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "weather-analyst",
      title: "Atmospheric Analyst",
      description: "Logged 3 or more regional climate queries inside MongoDB/JSON layers.",
      metric: "3 Searches required",
      unlocked: searchCount >= 3,
      icon: Star,
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "travel-expert",
      title: "Wanderlust Travel Expert",
      description: "Inquired about weather safety and localized tourist landmarks for over 5 cities.",
      metric: "5 Searches required",
      unlocked: searchCount >= 5,
      icon: Trophy,
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "climatology-pioneer",
      title: "Global Climatologist",
      description: "Pioneered over 10 searches across separate geographic coordinates.",
      metric: "10 Searches required",
      unlocked: searchCount >= 10,
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

  return (
    <div id="achievements-tab" className="space-y-8 animate-fade-in">
      
      {/* Top statistics summary panel */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-950 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Award className="w-5 h-5 text-amber-400 animate-bounce" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
              GAMIFIED SYSTEM ACCOMPLISHMENTS
            </span>
          </div>
          <h3 className="font-display font-bold text-2xl tracking-tight">
            Climate Exploration Badges
          </h3>
          <p className="text-slate-400 text-xs max-w-md">
            Execute more weather queries to unlock active community explorer statuses and custom career honors.
          </p>
        </div>

        {/* Progress ratio */}
        <div className="text-center bg-white/5 backdrop-blur-md px-6 py-4.5 rounded-2xl border border-white/10 shrink-0">
          <span className="text-3xl font-extrabold text-amber-400 font-mono">
            {unlockedCount} / {achievementsList.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1 uppercase font-mono tracking-wider">
            Badges Unlocked
          </span>
        </div>
      </div>

      {/* Grid of Achievements cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievementsList.map((ach) => {
          const Icon = ach.icon;
          return (
            <div
              key={ach.id}
              className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-4 ${
                ach.unlocked
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-slate-300"
                  : "bg-slate-50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-900 opacity-70"
              }`}
            >
              {/* Left Badge circular avatar */}
              <div className={`p-3.5 rounded-xl shrink-0 text-white ${
                ach.unlocked 
                  ? `bg-gradient-to-tr ${ach.color} shadow-lg pulse-glow` 
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400"
              }`}>
                {ach.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              {/* Text info */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-display font-bold text-sm ${
                    ach.unlocked ? "text-slate-900 dark:text-white" : "text-slate-500"
                  }`}>
                    {ach.title}
                  </h4>
                  {ach.unlocked ? (
                    <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
                      Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {ach.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1.5 border-t border-slate-50 dark:border-slate-800">
                  <span>Requirement:</span>
                  <span className="font-mono font-bold">{ach.metric}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
