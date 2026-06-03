"use client";

import { useState } from "react";
import axios from "axios";
import { 
  Check, 
  CreditCard, 
  Sparkles, 
  Loader2, 
  Zap, 
  HelpCircle, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { useDashboard } from "../layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BillingPage() {
  const { session, refreshSession } = useDashboard();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "success">("form");
  const [error, setError] = useState("");

  const plans = [
    { 
      name: "free", 
      title: "Free Starter", 
      price: "$0", 
      period: "forever",
      desc: "Perfect for testing LLM analytics workflows.",
      features: ["Max 3 CSV Datasets", "20 AI completions / mo", "Basic Recharts support"]
    },
    { 
      name: "pro", 
      title: "Professional", 
      price: "$49", 
      period: "month",
      desc: "Empower your team with advanced analytical scale.",
      features: ["Max 15 CSV Datasets", "150 AI completions / mo", "Advanced Recharts Gradients", "5 Developer API Keys"]
    },
    { 
      name: "enterprise", 
      title: "Enterprise Suite", 
      price: "$299", 
      period: "month",
      desc: "For high-scale organizations needing tailored models.",
      features: ["Unlimited CSV Datasets", "1000 AI completions / mo", "Dedicated Model Pipelines", "Unlimited API Keys"]
    },
  ];

  const handleOpenCheckout = (planName: string) => {
    if (planName === session?.plan_tier) return;
    setSelectedPlan(planName);
    setCheckoutStep("form");
    setError("");
    setShowCheckout(true);
  };

  const handleProcessUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setError("");
    setCheckingOut(true);

    const token = localStorage.getItem("token");

    // Simulate standard Stripe gateway network latency
    setTimeout(async () => {
      try {
        const response = await axios.post(`${API_URL}/billing/upgrade`, {
          plan_tier: selectedPlan
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === "success") {
          await refreshSession();
          setCheckoutStep("success");
        }
      } catch (err: any) {
        console.error(err);
        setError("Payment gateway transaction rejected. Please check your credentials.");
      } finally {
        setCheckingOut(false);
      }
    }, 2000);
  };

  return (
    <div className="space-y-10 relative">
      {/* Current Quota Status */}
      <div className="p-8 rounded-[32px] border border-zinc-900 bg-zinc-950/40">
        <h3 className="text-lg font-bold text-white mb-6">Subscription Usage Quota</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Queries completion progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-400">AI Dialogue Credits Consumed</span>
              <span className="text-white">{session?.credits_used} / {session?.credits_total}</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, ((session?.credits_used ?? 0) / (session?.credits_total ?? 1)) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal font-semibold">
              Credits reset on next billing cycle. Additional query boosts can be configured.
            </p>
          </div>

          {/* Plan badge */}
          <div className="flex flex-col justify-center border-l border-zinc-900/80 md:pl-8">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Active Level</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight uppercase">
                {session?.plan_tier} Plan
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-wider uppercase border border-indigo-500/10">
                <Zap size={10} /> Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => {
          const isActive = session?.plan_tier === p.name;
          return (
            <div 
              key={p.name} 
              className={`flex flex-col p-8 rounded-[32px] border relative ${
                isActive 
                  ? "border-2 border-indigo-650 bg-zinc-950/80 shadow-xl shadow-indigo-600/5" 
                  : "border-zinc-900 bg-zinc-950/20"
              }`}
            >
              {isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
                  Active Subscription
                </div>
              )}
              
              <h4 className="text-lg font-bold text-white capitalize mb-1">{p.title}</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">{p.price}</span>
                <span className="text-xs text-zinc-500 font-semibold">/ {p.period}</span>
              </div>
              
              <p className="text-zinc-550 text-xs leading-normal mb-6 font-medium">{p.desc}</p>
              
              <ul className="space-y-4 mb-8 flex-1 text-xs text-zinc-300">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex gap-2 items-center font-medium">
                    <Check size={14} className="text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={isActive}
                onClick={() => handleOpenCheckout(p.name)}
                className={`w-full py-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-lg ${
                  isActive
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200 cursor-pointer"
                }`}
              >
                {isActive ? "Active Plan" : `Upgrade to ${p.title.split(" ")[0]}`}
                {!isActive && <ArrowRight size={12} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sleek Stripe checkout simulation modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 shadow-2xl relative">
            
            {checkoutStep === "form" ? (
              <form onSubmit={handleProcessUpgrade} className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900/60">
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="text-indigo-400 animate-pulse" size={16} />
                      SaaS Payment Portal
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Secure simulated Stripe session</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="text-zinc-550 hover:text-white font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {error && (
                  <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-2xl flex justify-between items-center">
                  <div className="text-xs">
                    <p className="font-bold text-white capitalize">{selectedPlan} Professional subscription</p>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Renews automatically</p>
                  </div>
                  <span className="text-sm font-black text-white">
                    {selectedPlan === "pro" ? "$49.00" : "$299.00"}
                  </span>
                </div>

                {/* Mock Card Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Credit Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input 
                        type="text" 
                        required
                        placeholder="4242 4242 4242 4242"
                        className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 pl-11 pr-4 text-xs font-mono text-white placeholder-zinc-700 transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM / YY"
                        className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 px-4 text-xs text-white placeholder-zinc-700 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">CVC Security</label>
                      <input 
                        type="text" 
                        required
                        placeholder="•••"
                        className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 px-4 text-xs text-white placeholder-zinc-700 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold justify-center pt-2">
                  <Lock size={12} className="text-zinc-600" /> Secure 256-bit encrypted checkout
                </div>

                <button
                  type="submit"
                  disabled={checkingOut}
                  className="w-full h-12 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xl transition cursor-pointer"
                >
                  {checkingOut ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Authorizing Transaction...
                    </>
                  ) : (
                    <>
                      Complete Payment & Upgrade
                      <ShieldCheck size={14} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                  <Check size={28} className="stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Upgrade Successful!</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-normal">
                    Workspace limits raised instantly. Thank you for supporting **InsightFlow**.
                  </p>
                </div>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Back to Billing
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
