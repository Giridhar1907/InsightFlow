"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Sparkles, 
  BrainCircuit, 
  Send, 
  Loader2, 
  FileText, 
  MessageSquare, 
  Lightbulb, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useDashboard } from "../layout";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIInsights() {
  const { activeDatasetName } = useDashboard();
  
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [metaLoading, setMetaLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadMetaData = async () => {
    if (!activeDatasetName) return;

    setMetaLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      // 1. Fetch Executive Summary
      const summaryResponse = await axios.get(`${API_URL}/executive-summary/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExecutiveSummary(summaryResponse.data.summary || "");

      // 2. Fetch Auto Insights Highlights
      const insightsResponse = await axios.get(`${API_URL}/insights/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHighlights(insightsResponse.data.insights || []);

      // 3. Fetch Questions Suggestions
      const questionsResponse = await axios.get(`${API_URL}/questions/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestions(questionsResponse.data.questions || []);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch LLM insights summaries. Is Groq running?");
    } finally {
      setMetaLoading(false);
    }
  };

  useEffect(() => {
    loadMetaData();
  }, [activeDatasetName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handleSendChat = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const queryStr = customPrompt || prompt;
    if (!queryStr.trim()) return;

    if (!activeDatasetName) {
      setError("Please load an active dataset first");
      return;
    }

    const userMsg: Message = { role: "user", content: queryStr };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setChatLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`${API_URL}/analytics/query`, {
        question: queryStr
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.error) {
        setError(response.data.error);
        // Remove the last user message as it failed
        setMessages((prev) => prev.slice(0, -1));
      } else {
        const aiMsg: Message = { role: "assistant", content: response.data.answer };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "LLM completion failed. Verify API token credit quota.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {!activeDatasetName ? (
        <div className="p-8 rounded-[32px] border border-zinc-900 bg-zinc-950/40">
          <div className="p-6 rounded-2xl border border-amber-500/10 bg-amber-500/5 flex gap-3 text-amber-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-1">No Dataset Selected</h4>
              <p className="text-xs text-amber-500/80 leading-normal">
                To consult the conversational AI analyst, navigate to the **Dataset Manager** and upload or select an active dataset.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* AI Dialogue Chat - Left Column (Span 2) */}
          <div className="lg:col-span-2 flex flex-col p-8 rounded-[32px] border border-zinc-900 bg-zinc-950/40 h-[680px]">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <BrainCircuit className="text-indigo-400" size={20} />
              Conversational AI Analyst
            </h3>
            <p className="text-zinc-500 text-xs mb-6">Ask deep questions about your product metrics in plain English.</p>

            {/* Error alerts */}
            {error && (
              <div className="mb-4 p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Bubble Thread Stream */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-zinc-600">
                  <MessageSquare size={36} className="text-zinc-700 mb-3" />
                  <h4 className="text-xs font-bold text-zinc-400 mb-1">Start Dialog Completed</h4>
                  <p className="text-[10px] text-zinc-600 max-w-xs leading-normal">
                    Enter a custom question or click on any suggestion chip on the right to start querying.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      msg.role === "user" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-zinc-900 border border-zinc-800 text-indigo-400"
                    }`}>
                      {msg.role === "user" ? "U" : "AI"}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-650 text-white"
                        : "bg-zinc-900/60 border border-zinc-900 text-zinc-300"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}

              {chatLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900 text-[10px] tracking-wide text-zinc-500 font-semibold uppercase">
                    AI analyst is generating insights...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => handleSendChat(e)} className="flex gap-3">
              <input 
                type="text"
                value={prompt}
                disabled={chatLoading}
                placeholder="e.g. Which product category generates the highest margins and why?"
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 h-12 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 px-4 text-xs text-white placeholder-zinc-650 transition"
              />
              <button 
                type="submit"
                disabled={chatLoading || !prompt.trim()}
                className="w-12 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-40 flex items-center justify-center transition cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* AI Summaries - Right Column */}
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="p-6 rounded-[24px] border border-zinc-900 bg-zinc-950/40 min-h-[160px]">
              <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                <FileText className="text-indigo-400" size={14} />
                Executive Summary
              </h4>
              {metaLoading ? (
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase py-4">
                  <Loader2 size={12} className="animate-spin" /> Retrieving Summary...
                </div>
              ) : executiveSummary ? (
                <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{executiveSummary}</p>
              ) : (
                <p className="text-[10px] text-zinc-600 font-semibold py-4">No summary active. Select active dataset.</p>
              )}
            </div>

            {/* Suggestion Chips */}
            <div className="p-6 rounded-[24px] border border-zinc-900 bg-zinc-950/40">
              <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Lightbulb className="text-violet-400" size={14} />
                Exploration Suggestions
              </h4>
              {metaLoading ? (
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase py-4">
                  <Loader2 size={12} className="animate-spin" /> Loading Chips...
                </div>
              ) : suggestions.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {suggestions.map((chip, i) => (
                    <button
                      key={i}
                      disabled={chatLoading}
                      onClick={() => handleSendChat(undefined, chip)}
                      className="w-full text-left p-3.5 rounded-xl bg-zinc-900/60 hover:bg-indigo-950/15 border border-zinc-800/60 hover:border-indigo-900/40 text-[11px] font-semibold text-zinc-300 leading-normal transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-600 font-semibold py-4">No suggestions available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
