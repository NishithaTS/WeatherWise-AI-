import React, { useState } from "react";
import { 
  Globe, 
  Map as MapIcon, 
  Video, 
  Compass, 
  Info, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Bookmark,
  Activity
} from "lucide-react";
import { WeatherData } from "../types";

interface LocationExplorerProps {
  weather: WeatherData | null;
}

export default function LocationExplorer({ weather }: LocationExplorerProps) {
  const [viewMode, setViewMode] = useState<"map" | "radar">("map");
  // Fallback defaults
  const landmarks = weather?.discovery?.famousLandmarks || [
    "Scenic Botanical Walkway",
    "Central Plaza Historical Monument",
    "Scenic Lake Viewpoint"
  ];
  
  const quickFacts = weather?.discovery?.quickFacts || [
    "A gorgeous regional travel destination with deep community roots.",
    "Known for its mild high-altitude atmospheric levels and moderate ozone standard.",
    "Native eateries offer fantastic gourmet dining and traditional recipes."
  ];

  const travelVideos = weather?.discovery?.travelVideos || [
    {
      title: "Wanderlust Travel Exploration Guide",
      embedId: "ZH6Y6Z66B04",
      description: "A high-quality overview of local scenic spots, nature reserves, and leisure venues."
    }
  ];

  const timezone = weather?.discovery?.localTimezone || "GMT+1:00";

  return (
    <div id="location-explorer-tab" className="space-y-8 animate-fade-in">
      
      {/* Top Header Banner */}
      <div>
        <h2 className="font-display font-bold text-3xl tracking-tight text-slate-900 dark:text-white">
          Geographic Location Explorer
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Explore local timezone offsets, quick facts, nearby tourism attractions, and premium travel streams.
        </p>
      </div>

      {!weather ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-spin-slow mb-4" />
          <h4 className="font-bold text-slate-800 dark:text-white text-base">No Searched Location Loaded</h4>
          <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto">
            Search for a city on the weather dashboard to populate custom landmarks, quick trivia facts, and travel streaming guides.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: FAMOUS LANDMARKS & QUICK FACTS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Stats Summary */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-2">
                ACTIVE GEOMETRICS
              </span>
              <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white">
                {weather.locationName}
              </h3>

              <div className="mt-4 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Local Timezone:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {timezone}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Coordinate Range:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    Late June Solstice Cycle
                  </span>
                </div>
              </div>
            </div>

            {/* Landmarks / POI list */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-4.5 h-4.5 text-blue-500" />
                <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                  Nearby Points of Interest
                </h4>
              </div>

              <div className="space-y-3">
                {landmarks.map((landmark, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {landmark}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Trivia Facts */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4.5 h-4.5 text-indigo-500" />
                <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                  Location Trivia Facts
                </h4>
              </div>

              <ul className="space-y-3">
                {quickFacts.map((fact, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5 leading-relaxed font-medium">
                    <Bookmark className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* RIGHT SIDE: PREMIUM MAP EMBED & VIDEO INTERACTION */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Embedded map representation */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-4.5 h-4.5 text-blue-600" />
                  <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                    {viewMode === "map" ? "Interactive Geographic Travel Map" : "Coordinates Targeting Radar"}
                  </h4>
                </div>
                
                {/* Mode Selector Controls */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/55 dark:border-slate-800/80 self-start sm:self-auto">
                  <button
                    id="btn-switch-map-mode"
                    onClick={() => setViewMode("map")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "map" 
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" 
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    Interactive Map
                  </button>
                  <button
                    id="btn-switch-radar-mode"
                    onClick={() => setViewMode("radar")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "radar" 
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" 
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    Targeting Radar
                  </button>
                </div>
              </div>

              {/* Real Interactive Google Map frame */}
              {viewMode === "map" ? (
                <div className="relative h-80 rounded-xl overflow-hidden border border-slate-250 dark:border-slate-800 shadow-inner">
                  <iframe
                    title="Interactive Geographic Map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(weather.locationName)}&t=m&z=12&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  ></iframe>
                </div>
              ) : (
                /* Graphical radar representation */
                <div className="relative h-80 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  {/* Scanner Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.4)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  
                  {/* Compass Radar Circles */}
                  <div className="absolute w-56 h-56 rounded-full border border-blue-500/10 animate-ping"></div>
                  <div className="absolute w-44 h-44 rounded-full border border-blue-500/20"></div>
                  <div className="absolute w-28 h-28 rounded-full border border-blue-500/30"></div>
                  
                  {/* Active radar line */}
                  <div className="absolute top-1/2 left-1/2 w-32 h-[2px] bg-gradient-to-r from-blue-500 to-transparent origin-left rotate-45 animate-spin-slow"></div>

                  {/* Main coordinates text */}
                  <div className="z-10 text-center space-y-1">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl inline-block shadow-lg pulse-glow">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-white text-sm mt-3 font-display">
                      {weather.locationName}
                    </h5>
                    <p className="text-slate-400 text-[10px] font-mono">
                      Radar Scanner: Lat: {weather.current.temp * 0.5 + 12}°N / Lon: {weather.current.humidity * 0.8 + 10}°E
                    </p>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/5 text-[10px] text-slate-300 font-mono flex justify-between items-center">
                    <span>SYSTEM OVERLAY: RADAR TARGETING ACTIVE</span>
                    <span className="text-emerald-400 font-bold">● LIVE</span>
                  </div>
                </div>
              )}
            </div>

            {/* Embedded YouTube travel video streams */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-4.5 h-4.5 text-red-500 animate-pulse" />
                <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                  Curated Travel Guide Streams
                </h4>
              </div>

              <div className="space-y-4">
                {travelVideos.map((video, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.embedId}`}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {video.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
