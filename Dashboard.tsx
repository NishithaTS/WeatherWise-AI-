import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Navigation, 
  Wind, 
  Droplets, 
  Sun, 
  Thermometer, 
  Compass, 
  Eye, 
  Clock, 
  Calendar, 
  Sparkles, 
  Plane, 
  Flame, 
  CloudRain, 
  Bike, 
  Camera, 
  AlertTriangle,
  Award, 
  Download,
  Info,
  Check,
  X,
  Footprints,
  Briefcase,
  HeartPulse,
  CloudLightning,
  Cloud,
  Loader2
} from "lucide-react";
import { WeatherData, HistoryRecord } from "../types";

interface DashboardProps {
  weather: WeatherData | null;
  loading: boolean;
  onSearch: (query: string) => Promise<void>;
  onGeoLocate: () => void;
  savedRecords: HistoryRecord[];
  onSaveReport: (notes: string, plans: string, startDate?: string, endDate?: string) => void;
  searchError: string | null;
}

export default function Dashboard({ 
  weather, 
  loading, 
  onSearch, 
  onGeoLocate, 
  savedRecords, 
  onSaveReport,
  searchError
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [quickNotes, setQuickNotes] = useState("");
  const [quickPlans, setQuickPlans] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Suggestions for common locations
  const suggestions = ["Bangalore", "Paris", "New York", "London", "Tokyo", "Dubai"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleSaveSubmit = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setValidationError("End date must be on or after start date.");
        return;
      }
    }
    setValidationError(null);
    onSaveReport(quickNotes, quickPlans, startDate || undefined, endDate || undefined);
    setSaveSuccess(true);
    setQuickNotes("");
    setQuickPlans("");
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSaveModal(false);
    }, 1500);
  };

  // Get condition icon
  const getWeatherIcon = (iconName: string) => {
    const classes = "w-10 h-10 text-blue-500 dark:text-blue-400";
    switch (iconName) {
      case "sun":
        return <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />;
      case "cloud":
        return <Cloud className={classes} />;
      case "cloud-rain":
        return <CloudRain className="w-10 h-10 text-blue-500" />;
      case "cloud-lightning":
        return <CloudLightning className="w-10 h-10 text-purple-500" />;
      case "wind":
        return <Wind className={classes} />;
      default:
        return <Sun className="w-10 h-10 text-amber-500" />;
    }
  };

  return (
    <div id="dashboard-tab" className="space-y-8 animate-fade-in">
      
      {/* Search and Quick Header bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-3xl tracking-tight text-slate-900 dark:text-white">
            Smart Weather Engine
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Analyze conditions, evaluate event safety, and retrieve tailored packing guides.
          </p>
        </div>
        
        {/* Geolocation trigger */}
        <button
          id="btn-geolocation"
          onClick={onGeoLocate}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-sm transition-all shadow-sm border border-indigo-100/50 dark:border-indigo-900/30 cursor-pointer"
        >
          <Navigation className="w-4.5 h-4.5 animate-pulse text-indigo-500" />
          <span>My Current Location</span>
        </button>
      </div>

      {/* Search Form and Error Alerts */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="input-location-search"
              type="text"
              placeholder="Search by City, Town, Landmark, Zip, or Coordinates (lat, lon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <button
            id="btn-submit-search"
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestions list */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Suggestions:</span>
          {suggestions.map((city) => (
            <button
              key={city}
              id={`suggest-${city}`}
              type="button"
              onClick={() => {
                setSearchQuery(city);
                onSearch(city);
              }}
              className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Actionable Error Display */}
        {searchError && (
          <div id="search-error-alert" className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-sm">Search Request Unsuccessful</p>
              <p className="mt-1">{searchError}</p>
              <p className="mt-1.5 font-medium text-[11px] underline cursor-pointer hover:text-red-800" onClick={() => onSearch("Bangalore")}>
                Try reloading our pre-seeded Bangalore data hub as fallback
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div id="skeleton-container" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse h-96 rounded-2xl"></div>
            <div className="bg-slate-200/60 dark:bg-slate-800/60 animate-pulse h-96 rounded-2xl"></div>
          </div>
          <div className="bg-slate-200/60 dark:bg-slate-800/60 animate-pulse h-48 rounded-2xl"></div>
        </div>
      )}

      {/* Main Dashboard Panel */}
      {!loading && weather && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Info Banner - Location & Yesterday Comparison */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-xl shadow-blue-500/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100 text-xs uppercase tracking-widest font-mono font-bold">
                  Active Location Intelligence
                </span>
              </div>
              <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
                {weather.locationName}
              </h3>
              <p className="text-blue-100 text-sm max-w-xl font-medium">
                {weather.comfort?.weatherMoodExplanation || "Beautiful metrics with healthy ozone standards."}
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-xs font-semibold uppercase tracking-wider font-mono border border-white/10">
                {weather.comfort?.weatherMood || "Balanced Day"}
              </span>
              <span className="text-xs text-blue-100 font-medium bg-blue-800/40 px-3.5 py-1.5 rounded-lg border border-white/5">
                {weather.yesterday?.diffText || "Favorable compared to yesterday"}
              </span>
              <span className="text-[10px] text-blue-200/80 font-mono mt-1">
                Last Updated: {new Date(weather.current.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Primary metrics layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CURRENT WEATHER CARD */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-200">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      CURRENT ATMOSPHERE
                    </span>
                    <h4 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100 mt-1">
                      {weather.current.condition}
                    </h4>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {getWeatherIcon(weather.current.conditionIcon)}
                  </div>
                </div>

                {/* Primary Temp block */}
                <div className="flex items-baseline gap-4 mt-6">
                  <span className="text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white font-display">
                    {weather.current.temp}°C
                  </span>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <p className="font-semibold">Feels like {weather.current.feelsLike}°C</p>
                    <p className="text-xs mt-0.5">Dew Point Zone</p>
                  </div>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] uppercase font-mono font-bold">Humidity</span>
                  </div>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {weather.current.humidity}%
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                    <Wind className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[10px] uppercase font-mono font-bold">Wind Speed</span>
                  </div>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {weather.current.windSpeed} km/h
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] uppercase font-mono font-bold">UV Index</span>
                  </div>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {weather.current.uvIndex} of 11
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] uppercase font-mono font-bold">Visibility</span>
                  </div>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {weather.current.visibility} km
                  </span>
                </div>
              </div>

              {/* Sunrise/sunset, pressure banner */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Sunrise: <b>{weather.current.sunrise}</b></span>
                </div>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <span>Sunset: <b>{weather.current.sunset}</b></span>
                </div>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <span>Pressure: <b>{weather.current.pressure} hPa</b></span>
                </div>
              </div>
            </div>

            {/* TRAVEL READINESS SCORE */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-200">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  INTELLIGENT VERDICT
                </span>
                <h4 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 mt-1">
                  Travel Readiness
                </h4>

                {/* Score Indicator Ring */}
                <div className="flex flex-col items-center justify-center my-6">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* SVG Progress Ring */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="64"
                        className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                        strokeWidth="10"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="64"
                        className="stroke-blue-600 dark:stroke-blue-500 fill-none transition-all duration-1000"
                        strokeWidth="10"
                        strokeDasharray={402}
                        strokeDashoffset={402 - (402 * (weather.readiness?.score || 80)) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                        {weather.readiness?.score}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block mt-0.5">
                        / 100
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 text-center font-medium leading-relaxed">
                  {weather.readiness?.explanation || "Conditions are extremely suitable for travel and commuting."}
                </p>
              </div>

              <div className="mt-6">
                <button
                  id="btn-trigger-save"
                  onClick={() => setShowSaveModal(true)}
                  className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-xl text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Log Notes & Travel Plan</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI WEATHER STORY BANNER */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-blue-950/20 p-6 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex items-start gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">
                AI Weather Story Summary
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed italic">
                "Today in {weather.locationName} is {weather.current.condition.toLowerCase()} with mild temperatures of {weather.current.temp}°C and humdity of {weather.current.humidity}%. It's an excellent day to maximize outdoor walking windows or log search timeline memories."
              </p>
            </div>
          </div>

          {/* SECONDARY FEATURES: COMFORT, Packing, Trip Planner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* HUMAN COMFORT INDEX */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
                <h5 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Human Comfort Index
                </h5>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {weather.comfort?.comfortIndex}%
                </span>
                <span className="text-xs text-slate-400">Index Value</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                {weather.comfort?.comfortExplanation || "Highly comfortable humidity and temperature levels."}
              </p>
              <div className="mt-4 p-3 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-100/30">
                <span className="text-[10px] uppercase font-mono font-bold text-rose-600 dark:text-rose-400 block">Health Advisory</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  {weather.health?.healthAdvisor?.[0] || "Stay properly hydrated with clean purified mineral liquids."}
                </p>
              </div>
            </div>

            {/* SMART PACKING ASSISTANT */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <h5 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Smart Packing Assistant
                </h5>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    ✓ Recommended Items
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {weather.packing?.bring?.map((item, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                        {item}
                      </span>
                    )) || <span className="text-xs text-slate-400">Standard everyday outfit</span>}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-red-600 dark:text-red-400 block mb-1">
                    ✗ Avoid Bringing
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {weather.packing?.avoid?.map((item, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-semibold rounded-md border border-red-100 dark:border-red-900/30">
                        {item}
                      </span>
                    )) || <span className="text-xs text-slate-400">None</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* AI TRIP WINDOWS PLANNER */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-amber-500" />
                <h5 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                  AI Trip Planner
                </h5>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <span className="text-slate-500">Sightseeing:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {weather.tripPlanner?.bestSightseeing.split(":").slice(1).join(":") || "3:00 PM - 5:30 PM"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <span className="text-slate-500">Outdoor Walk:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {weather.tripPlanner?.bestWalkWindow.split(":").slice(1).join(":") || "7:00 AM - 9:30 AM"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <span className="text-slate-500">Golden Hour:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                    {weather.tripPlanner?.bestPhotography.split(":").slice(1).join(":") || "5:45 PM - 6:35 PM"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AIR QUALITY & AI EVENT SUITABILITY BOARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AIR QUALITY INSIGHTS */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-teal-500 animate-pulse" />
                  <h5 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Atmospheric Air Quality Index (AQI)
                  </h5>
                </div>
                <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                  (weather.airQuality?.aqi || 45) < 50 
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" 
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                }`}>
                  {weather.airQuality?.label || "Good"}
                </span>
              </div>
              
              <div className="flex items-baseline gap-3 my-4">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {weather.airQuality?.aqi || 45}
                </span>
                <span className="text-xs text-slate-400">AQI Rating</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Health Impact Advice</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {weather.airQuality?.advice || "Air quality is highly satisfactory and poses no atmospheric health risk."}
                </p>
              </div>
            </div>

            {/* AI EVENT SUITABILITY & RISK DETECTOR */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <h5 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                  AI Event Suitability & Risk Detector
                </h5>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Wedding", suitability: weather.events?.wedding?.suitability || "Excellent", risk: weather.events?.wedding?.risk || "Low", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" },
                  { label: "Hiking", suitability: weather.events?.trek?.suitability || "Good", risk: weather.events?.trek?.risk || "Low", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20" },
                  { label: "Picnic", suitability: weather.events?.picnic?.suitability || "Excellent", risk: weather.events?.picnic?.risk || "Low", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20" },
                  { label: "Sports", suitability: weather.events?.cricket?.suitability || "Excellent", risk: weather.events?.cricket?.risk || "Low", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20" },
                  { label: "Road Trip", suitability: weather.events?.roadTrip?.suitability || "Excellent", risk: weather.events?.roadTrip?.risk || "Low", color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20" }
                ].map((ev, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/85 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                      {ev.label}
                    </span>
                    <div className="mt-2 flex flex-col gap-1">
                      <span className={`text-[9px] font-semibold text-center py-0.5 rounded ${ev.color}`}>
                        {ev.suitability}
                      </span>
                      <span className="text-[9px] text-slate-400 text-center">
                        Risk: <b>{ev.risk}</b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* WEATHER IMPACT SCORE SLIDERS */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <h5 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-4">
              Real-time Activity & Weather Impact Score
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: "Travel suitability", score: weather.impactScores?.travel || 80, icon: Plane, color: "bg-blue-600" },
                { label: "Outdoor activity", score: weather.impactScores?.outdoor || 75, icon: Compass, color: "bg-indigo-600" },
                { label: "Running score", score: weather.impactScores?.running || 70, icon: Footprints, color: "bg-rose-600" },
                { label: "Cycling rating", score: weather.impactScores?.cycling || 65, icon: Bike, color: "bg-emerald-600" },
                { label: "Photography index", score: weather.impactScores?.photography || 85, icon: Camera, color: "bg-amber-600" },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-xs border border-slate-100 dark:border-slate-800">
                        <Icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                        {act.score}/100
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {act.label}
                    </span>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className={`h-full ${act.color}`} style={{ width: `${act.score}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5-DAY FORECAST SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                CHRONO PREVIEW
              </span>
              <span className="text-xs text-slate-500">Adaptive Card Layout</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weather.forecast.map((day, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between items-center text-center group"
                >
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {day.date.split(",")[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {day.date.split(",")[1] || "Jun"}
                  </span>

                  <div className="my-4 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl group-hover:scale-110 transition-transform">
                    {getWeatherIcon(day.conditionIcon)}
                  </div>

                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {day.condition}
                  </span>

                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {day.tempMax}°
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {day.tempMin}°
                    </span>
                  </div>

                  {/* Rain probability */}
                  <div className="mt-4 w-full pt-3 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    <CloudRain className="w-3 h-3" />
                    <span>{day.rainProb}% Rain</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARBON-FRIENDLY TRAVEL RECOMMENDER */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-emerald-500 animate-bounce" />
                <h5 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Carbon-Friendly Travel Commute Recommender
                </h5>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
                Eco-Aware
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(weather.carbonFriendly?.recommendations || [
                { mode: "Walking", impact: "Zero carbon output", score: 100 },
                { mode: "Bicycle", impact: "Healthy & Green", score: 95 },
                { mode: "Metro / Train", impact: "High efficiency commuter share", score: 90 }
              ]).slice(0, 3).map((rec, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg">
                    {rec.mode.includes("Bicycle") || rec.mode.includes("bike") ? <Bike className="w-4 h-4" /> : <Footprints className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {rec.mode}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {rec.score}/100 Match
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {rec.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SAVE WEATHER RECORD MODAL */}
      {showSaveModal && (
        <div id="save-modal-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div id="save-modal-content" className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 transition-all animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h5 className="font-display font-bold text-slate-900 dark:text-white text-base">
                Log Personal Notes & Travel Plans
              </h5>
              <button
                id="btn-close-modal"
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full mb-3 animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">
                  Search Report Saved Successfully!
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  View and manage this record anytime in the History tab.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {validationError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200/50 dark:border-red-900/30">
                    {validationError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Personal Location Notes
                  </label>
                  <textarea
                    id="textarea-notes"
                    rows={3}
                    placeholder="Enter notes (e.g., Virtual workshop, flight timing recommendations, etc.)"
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Travel & Walking Plans
                  </label>
                  <input
                    id="input-plans"
                    type="text"
                    placeholder="E.g. Morning jogging slot in Cubbon park, coffee runs."
                    value={quickPlans}
                    onChange={(e) => setQuickPlans(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Start Date
                    </label>
                    <input
                      id="input-start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      End Date
                    </label>
                    <input
                      id="input-end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    id="btn-cancel-save"
                    onClick={() => {
                      setShowSaveModal(false);
                      setValidationError(null);
                    }}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs tracking-wide transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-submit-save"
                    onClick={handleSaveSubmit}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs tracking-wide transition-all cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    Save Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
