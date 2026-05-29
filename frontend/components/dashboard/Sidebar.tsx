"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  UploadCloud, 
  BarChart3, 
  BrainCircuit, 
  Settings, 
  CreditCard, 
  LogOut, 
  Brain,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useDashboard } from "@/app/dashboard/layout";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useDashboard();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard Hub", href: "/dashboard", icon: LayoutDashboard },
    { name: "Dataset Manager", href: "/dashboard/upload", icon: UploadCloud },
    { name: "Visual Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "AI Insights Panel", href: "/dashboard/ai-insights", icon: BrainCircuit },
    { name: "Developer Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between p-6">
      {/* Top Logo and Header */}
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            InsightFlow
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition duration-150 group cursor-pointer ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isActive ? "text-white" : "text-zinc-500"}`} />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Upsell Card */}
      <div className="space-y-6">
        {session && session.plan_tier === "free" && (
          <Link href="/dashboard/billing" className="block cursor-pointer">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/45 to-violet-950/20 border border-indigo-900/35 relative overflow-hidden group hover:border-indigo-800 transition">
              <div className="absolute -top-1/4 -right-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                <Sparkles size={10} />
                SaaS Upgrade
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Get Professional Plan</h4>
              <p className="text-[10px] text-zinc-500 leading-normal mb-3">Unlock 150 AI queries and Developer API access key.</p>
              <span className="text-[10px] font-semibold text-white group-hover:text-indigo-400 transition flex items-center gap-0.5">
                Upgrade Now &rarr;
              </span>
            </div>
          </Link>
        )}

        {/* Profile Details footer */}
        {session && (
          <div className="flex items-center justify-between border-t border-zinc-900/70 pt-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400 flex-shrink-0">
                {session.email.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {session.email.split("@")[0]}
                </p>
                <p className="text-[10px] text-zinc-500 truncate font-semibold">
                  {session.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/30 text-zinc-500 hover:text-red-400 flex items-center justify-center transition cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}