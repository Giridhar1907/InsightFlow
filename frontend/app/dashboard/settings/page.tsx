"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Lock, 
  Loader2, 
  Sparkles, 
  User,
  Shield,
  Sliders
} from "lucide-react";
import { useDashboard } from "../layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SettingsPage() {
  const { session, refreshSession } = useDashboard();
  
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAPIKeys = async () => {
    if (!session || session.plan_tier === "free") return;
    
    setKeysLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${API_URL}/billing/api-keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiKeys(response.data.api_keys || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch API keys");
    } finally {
      setKeysLoading(false);
    }
  };

  useEffect(() => {
    fetchAPIKeys();
  }, [session]);

  const handleGenerateKey = async () => {
    setError("");
    setSuccess("");
    setGenerating(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`${API_URL}/billing/api-keys/generate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === "success") {
        setSuccess("New API key generated successfully!");
        await fetchAPIKeys();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to generate API Key");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Headless analytics calls using it will fail.")) return;

    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API_URL}/billing/api-keys/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("API Key revoked successfully.");
      await fetchAPIKeys();
    } catch (err) {
      console.error(err);
      setError("Failed to revoke API key");
    }
  };

  const handleCopy = (id: string, keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Profile and general config card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-[32px] border border-zinc-900 bg-zinc-950/40">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User size={18} className="text-indigo-400" />
            Profile Configuration
          </h3>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Primary Email</label>
                <input 
                  type="email" 
                  disabled
                  value={session?.email || ""}
                  className="w-full h-11 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-4 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={session?.email.split("@")[0].toUpperCase()}
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-white px-4 text-xs font-semibold"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button className="h-11 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition cursor-pointer">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Security Summary card */}
        <div className="p-8 rounded-[32px] border border-zinc-900 bg-zinc-950/40">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Shield size={18} className="text-violet-400" />
            Security & Plan
          </h3>
          <ul className="space-y-4 text-xs font-semibold text-zinc-400">
            <li className="flex justify-between py-2 border-b border-zinc-900/60">
              <span>Account Status</span>
              <span className="text-emerald-500">Verified Active</span>
            </li>
            <li className="flex justify-between py-2 border-b border-zinc-900/60">
              <span>Plan Tier</span>
              <span className="text-white uppercase">{session?.plan_tier}</span>
            </li>
            <li className="flex justify-between py-2">
              <span>Encryption</span>
              <span className="text-white">AES-256 Enabled</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Developer API Keys card */}
      <div className="p-8 rounded-[32px] border border-zinc-900 bg-zinc-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Key size={18} className="text-pink-400" />
              Developer API Access
            </h3>
            <p className="text-zinc-500 text-xs">Generate HEADLESS secret keys to integrate custom dashboard pipelines.</p>
          </div>

          {session?.plan_tier !== "free" && (
            <button 
              onClick={handleGenerateKey}
              disabled={generating}
              className="h-11 bg-white text-black hover:bg-zinc-200 disabled:opacity-40 font-bold px-5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {generating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Generate Key
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Free Plan Lockout banner */}
        {session?.plan_tier === "free" ? (
          <div className="p-8 rounded-2xl border border-indigo-950/40 bg-indigo-950/10 text-center flex flex-col items-center">
            <Lock className="text-indigo-400 mb-4" size={28} />
            <h4 className="text-sm font-bold text-white mb-2">Developer Access Locked</h4>
            <p className="text-xs text-zinc-500 max-w-sm mb-4 leading-normal">
              API keys are a SaaS premium feature. Upgrade to the **Professional** plan to unlock headless queries and access data via curl.
            </p>
            <Link 
              href="/dashboard/billing"
              className="flex items-center gap-1.5 bg-indigo-650 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition cursor-pointer"
            >
              <Sparkles size={12} />
              Upgrade Workspace
            </Link>
          </div>
        ) : keysLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="text-indigo-500 animate-spin" size={24} />
            <span className="text-xs text-zinc-500 mt-2 uppercase tracking-wider font-bold">Retrieving tokens...</span>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-zinc-900 rounded-2xl text-center text-zinc-600">
            <Key size={30} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-xs font-semibold text-zinc-400">No active keys generated</p>
            <p className="text-[10px] text-zinc-650 mt-1">Click the button above to generate a new live access token</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest font-bold">
                  <th className="pb-4 pr-4">Token Name</th>
                  <th className="pb-4 px-4">Secret Key Value</th>
                  <th className="pb-4 px-4">Created Date</th>
                  <th className="pb-4 pl-4 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => {
                  const isCopied = copiedKeyId === key.id;
                  return (
                    <tr key={key.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/5 transition">
                      <td className="py-4 pr-4 font-bold text-white">Production Secret Key</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <code className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300">
                            {key.key_value.slice(0, 12)}••••••••••••••••••••
                          </code>
                          <button 
                            onClick={() => handleCopy(key.id, key.key_value)}
                            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center border border-zinc-800 transition cursor-pointer"
                          >
                            {isCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-400 font-semibold">{key.created_at.split("T")[0]}</td>
                      <td className="py-4 pl-4 text-right">
                        <button 
                          onClick={() => handleRevokeKey(key.id)}
                          className="w-7 h-7 rounded-lg bg-zinc-900/40 hover:bg-red-950/25 border border-zinc-900 hover:border-red-900/30 text-zinc-655 hover:text-red-400 flex items-center justify-center transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
