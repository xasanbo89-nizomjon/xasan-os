"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/firebase/client";
import {
  syncFirebaseUserAction,
  loginArchitectDemoAction,
} from "@/server/actions/auth";
import {
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Zap,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithGoogle();
      if (!res.success || !res.user) {
        throw new Error(res.error || "Google authentication failed");
      }

      const syncRes = await syncFirebaseUserAction(res.user);
      if (!syncRes.success) {
        throw new Error(syncRes.error || "Failed to establish database session");
      }

      router.push(returnUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email.trim() || !password) {
        throw new Error("Please enter both email and password");
      }

      let res;
      if (mode === "signin") {
        res = await signInWithEmail(email, password);
      } else {
        res = await signUpWithEmail(email, password, displayName);
      }

      if (!res.success || !res.user) {
        throw new Error(res.error || "Authentication failed");
      }

      const syncRes = await syncFirebaseUserAction(res.user);
      if (!syncRes.success) {
        throw new Error(syncRes.error || "Failed to establish database session");
      }

      router.push(returnUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginArchitectDemoAction();
      if (!res.success) throw new Error(res.error || "Demo login failed");
      router.push(returnUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Demo login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D0B] text-[#F3F7F4] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-[#25352C] shadow-2xl relative z-10 emerald-glow">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] text-[#080D0B] font-black text-2xl mb-3 shadow-lg shadow-[#10B981]/25">
            X
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F7F4]">
            XASAN OS ULTIMATE
          </h1>
          <p className="text-xs text-[#98A69D] mt-1">
            Phase 2: Authentication & Sovereign Access Gate
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Switcher */}
        <div className="flex p-1 bg-[#101915] rounded-xl border border-[#25352C] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow"
                : "text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow"
                : "text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#F3F7F4] flex items-center justify-center gap-3 transition-all hover:bg-[#142019] active:scale-[0.98] disabled:opacity-50 cursor-pointer mb-4"
        >
          {/* Google Icon SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.7 0 3 .6 3.9 1.5l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#25352C]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#98A69D]">
            or with email
          </span>
          <div className="flex-1 h-px bg-[#25352C]" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-medium text-[#98A69D] mb-1">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Xasan Mukhammadiev"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#101915] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] placeholder-[#98A69D]/50 focus:outline-none focus:border-[#10B981] transition-colors"
                />
                <User className="w-4 h-4 text-[#98A69D] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-[#98A69D] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="xasan@os.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#101915] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] placeholder-[#98A69D]/50 focus:outline-none focus:border-[#10B981] transition-colors"
              />
              <Mail className="w-4 h-4 text-[#98A69D] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#98A69D] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[#101915] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] placeholder-[#98A69D]/50 focus:outline-none focus:border-[#10B981] transition-colors"
              />
              <KeyRound className="w-4 h-4 text-[#98A69D] absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#98A69D] hover:text-[#F3F7F4] absolute right-3 top-2.5"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#10B981] text-[#080D0B] font-bold text-xs hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/25 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === "signin" ? (
              <>
                <span>Sign In to System</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Architect Account</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Architect Access */}
        <div className="mt-5 pt-4 border-t border-[#25352C]">
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl bg-[#142019] border border-[#10B981]/30 hover:border-[#10B981] text-[11px] font-semibold text-[#10B981] flex items-center justify-center gap-2 transition-all hover:bg-[#10B981]/10 active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Architect Demo Access (One-Click)</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center">
          <span className="text-[10px] text-[#98A69D] flex items-center justify-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            PostgreSQL User Isolation • Prisma ORM Protected
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080D0B] flex items-center justify-center text-xs text-[#98A69D]">
          Loading Secure Access Gate...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
