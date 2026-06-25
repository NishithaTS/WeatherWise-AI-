import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Clock, 
  Check, 
  AlertTriangle, 
  Sun, 
  Droplets, 
  Wind, 
  Umbrella, 
  BookOpen, 
  HeartPulse,
  Flame,
  Volume2
} from "lucide-react";
import { WeatherData, ChatMessage } from "../types";

interface AIAssistantProps {
  weather: WeatherData | null;
}

export default function AIAssistant({ weather }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am WeatherWise, your AI Assistant. I can evaluate travel safety, outfit selections, and custom sports forecasts. Try asking: 'Can I play cricket today?' or 'Should I carry an umbrella?'",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputVal;
    setInputVal("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: currentQuery,
          weatherContext: weather
        })
      });

      const data = await res.json();
      const aiResponse: ChatMessage = {
        id: "reply_" + Date.now(),
        sender: "ai",
        text: data.text || "I apologize, but I could not compute an answer right now. Keep an eye on local conditions!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("AI Chat communication failure:", err);
      const errorMsg: ChatMessage = {
        id: "error_" + Date.now(),
        sender: "ai",
        text: "My neural models seem slightly disconnected. Let's rely on local weather tables: expect general " + (weather?.current?.condition || "fair") + " metrics.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-assistant-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* LEFT COLUMN: STATIC ADVISORIES & INSIGHTS CARDS */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-spin-slow" />
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">
              Custom AI Weather Insights
            </h4>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Intelligent recommendations parsed from active geographical indicators, moisture percentages, and barometric trends.
          </p>

          <div className="space-y-4">
            {/* Severe Weather Safety Engine */}
            <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase font-mono mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Severe Safety Alerts</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                {weather?.health?.severeWeatherSafety?.[0] || "No heavy storms or severe climate heatwaves active for this coordinate zone. Stay safe!"}
              </p>
            </div>

            {/* Health Advisor */}
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200/50 dark:border-indigo-900/40">
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-400 font-bold text-xs uppercase font-mono mb-1">
                <HeartPulse className="w-4 h-4 text-indigo-500" />
                <span>Health & Hydration Advisor</span>
              </div>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4 mt-1">
                {weather?.health?.healthAdvisor?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) || (
                  <>
                    <li>Keep standard sunscreen on during high afternoon UV index.</li>
                    <li>Drink lots of water. Ensure 3 liters of daily fluid.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Event Suitability detector */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-2">Event Risk Estimator</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-500">Outdoor Trek:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {weather?.events?.trek?.suitability || "Excellent"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-500">Cricket Match:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {weather?.events?.cricket?.suitability || "Excellent"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-500">Wedding / Picnic:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {weather?.events?.wedding?.suitability || "Excellent"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-500">Road Trip:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {weather?.events?.roadTrip?.suitability || "Excellent"}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Day Planner */}
            <div className="p-4 bg-blue-50/30 dark:bg-slate-950/40 rounded-xl border border-blue-100/30 dark:border-slate-800">
              <span className="text-[10px] uppercase font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">
                Student Day Planner
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {weather?.studentPlanner?.leaveHomeTime || "Best commute window starts around 8:00 AM under cool temperatures."}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
                Study Window: {weather?.studentPlanner?.studyPeriods || "Recommended late evening periods."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI CONTEXTUAL CHAT INTERFACE */}
      <div className="lg:col-span-7 flex flex-col h-[580px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        
        {/* Chat header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Bot className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h5 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                Contextual AI Chat Room
              </h5>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Discussing weather suitability in real-time
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono rounded">
            {weather ? weather.locationName : "Generic Mode"}
          </span>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                msg.sender === "user" 
                  ? "bg-blue-600 text-white" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              }`}>
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-500/10"
                    : "bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-tl-none text-slate-700 dark:text-slate-300"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Form footer */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            id="chat-user-input"
            type="text"
            placeholder="Type: 'Can I play cricket?' or 'Do I need a heavy winter coat today?'..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!inputVal.trim() || loading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
