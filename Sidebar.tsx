import React from "react";
import { 
  CloudSun, 
  Sparkles, 
  History, 
  BarChart3, 
  Trophy, 
  Sun, 
  Moon, 
  BookOpen, 
  Globe
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: CloudSun },
    { id: "ai-assistant", label: "AI Insights & Chat", icon: Sparkles },
    { id: "discovery", label: "Location Explorer", icon: Globe },
    { id: "history", label: "History Manager", icon: History },
    { id: "analytics", label: "Weather Analytics", icon: BarChart3 },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <aside id="app-sidebar" className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 select-none z-10 transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl text-white shadow-md shadow-blue-500/20">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl leading-none bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              WeatherWise AI
            </h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block mt-1">
              v1.2.0 • AI Intern Tech
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium italic">
          "Turning Weather Data Into Smarter Decisions"
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 px-3 block mb-2">
          Workspace Navigation
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold border-l-4 border-blue-600"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
              }`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* PM Accelerator Branding / Creator Info */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
        <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400 block mb-1">
          Developed By
        </span>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Nishitha TS
        </span>
        <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800">
          <span className="text-[9px] font-mono tracking-wider uppercase text-indigo-500 font-bold block mb-1">
            PM Accelerator Program
          </span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            PM Accelerator helps aspiring and experienced product managers, AI professionals, and technology leaders gain practical experience through mentorship, projects, networking, and industry-focused training.
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            System Online (Dev)
          </span>
        </div>
        <button
          id="theme-toggler"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150"
        >
          {isDarkMode ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-700" />
          )}
        </button>
      </div>
    </aside>
  );
}
