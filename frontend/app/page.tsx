"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Brain, 
  BarChart3, 
  UploadCloud, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Database,
  TrendingUp
} from "lucide-react";

export default function LandingPage() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <div className="bg-black text-zinc-100 min-h-screen font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-zinc-800/80 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              InsightFlow
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            {sessionToken ? (
              <Link 
                href="/dashboard"
                className="flex items-center gap-1 text-sm bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-zinc-200 transition"
              >
                Go to Dashboard
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-sm font-semibold text-zinc-400 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/25 transition"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-8 shadow-inner shadow-indigo-500/10">
          <Sparkles size={12} />
          Welcome to the Future of Analytics
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-500">
          AI-Powered Data Analytics For Growing SaaS Teams
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload any CSV. Ask questions in plain English. Get back highly polished charts, automated KPI dashboards, and elite business insights in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            href={sessionToken ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/30 text-lg transition duration-200"
          >
            Start Analyzing Free
            <ArrowRight size={18} />
          </Link>
          <a 
            href="#demo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-300 font-semibold px-8 py-4 rounded-2xl text-lg transition duration-200"
          >
            Watch Demo
          </a>
        </div>

        {/* Dashboard Mockup Screen */}
        <div id="demo" className="relative max-w-5xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl shadow-indigo-900/15 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900/60 text-xs text-zinc-500">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <div className="bg-zinc-900 px-12 py-1.5 rounded-lg border border-zinc-800/40">app.insightflow.ai/dashboard</div>
            <div className="w-6" />
          </div>

          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" 
            alt="InsightFlow Dashboard Mockup" 
            className="w-full rounded-2xl object-cover h-[450px] opacity-75 grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none"
          />
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Powerful Analytics Features
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Everything your product needs to unlock insights from raw CSV reports without SQL or Python coding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/25 hover:border-zinc-800 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/10">
              <UploadCloud size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Dataset Manager</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Drag and drop multi-million row CSV files. Our intelligent system sanitizes data, maps types, and serves dynamic data preview tables.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/25 hover:border-zinc-800 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/10">
              <Sparkles size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI conversational chat</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Have a conversation with your dataset. Ask follow-up questions, request trends analysis, and let AI summarize business impact.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/25 hover:border-zinc-800 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 border border-pink-500/10">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Gradient Recharts Engine</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Instantly compile dynamic interactive charts. Select columns, custom aggregation modes, and customize configurations beautifully.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Flexible Plans For Every SaaS
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Choose a plan that fits your dataset scales. Upgrade or downgrade anytime inside your settings page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="flex flex-col p-8 rounded-3xl border border-zinc-900 bg-zinc-950/20 relative">
            <h3 className="text-lg font-bold text-zinc-400 mb-2">Free Starter</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-sm text-zinc-500">/ forever</span>
            </div>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Perfect for exploring small reports and testing out conversational AI interface tools.
            </p>
            <ul className="space-y-4 mb-10 flex-1 text-sm text-zinc-300">
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> Max 3 CSV Datasets</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> 20 AI Queries / month</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> Basic Recharts Dashboards</li>
              <li className="flex gap-2.5 items-center text-zinc-600"><Lock size={14} /> Headless Developer API Keys</li>
            </ul>
            <Link 
              href="/signup"
              className="w-full text-center border border-zinc-800 hover:bg-zinc-900 text-white font-bold py-3.5 rounded-xl text-sm transition"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col p-8 rounded-3xl border-2 border-indigo-600 bg-zinc-950/80 relative shadow-2xl shadow-indigo-600/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-xs font-bold text-white uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-lg font-bold text-indigo-400 mb-2">Professional</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">$49</span>
              <span className="text-sm text-zinc-500">/ month</span>
            </div>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Empower your product and analyst teams to manage datasets with no size restrictions.
            </p>
            <ul className="space-y-4 mb-10 flex-1 text-sm text-zinc-300">
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> Max 15 CSV Datasets</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> 150 AI Queries / month</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> Advanced Gradient Custom Charts</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> 5 Active Developer API Keys</li>
            </ul>
            <Link 
              href="/signup"
              className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col p-8 rounded-3xl border border-zinc-900 bg-zinc-950/20 relative">
            <h3 className="text-lg font-bold text-zinc-400 mb-2">Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">$299</span>
              <span className="text-sm text-zinc-500">/ month</span>
            </div>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Designed for high-scale organizations needing advanced compliance, custom models, and support.
            </p>
            <ul className="space-y-4 mb-10 flex-1 text-sm text-zinc-300">
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> Unlimited Datasets</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> 1000 AI Queries / month</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> Dedicated Model Pipeline</li>
              <li className="flex gap-2.5 items-center"><Check size={16} className="text-emerald-500" /> Unlimited Developer API Keys</li>
            </ul>
            <Link 
              href="/signup"
              className="w-full text-center border border-zinc-800 hover:bg-zinc-900 text-white font-bold py-3.5 rounded-xl text-sm transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span className="font-bold text-zinc-400">InsightFlow</span>
            <span className="text-xs text-zinc-600">© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
