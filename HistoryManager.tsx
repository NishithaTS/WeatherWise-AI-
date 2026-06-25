import React, { useState } from "react";
import { 
  History, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileText,
  Calendar,
  CloudSun,
  MapPin,
  Sparkles,
  Info
} from "lucide-react";
import { HistoryRecord } from "../types";

interface HistoryManagerProps {
  records: HistoryRecord[];
  onUpdateRecord: (id: string, updatedFields: Partial<HistoryRecord>) => void;
  onDeleteRecord: (id: string) => void;
  onRefreshRecords: () => void;
}

export default function HistoryManager({ 
  records, 
  onUpdateRecord, 
  onDeleteRecord,
  onRefreshRecords 
}: HistoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editPlans, setEditPlans] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const startEdit = (record: HistoryRecord) => {
    setEditingId(record.id);
    setEditNotes(record.notes || "");
    setEditPlans(record.travelPlans || "");
    setEditLocation(record.location);
    setEditSummary(record.weatherSummary || "");
    setEditStartDate(record.startDate || "");
    setEditEndDate(record.endDate || "");
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const saveEdit = (id: string) => {
    if (!editLocation.trim() || editLocation.trim().length < 2) {
      setEditError("Location must be at least 2 characters.");
      return;
    }

    if (editStartDate && editEndDate) {
      const start = new Date(editStartDate);
      const end = new Date(editEndDate);
      if (end < start) {
        setEditError("End date must be on or after start date.");
        return;
      }
    }

    setEditError(null);
    onUpdateRecord(id, {
      notes: editNotes,
      travelPlans: editPlans,
      location: editLocation.trim(),
      weatherSummary: editSummary,
      startDate: editStartDate || undefined,
      endDate: editEndDate || undefined
    });
    setEditingId(null);
  };

  // Export functions
  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(records, null, 2);
    downloadFile(jsonStr, "weatherwise-history.json", "application/json");
  };

  const handleExportCSV = () => {
    let csv = "ID,Location,Timestamp,Notes,TravelPlans,WeatherSummary\n";
    records.forEach((r) => {
      const id = `"${r.id}"`;
      const loc = `"${r.location.replace(/"/g, '""')}"`;
      const time = `"${r.searchTimestamp}"`;
      const notes = `"${(r.notes || "").replace(/"/g, '""')}"`;
      const plans = `"${(r.travelPlans || "").replace(/"/g, '""')}"`;
      const summary = `"${(r.weatherSummary || "").replace(/"/g, '""')}"`;
      csv += `${id},${loc},${time},${notes},${plans},${summary}\n`;
    });
    downloadFile(csv, "weatherwise-history.csv", "text/csv");
  };

  const handleExportMarkdown = () => {
    let md = "# WeatherWise AI Search & Travel History Report\n\n";
    md += `Report generated on ${new Date().toLocaleDateString()}\n\n`;
    md += "| Location | Timestamp | Weather Summary | Notes | Travel Plans |\n";
    md += "| --- | --- | --- | --- | --- |\n";
    records.forEach((r) => {
      md += `| ${r.location} | ${new Date(r.searchTimestamp).toLocaleString()} | ${r.weatherSummary} | ${r.notes || "None"} | ${r.travelPlans || "None"} |\n`;
    });
    downloadFile(md, "weatherwise-history.md", "text/markdown");
  };

  return (
    <div id="history-manager-tab" className="space-y-8 animate-fade-in">
      
      {/* Header and export buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl tracking-tight text-slate-900 dark:text-white">
            Saved Reports & Timeline Memory
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Perform CRUD operations, modify private trip logs, and export your history data.
          </p>
        </div>

        {/* EXPORT OPTIONS BAR */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 px-2">Export:</span>
          
          <button
            id="btn-export-json"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 rounded-lg text-xs font-semibold cursor-pointer border border-slate-100 dark:border-slate-800 transition-colors"
          >
            <FileJson className="w-3.5 h-3.5 text-orange-500" />
            <span>JSON</span>
          </button>

          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-300 hover:text-emerald-600 rounded-lg text-xs font-semibold cursor-pointer border border-slate-100 dark:border-slate-800 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV</span>
          </button>

          <button
            id="btn-export-md"
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-lg text-xs font-semibold cursor-pointer border border-slate-100 dark:border-slate-800 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Markdown</span>
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h4 className="font-bold text-slate-800 dark:text-white text-base">No History Records Found</h4>
          <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto">
            Your weather search history memory is currently blank. Execute a new location search to start recording.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 ml-4 space-y-8">
          
          {records.map((rec) => {
            const isEditing = editingId === rec.id;
            return (
              <div key={rec.id} className="relative group">
                
                {/* Timeline Connector node indicator */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 border-4 border-slate-100 dark:border-slate-950 shadow-sm transition-transform group-hover:scale-125"></div>

                {/* Main Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
                  
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-50 dark:border-slate-800/80">
                    <div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-slate-400">EDIT LOCATION NAME:</label>
                          <input
                            type="text"
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full max-w-md px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            {rec.location}
                          </h4>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(rec.searchTimestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* ACTION CONTROLS */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            id={`btn-save-edit-${rec.id}`}
                            onClick={() => saveEdit(rec.id)}
                            className="p-2 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all cursor-pointer"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-cancel-edit-${rec.id}`}
                            onClick={cancelEdit}
                            className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            id={`btn-start-edit-${rec.id}`}
                            onClick={() => startEdit(rec)}
                            className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all cursor-pointer"
                            title="Edit notes & plans"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-delete-record-${rec.id}`}
                            onClick={() => onDeleteRecord(rec.id)}
                            className="p-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl transition-all cursor-pointer"
                            title="Delete memory record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Content details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Weather highlights */}
                    <div className="md:col-span-4 space-y-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        METEOROLOGICAL STAMP
                      </span>
                      {isEditing ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">EDIT SUMMARY:</label>
                          <input
                            type="text"
                            value={editSummary}
                            onChange={(e) => setEditSummary(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                            <CloudSun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                            <span>{rec.weatherSummary || "Standard atmosphere report."}</span>
                          </div>
                          {rec.weatherData?.current && (
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                              Temp: {rec.weatherData.current.temp}°C | Humidity: {rec.weatherData.current.humidity}% | UV: {rec.weatherData.current.uvIndex}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Editable user personal logs (Notes & Plans & Dates) */}
                    <div className="md:col-span-8 space-y-4">
                      {isEditing && editError && (
                        <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200/50 dark:border-red-900/20 font-medium">
                          {editError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Notes Box */}
                        <div className="p-4.5 bg-blue-50/20 dark:bg-blue-950/10 rounded-xl border border-blue-100/30 dark:border-blue-900/10 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold block mb-1">
                              ✓ Personal Notes
                            </span>
                            {isEditing ? (
                              <textarea
                                value={editNotes}
                                onChange={(e) => {
                                  setEditNotes(e.target.value);
                                  setEditError(null);
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                                rows={2}
                              />
                            ) : (
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {rec.notes || "No notes logged. Edit this card to record meetings, events, or travel requirements."}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Travel / Walking plans */}
                        <div className="p-4.5 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-xl border border-indigo-100/30 dark:border-indigo-900/10 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                              ✓ Proposed Travel Plans
                            </span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editPlans}
                                onChange={(e) => {
                                  setEditPlans(e.target.value);
                                  setEditError(null);
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                              />
                            ) : (
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {rec.travelPlans || "No custom plan logged yet. E.g. 'Coffee run during the optimal dry 4:00 PM window.'"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Travel Date Range Info */}
                      <div className="p-4.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                        {isEditing ? (
                          <div className="space-y-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                              Edit Travel Dates (Optional)
                            </span>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">Start Date:</label>
                                <input
                                  type="date"
                                  value={editStartDate}
                                  onChange={(e) => {
                                    setEditStartDate(e.target.value);
                                    setEditError(null);
                                  }}
                                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">End Date:</label>
                                <input
                                  type="date"
                                  value={editEndDate}
                                  onChange={(e) => {
                                    setEditEndDate(e.target.value);
                                    setEditError(null);
                                  }}
                                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <div className="text-xs">
                              <span className="text-slate-400">Planned Trip Duration: </span>
                              {rec.startDate || rec.endDate ? (
                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                  {rec.startDate ? new Date(rec.startDate).toLocaleDateString(undefined, { dateStyle: "medium" }) : "N/A"}
                                  {" — "}
                                  {rec.endDate ? new Date(rec.endDate).toLocaleDateString(undefined, { dateStyle: "medium" }) : "N/A"}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">No specific travel date range set.</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
