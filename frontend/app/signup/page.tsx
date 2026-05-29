"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Brain, Sparkles, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", {
        email,
        password
      });

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", response.data.user.email);
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-zinc-200 min-h-screen flex items-center justify-center p-6 relative font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="absolute top-12 left-12">
        <Link href="/" className="flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-zinc-200 transition">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md bg-zinc-950/65 backdrop-blur-xl border border-zinc-900 rounded-[32px] p-10 shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
            <Brain className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-sm text-zinc-500">Analyze your data with advanced AI engines</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="email" 
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 pl-11 pr-4 text-sm text-white placeholder-zinc-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="password" 
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 pl-11 pr-4 text-sm text-white placeholder-zinc-600 transition"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Get Started Free
                <Sparkles size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
