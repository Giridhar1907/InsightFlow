"use client";

import { useState } from "react";
import axios from "axios";
import { BarChart3, HelpCircle, Loader2, Play, Sparkles, AlertCircle } from "lucide-react";
import { useDashboard } from "../layout";
import DynamicChart from "@/components/charts/DynamicChart";

export default function VisualAnalytics() {
  const { activeDatasetName } = useDashboard();
  
  const [xAxis, setXAxis] = useState("category");
  const [yAxis, setYAxis] = useState("sales");
  const [aggregation, setAggregation] = useState("sum");
  const [chartType, setChartType] = useState("bar");
  
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!activeDatasetName) {
      setError("Please upload and activate a dataset first");
      return;
    }

    setError("");
    setLoading(true);
    setChartData(null);

    const token = localStorage.getItem("token");

    // Construct a natural language query for the backend planner!
    // This leverages the full power of the existing backend search/agg engine.
    const queryText = `Show ${yAxis} by ${xAxis} using ${aggregation} as a ${chartType} chart`;

    try {
      const response = await axios.post("http://localhost:8000/chart/", {
        question: queryText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        // Enforce the requested type if planner chose something else
        setChartData({
          ...response.data,
          chart_type: chartType
        });
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to construct visualization query. Check if API is running.");
    } finally {
      setLoading(false);
    }
  };

  const columnsList = [
    { label: "Category (Categorical)", value: "category" },
    { label: "Sub-Category (Categorical)", value: "sub-category" },
    { label: "Region (Categorical)", value: "region" },
    { label: "Sales (Numeric)", value: "sales" },
    { label: "Profit (Numeric)", value: "profit" },
    { label: "Quantity (Numeric)", value: "quantity" },
  ];

  return (
    <div className="space-y-10">
      {/* Configuration Controls */}
      <div className="p-8 rounded-[32px] border border-zinc-900 bg-zinc-950/40">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-indigo-400" size={20} />
          Visual Query Builder
        </h3>

        {!activeDatasetName ? (
          <div className="p-6 rounded-2xl border border-amber-500/10 bg-amber-500/5 flex gap-3 text-amber-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-1">No Active Dataset</h4>
              <p className="text-xs text-amber-500/80 leading-normal">
                To build interactive analytics visualizations, go to the **Dataset Manager** and upload or activate a CSV file.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* X Axis */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">X-Axis Variable</label>
                <select 
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-4 text-xs font-semibold text-zinc-300 transition"
                >
                  <option value="category">Category</option>
                  <option value="sub-category">Sub-Category</option>
                  <option value="region">Region</option>
                </select>
              </div>

              {/* Y Axis */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Y-Axis Variable</label>
                <select 
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-4 text-xs font-semibold text-zinc-300 transition"
                >
                  <option value="sales">Sales</option>
                  <option value="profit">Profit</option>
                  <option value="quantity">Quantity</option>
                </select>
              </div>

              {/* Aggregation */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Aggregation</label>
                <select 
                  value={aggregation}
                  onChange={(e) => setAggregation(e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-4 text-xs font-semibold text-zinc-300 transition"
                >
                  <option value="sum">Sum (Total)</option>
                  <option value="mean">Mean (Average)</option>
                  <option value="count">Count (Frequency)</option>
                  <option value="max">Max (Maximum)</option>
                  <option value="min">Min (Minimum)</option>
                </select>
              </div>

              {/* Chart Type */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Chart Type</label>
                <select 
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-4 text-xs font-semibold text-zinc-300 transition"
                >
                  <option value="bar">Bar Visualization</option>
                  <option value="line">Line Visualization</option>
                  <option value="pie">Pie Visualization</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Running Planner...
                  </>
                ) : (
                  <>
                    Execute Visual query
                    <Play size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Render Pane */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="p-20 rounded-[32px] border border-zinc-900 bg-zinc-950/40 flex flex-col items-center justify-center text-center">
            <Loader2 className="text-indigo-500 animate-spin" size={32} />
            <span className="text-xs text-zinc-500 mt-4 uppercase tracking-wider font-bold">Compiling Recharts Canvas...</span>
          </div>
        ) : chartData ? (
          <div className="bg-zinc-950/20 rounded-[32px] overflow-hidden">
            <DynamicChart chartData={chartData} />
          </div>
        ) : (
          <div className="p-20 rounded-[32px] border border-zinc-900 bg-zinc-950/40 flex flex-col items-center justify-center text-center text-zinc-600">
            <HelpCircle size={40} className="text-zinc-700 mb-4" />
            <h4 className="text-sm font-bold text-zinc-400 mb-1">Visualization Screen Empty</h4>
            <p className="text-xs text-zinc-600 max-w-xs leading-normal">
              Configure variables in the builder above and click Execute to render premium interactive charts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
