"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Brain, Sparkles, Loader2, Database, ShieldAlert, KeyRound } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

// Create context for session details
interface UserSession {
  id: string;
  email: string;
  plan_tier: string;
  credits_used: number;
  credits_total: number;
}

interface DashboardContextType {
  session: UserSession | null;
  activeDatasetName: string | null;
  refreshSession: () => Promise<void>;
  setActiveDatasetName: (name: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  session: null,
  activeDatasetName: null,
  refreshSession: async () => {},
  setActiveDatasetName: () => {}
});

export const useDashboard = () => useContext(DashboardContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeDatasetName, setActiveDatasetName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bypassLoading, setBypassLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleBypass = async () => {
    setBypassLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8000/billing/bypass", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchSession();
    } catch (err) {
      console.error("Failed to toggle developer bypass:", err);
    } finally {
      setBypassLoading(false);
    }
  };

  const fetchSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/auth/session", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSession(response.data);
      
      // Fetch active dataset details to display in top header
      const datasetsResponse = await axios.get("http://localhost:8000/datasets/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const activeId = datasetsResponse.data.active_dataset_id;
      const datasetsList = datasetsResponse.data.datasets;
      if (activeId && datasetsList) {
        const activeItem = datasetsList.find((d: any) => d.id === activeId);
        if (activeItem) {
          setActiveDatasetName(activeItem.filename);
        }
      }
    } catch (err) {
      console.error("Session verification failed:", err);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("/upload")) return "Dataset Manager";
    if (pathname.includes("/analytics")) return "Visual Analytics Suite";
    if (pathname.includes("/ai-insights")) return "AI Insights & Assistant";
    if (pathname.includes("/settings")) return "Developer Settings";
    if (pathname.includes("/billing")) return "Subscription Billing";
    return "Dashboard Overview";
  };

  if (loading) {
    return (
      <div className="bg-black text-zinc-400 min-h-screen flex flex-col gap-4 items-center justify-center font-sans">
        <Loader2 className="text-indigo-500 animate-spin animate-duration-1000" size={32} />
        <span className="text-sm font-semibold tracking-wider uppercase">Loading Workspace...</span>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ 
      session, 
      activeDatasetName, 
      refreshSession: fetchSession, 
      setActiveDatasetName 
    }}>
      <div className="bg-zinc-950 min-h-screen text-zinc-100 font-sans flex">
        {/* Dynamic Sidebar */}
        <Sidebar />

        {/* Workspace Content */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0">
          {/* Dashboard Header / Navbar */}
          <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              {activeDatasetName && (
                <div className="hidden lg:flex items-center gap-2 bg-indigo-950/45 border border-indigo-800/40 rounded-xl px-4 py-2 text-xs font-semibold text-indigo-400">
                  <Database size={13} />
                  <span>Active: {activeDatasetName}</span>
                </div>
              )}

              {session && (
                <button
                  onClick={handleToggleBypass}
                  disabled={bypassLoading}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                    session.plan_tier === "enterprise"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                      : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                  }`}
                  title={session.plan_tier === "enterprise" ? "Active: Full Access Mode. Click to Enforce SaaS limits." : "Active: SaaS Limit Mode. Click to bypass limits."}
                >
                  {bypassLoading ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Sparkles size={11} className={session.plan_tier === "enterprise" ? "animate-pulse" : ""} />
                  )}
                  <span>{session.plan_tier === "enterprise" ? "Developer Access ON" : "Enforce SaaS Limits"}</span>
                </button>
              )}

              {session && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white leading-tight">
                      {session.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">
                      {session.plan_tier === "free" ? "Free Tier" : session.plan_tier === "pro" ? "Professional" : "Enterprise"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/10">
                    {session.email.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
