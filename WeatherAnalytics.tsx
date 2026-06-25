import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Sun, 
  CloudRain, 
  Search, 
  Thermometer,
  Compass,
  Trophy,
  History,
  ArrowUpRight,
  Info,
  Cpu,
  Layers,
  Play,
  RefreshCw,
  Sliders,
  Sparkles,
  Plus
} from "lucide-react";
import { DashboardAnalytics } from "../types";

interface WeatherAnalyticsProps {
  analytics: DashboardAnalytics | null;
}

export default function WeatherAnalytics({ analytics }: WeatherAnalyticsProps) {
  // Safe fallbacks
  const stats = {
    totalSearches: analytics?.totalSearches || 0,
    mostSearched: analytics?.mostSearchedLocation || "N/A",
    avgTemp: analytics?.avgTemp || 0,
    hottest: analytics?.hottestLocation || "N/A",
    rainiest: analytics?.rainiestLocation || "N/A",
    trends: analytics?.trends || []
  };

  // SVM Engine State
  const [activeSubTab, setActiveSubTab] = useState<"svg" | "svm">("svm");
  const [svmC, setSvmC] = useState<number>(1.0);
  const [svmEpochs, setSvmEpochs] = useState<number>(300);
  const [svmWeights, setSvmWeights] = useState<[number, number]>([0.45, -0.35]);
  const [svmBias, setSvmBias] = useState<number>(-0.12);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingLog, setTrainingLog] = useState<string>("Ready to train SVM Classifier on search trends.");
  const [customTemp, setCustomTemp] = useState<number>(24);
  const [customHum, setCustomHum] = useState<number>(55);
  const [testPrediction, setTestPrediction] = useState<number | null>(null);

  // Prepare SVM dataset from trends, with beautiful synthetic fallbacks if search history is fresh
  const getSvmDataset = () => {
    const rawDataset = stats.trends.map((t) => {
      // derive deterministic humidity based on condition if not present
      let humidity = 50;
      if (t.condition === "Rainy" || t.condition === "Thunderstorm") humidity = 85;
      else if (t.condition === "Cloudy") humidity = 65;
      else if (t.condition === "Sunny") humidity = 40;
      else if (t.condition === "Snowy") humidity = 90;

      const x1 = t.temp / 45; // Normalized Temp [0, 1]
      const x2 = humidity / 100; // Normalized Humidity [0, 1]

      // Label y: +1 for favorable travel climate (mild temp, moderate/low humidity, clear conditions)
      // -1 for unfavorable/risky (very cold, very hot, or rainy/snowy)
      const isGood = t.temp >= 16 && t.temp <= 30 && !(t.condition === "Rainy" || t.condition === "Thunderstorm" || t.condition === "Snowy");
      const y = isGood ? 1 : -1;

      return {
        x: [x1, x2] as [number, number],
        y,
        label: t.location.split(",")[0],
        temp: t.temp,
        humidity
      };
    });

    if (rawDataset.length >= 4) {
      return rawDataset;
    }

    // High quality synthetic base points to ensure SVM decision boundaries plot beautifully
    return [
      { x: [26/45, 42/100], y: 1, label: "Bangalore", temp: 26, humidity: 42 },
      { x: [22/45, 52/100], y: 1, label: "San Jose", temp: 22, humidity: 52 },
      { x: [18/45, 45/100], y: 1, label: "Sydney", temp: 18, humidity: 45 },
      { x: [38/45, 30/100], y: -1, label: "Dubai", temp: 38, humidity: 30 },
      { x: [14/45, 88/100], y: -1, label: "London", temp: 14, humidity: 88 },
      { x: [28/45, 92/100], y: -1, label: "Mumbai", temp: 28, humidity: 92 },
      { x: [5/45, 80/100], y: -1, label: "Moscow", temp: 5, humidity: 80 }
    ];
  };

  const dataset = getSvmDataset();

  // Run training algorithm
  const handleTrainSVM = () => {
    setIsTraining(true);
    setTrainingLog("Initializing hyperplane dimensions...");

    setTimeout(() => {
      let w: [number, number] = [0.1, -0.1];
      let b = 0.0;
      const lr = 0.04;
      const lambda = 1 / svmC;

      // Soft-margin Linear SVM Subgradient Descent
      for (let epoch = 1; epoch <= svmEpochs; epoch++) {
        for (const item of dataset) {
          const score = item.y * (w[0] * item.x[0] + w[1] * item.x[1] + b);
          if (score < 1) {
            // Misclassified or inside margin
            w[0] = w[0] - lr * (2 * lambda * w[0] - item.y * item.x[0]);
            w[1] = w[1] - lr * (2 * lambda * w[1] - item.y * item.x[1]);
            b = b + lr * item.y;
          } else {
            // Correctly classified outside margin
            w[0] = w[0] - lr * (2 * lambda * w[0]);
            w[1] = w[1] - lr * (2 * lambda * w[1]);
          }
        }
      }

      setSvmWeights(w);
      setSvmBias(b);
      setIsTraining(false);
      setTrainingLog(`Successfully trained Support Vector Machine. Margin Width: ${(2 / Math.sqrt(w[0]*w[0] + w[1]*w[1])).toFixed(3)} units.`);
    }, 700);
  };

  // Recalculate test prediction when sliders change
  useEffect(() => {
    const x1 = customTemp / 45;
    const x2 = customHum / 100;
    const score = svmWeights[0] * x1 + svmWeights[1] * x2 + svmBias;
    setTestPrediction(score >= 0 ? 1 : -1);
  }, [customTemp, customHum, svmWeights, svmBias]);

  // Initial training run
  useEffect(() => {
    handleTrainSVM();
  }, [svmC, svmEpochs]);

  return (
    <div id="analytics-tab" className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-3xl tracking-tight text-slate-900 dark:text-white">
          Dashboard Climate Analytics
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Monitor search densities, identify maximum hot points, and evaluate regional precipitation probabilities.
        </p>
      </div>

      {/* Analytics KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* KPI: Total Searches */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Total Searches
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {stats.totalSearches}
          </h3>
          <p className="text-[10px] text-emerald-500 mt-2 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active database logs</span>
          </p>
        </div>

        {/* KPI: Most Searched Location */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Peak Interest
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display leading-tight truncate">
            {stats.mostSearched}
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
            Most recurring inquiry
          </p>
        </div>

        {/* KPI: Average Temperature */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Mean Climate
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {stats.avgTemp}°C
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
            Average queried temperature
          </p>
        </div>

        {/* KPI: Hottest Location */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Hottest Searched
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-lg">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display truncate">
            {stats.hottest}
          </h3>
          <p className="text-[10px] text-rose-500 font-semibold mt-2">
            Peak solar reading
          </p>
        </div>

        {/* KPI: Rainiest Location */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Wettest Searched
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-lg">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display truncate">
            {stats.rainiest}
          </h3>
          <p className="text-[10px] text-purple-500 font-semibold mt-2">
            Highest precipitation threat
          </p>
        </div>

      </div>

      {/* Chart and Recent activity columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTERACTIVE HISTOGRAM VISUALIZER & SVM CLASSIFIER PANEL */}
        <div id="analytics-temperature-visualizer" className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h4 id="visualizer-heading" className="font-display font-bold text-slate-900 dark:text-white text-base">
                  {activeSubTab === "svg" ? "Search Temperature Histogram" : "Support Vector Machine (SVM) Classifier"}
                </h4>
                <p id="visualizer-description" className="text-slate-400 text-xs mt-0.5">
                  {activeSubTab === "svg" 
                    ? `Comparison profile for the last ${stats.trends.length} recorded search points.`
                    : "Linear decision boundaries separating favorable vs risky travel climates."}
                </p>
              </div>
              
              {/* Dual Engine Selector */}
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <button
                  id="btn-switch-svg-engine"
                  onClick={() => setActiveSubTab("svg")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeSubTab === "svg"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  SVG Engine
                </button>
                <button
                  id="btn-switch-svm-engine"
                  onClick={() => setActiveSubTab("svm")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeSubTab === "svm"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  SVM Engine
                </button>
              </div>
            </div>

            {/* SVG Visual graph container */}
            {activeSubTab === "svg" ? (
              stats.trends.length === 0 ? (
                <div id="visualizer-empty-state" className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400">Perform more searches to populate the temperature graph!</span>
                </div>
              ) : (
                <div id="visualizer-chart-area" className="pt-2">
                  <div id="visualizer-bars-container" className="relative h-56 w-full flex items-end justify-between gap-2.5 pb-6 border-b border-slate-100 dark:border-slate-800">
                    {stats.trends.map((t, idx) => {
                      const barHeightPercent = Math.min(100, Math.max(15, (t.temp / 45) * 100));
                      return (
                        <div key={idx} id={`temp-bar-wrapper-${idx}`} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative max-w-[80px]">
                          {/* Tooltip on Hover */}
                          <div id={`temp-bar-tooltip-${idx}`} className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-950 text-white text-[10px] py-1 px-2.5 rounded shadow-xl font-mono whitespace-nowrap z-20 transition-all">
                            {t.location.split(",")[0]}: {t.temp}°C
                          </div>

                          {/* Bar */}
                          <div 
                            id={`temp-bar-element-${idx}`}
                            className="w-10 sm:w-12 max-w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-lg group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300 animate-fade-in-up"
                            style={{ height: `${barHeightPercent}%` }}
                          ></div>

                          {/* Label */}
                          <span id={`temp-bar-label-${idx}`} className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate max-w-[50px]">
                            {t.location.split(",")[0].slice(0, 5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div id="visualizer-legend" className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-400">
                    <span>Queried Point Index</span>
                    <span>Temperature Range: 0°C - 45°C</span>
                  </div>
                </div>
              )
            ) : (
              /* REAL INTERACTIVE SVM MACHINE LEARNING CLASSIFIER VIEW */
              <div id="svm-classifier-panel" className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 animate-fade-in">
                
                {/* 2D Graph Space (Decision boundary space) */}
                <div className="md:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center relative overflow-hidden h-72">
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                      Hyperspace Boundary Plot
                    </span>
                  </div>

                  {/* Draw SVM Hyperplane Boundary and Datapoints inside SVG */}
                  <svg className="w-full h-full min-h-[220px]" viewBox="0 0 300 220">
                    {/* Grid line helper markings */}
                    <line x1="0" y1="200" x2="300" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="40" y1="0" x2="40" y2="220" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                    
                    {/* Background Decision Region Colors */}
                    {/* Approximated filling by rendering shaded margin bounds */}
                    
                    {/* Draw Decision boundary line (w0*x1 + w1*x2 + b = 0) */}
                    {(() => {
                      // x1 range is 0 to 1 -> maps to x_svg 40 to 280
                      // Y_norm = (-w0 * X_norm - b) / w1
                      // y_svg = 20 + (1 - Y_norm) * 180
                      const getSvgCoords = (X_norm: number) => {
                        const w0 = svmWeights[0];
                        const w1 = svmWeights[1];
                        const b = svmBias;
                        const Y_norm = Math.abs(w1) < 1e-4 ? 0.5 : (-w0 * X_norm - b) / w1;
                        
                        const x_svg = 40 + X_norm * 240;
                        const y_svg = 20 + (1 - Math.max(0, Math.min(1, Y_norm))) * 180;
                        return { x: x_svg, y: y_svg };
                      };

                      const pStart = getSvgCoords(0);
                      const pEnd = getSvgCoords(1);

                      // Margin offset lines (+1 and -1)
                      const getMarginCoords = (X_norm: number, targetMargin: number) => {
                        const w0 = svmWeights[0];
                        const w1 = svmWeights[1];
                        const b = svmBias;
                        const Y_norm = Math.abs(w1) < 1e-4 ? 0.5 : (targetMargin - w0 * X_norm - b) / w1;
                        
                        const x_svg = 40 + X_norm * 240;
                        const y_svg = 20 + (1 - Math.max(0, Math.min(1, Y_norm))) * 180;
                        return { x: x_svg, y: y_svg };
                      };

                      const mStartPos = getMarginCoords(0, 1);
                      const mEndPos = getMarginCoords(1, 1);
                      const mStartNeg = getMarginCoords(0, -1);
                      const mEndNeg = getMarginCoords(1, -1);

                      return (
                        <>
                          {/* Decision Boundary */}
                          <line 
                            x1={pStart.x} y1={pStart.y} 
                            x2={pEnd.x} y2={pEnd.y} 
                            stroke="#6366f1" strokeWidth="3.5" 
                            className="drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                          />
                          {/* Support Vector Margins */}
                          <line 
                            x1={mStartPos.x} y1={mStartPos.y} 
                            x2={mEndPos.x} y2={mEndPos.y} 
                            stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6"
                          />
                          <line 
                            x1={mStartNeg.x} y1={mStartNeg.y} 
                            x2={mEndNeg.x} y2={mEndNeg.y} 
                            stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6"
                          />
                        </>
                      );
                    })()}

                    {/* Plot Dataset Points */}
                    {dataset.map((pt, idx) => {
                      const x_svg = 40 + pt.x[0] * 240;
                      const y_svg = 20 + (1 - pt.x[1]) * 180;
                      const isPositive = pt.y === 1;

                      return (
                        <g key={idx}>
                          <circle 
                            cx={x_svg} cy={y_svg} r="6.5" 
                            fill={isPositive ? "#10b981" : "#f43f5e"}
                            className="cursor-pointer hover:scale-125 transition-transform duration-200"
                          />
                          <circle 
                            cx={x_svg} cy={y_svg} r="9" 
                            fill="none" 
                            stroke={isPositive ? "#10b981" : "#f43f5e"} 
                            strokeWidth="1" opacity="0.4"
                          />
                        </g>
                      );
                    })}

                    {/* Custom User Tester point (Interactive blue diamond) */}
                    {(() => {
                      const custom_x_norm = customTemp / 45;
                      const custom_y_norm = customHum / 100;
                      const x_svg = 40 + custom_x_norm * 240;
                      const y_svg = 20 + (1 - custom_y_norm) * 180;
                      return (
                        <polygon 
                          points={`${x_svg},${y_svg - 8} ${x_svg + 8},${y_svg} ${x_svg},${y_svg + 8} ${x_svg - 8},${y_svg}`}
                          fill="#3b82f6"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="animate-pulse"
                        />
                      );
                    })()}

                    {/* Labels */}
                    <text x="280" y="215" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">Temp (T)</text>
                    <text x="15" y="15" fill="#94a3b8" fontSize="8" transform="rotate(-90 15 15)" fontFamily="monospace">Humidity (H)</text>
                  </svg>

                  {/* Quick legend info inside plot */}
                  <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[8px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> Favorable Weather (+1)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span> Extreme / Rain (-1)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#3b82f6] rotate-45"></span> Tester Point
                    </span>
                  </div>
                </div>

                {/* SVM Real-Time Controller & Custom Inputs */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                  
                  {/* Hyperparameters form */}
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-indigo-500" /> Model Settings
                      </span>
                      <button 
                        onClick={handleTrainSVM}
                        disabled={isTraining}
                        className="p-1 text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                        title="Re-Train Model"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                          <span>Penalty Weight (C):</span>
                          <span>{svmC.toFixed(1)}</span>
                        </div>
                        <input 
                          type="range" min="0.1" max="5.0" step="0.1"
                          value={svmC}
                          onChange={(e) => setSvmC(parseFloat(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                          <span>Stochastic Epochs:</span>
                          <span>{svmEpochs}</span>
                        </div>
                        <input 
                          type="range" min="100" max="600" step="50"
                          value={svmEpochs}
                          onChange={(e) => setSvmEpochs(parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Input Testing */}
                  <div className="space-y-3 bg-indigo-50/15 dark:bg-indigo-950/10 p-4 rounded-xl border border-indigo-100/30 dark:border-indigo-900/10">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-500 flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> Live Predictive Testing
                    </span>
                    
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                          <span>Test Temperature:</span>
                          <span>{customTemp}°C</span>
                        </div>
                        <input 
                          type="range" min="0" max="45"
                          value={customTemp}
                          onChange={(e) => setCustomTemp(parseInt(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                          <span>Test Humidity:</span>
                          <span>{customHum}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100"
                          value={customHum}
                          onChange={(e) => setCustomHum(parseInt(e.target.value))}
                          className="w-full accent-teal-500"
                        />
                      </div>
                    </div>

                    <div className={`mt-2 p-2.5 rounded-lg border text-center text-xs font-bold transition-all ${
                      testPrediction === 1 
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20"
                        : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/20"
                    }`}>
                      Classified: {testPrediction === 1 ? "✓ Favorable travel climate" : "✗ Risky / extreme weather"}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-500" />
            <span>
              {activeSubTab === "svg" 
                ? "Interactive Tooltips enabled. Simply hover over any temperature bar."
                : trainingLog}
            </span>
          </div>
        </div>

        {/* RECENT TIMELINE ACTIVITY LOG */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">
              Recent Activity Timeline
            </h4>
            <History className="w-4 h-4 text-slate-400" />
          </div>

          {stats.trends.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No queries logged yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.trends.slice(-4).reverse().map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {act.temp}°C
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {act.location}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{act.condition}</span>
                      <span>{act.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
