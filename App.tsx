import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AIAssistant from "./components/AIAssistant";
import LocationExplorer from "./components/LocationExplorer";
import HistoryManager from "./components/HistoryManager";
import WeatherAnalytics from "./components/WeatherAnalytics";
import AchievementsSystem from "./components/AchievementsSystem";
import { WeatherData, HistoryRecord, DashboardAnalytics } from "./types";
import { CloudSun, Sun, Moon, Sparkles, Navigation } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [savedRecords, setSavedRecords] = useState<HistoryRecord[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Sync mode with classList on HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Load search history list & analytics on mount
  useEffect(() => {
    loadSavedRecords();
    loadAnalytics();
    // Auto geolocate user on first visit automatically
    autoGeolocate();
  }, []);

  const loadSavedRecords = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setSavedRecords(data);
      }
    } catch (e) {
      console.error("Failed to load search history logs:", e);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error("Failed to load analytics trends:", e);
    }
  };

  // Perform search (By query or lat/lon coordinates)
  const handleSearch = async (query: string, lat?: number, lon?: number) => {
    setLoading(true);
    setSearchError(null);
    try {
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, lat, lon }),
      });

      if (!response.ok) {
        throw new Error("Local intelligence engine failed to fetch relevant region results.");
      }

      const data = await response.json();
      setWeather(data.weatherData);
      
      // Reload timeline history and analytics graphs automatically
      await loadSavedRecords();
      await loadAnalytics();
    } catch (err: any) {
      console.error("Search failed:", err);
      setSearchError(err?.message || "Invalid search query target. Try adjusting details.");
    } finally {
      setLoading(false);
    }
  };

  // Automatic geolocation triggered on launch or via Dashboard button
  const autoGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleSearch("", latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation permission skipped or unavailable. Defaulting to Bangalore.", error);
          // Auto load pre-seeded beautiful Bangalore dashboard
          handleSearch("Bangalore");
        },
        { timeout: 8000 }
      );
    } else {
      handleSearch("Bangalore");
    }
  };

  // Save report (CRUD CREATE) with notes & plans
  const handleSaveReport = async (notes: string, plans: string, startDate?: string, endDate?: string) => {
    if (!weather) return;
    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: weather.locationName,
          coordinates: { lat: 12.97, lon: 77.59 }, // fallback coordinates
          weatherSummary: `${weather.current.temp}°C, ${weather.current.condition}. ${weather.comfort.weatherMoodExplanation}`,
          notes,
          travelPlans: plans,
          weatherData: weather,
          startDate,
          endDate
        }),
      });

      if (response.ok) {
        await loadSavedRecords();
        await loadAnalytics();
      }
    } catch (e) {
      console.error("Failed to write manual weather report logs:", e);
    }
  };

  // Update notes/travel plans (CRUD UPDATE)
  const handleUpdateRecord = async (id: string, updatedFields: Partial<HistoryRecord>) => {
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        await loadSavedRecords();
        await loadAnalytics();
      }
    } catch (e) {
      console.error("Failed to modify history report record:", e);
    }
  };

  // Delete search record (CRUD DELETE)
  const handleDeleteRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadSavedRecords();
        await loadAnalytics();
      }
    } catch (e) {
      console.error("Failed to delete record:", e);
    }
  };

  // Tab View Dispatcher router
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            weather={weather}
            loading={loading}
            onSearch={handleSearch}
            onGeoLocate={autoGeolocate}
            savedRecords={savedRecords}
            onSaveReport={handleSaveReport}
            searchError={searchError}
          />
        );
      case "ai-assistant":
        return <AIAssistant weather={weather} />;
      case "discovery":
        return <LocationExplorer weather={weather} />;
      case "history":
        return (
          <HistoryManager
            records={savedRecords}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onRefreshRecords={loadSavedRecords}
          />
        );
      case "analytics":
        return <WeatherAnalytics analytics={analytics} />;
      case "achievements":
        return <AchievementsSystem records={savedRecords} />;
      default:
        return (
          <Dashboard
            weather={weather}
            loading={loading}
            onSearch={handleSearch}
            onGeoLocate={autoGeolocate}
            savedRecords={savedRecords}
            onSaveReport={handleSaveReport}
            searchError={searchError}
          />
        );
    }
  };

  return (
    <div id="weatherwise-root" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-250">
      
      {/* LEFT SIDEBAR: Branding and tab controller */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />

      {/* RIGHT SIDEBAR CONTENT FRAME */}
      <main id="app-main-content-frame" className="flex-1 p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Indicator top banner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              ACTIVE WORKSPACE PATH
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {activeTab}
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
            {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Dynamic Inner view */}
        <div id="active-tab-view">
          {renderActiveView()}
        </div>

      </main>

    </div>
  );
}
