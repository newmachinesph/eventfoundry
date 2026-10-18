"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirectTo") || "/";
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <h1
              className="text-4xl font-extrabold text-[var(--near-black)] mb-3"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Welcome Back
            </h1>
            <p
              className="text-[var(--warm-500)] text-base"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Sign in to continue sourcing your perfect event
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              {error}
            </div>
          )}

          <form className="space-y-4 mb-8" onSubmit={handleSubmit}>

            <div>
              <label
                className="block text-sm font-semibold text-[var(--near-black)] mb-2"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--warm-400)] pointer-events-none"
                />
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[var(--warm-200)] text-[var(--near-black)] placeholder-[var(--warm-400)] text-sm focus:outline-none focus:border-[var(--coral-500)] focus:ring-2 focus:ring-[var(--coral-500)]/20 transition-all"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-sm font-semibold text-[var(--near-black)]"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-[var(--coral-500)] hover:text-[var(--warm-500)] font-semibold transition-colors"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--warm-400)] pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-[var(--warm-200)] text-[var(--near-black)] placeholder-[var(--warm-400)] text-sm focus:outline-none focus:border-[var(--coral-500)] focus:ring-2 focus:ring-[var(--coral-500)]/20 transition-all"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--warm-400)] hover:text-[var(--near-black)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl forge-btn-primary text-white font-semibold text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p
            className="text-center text-[var(--warm-500)] text-sm"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Don&apos;t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const urlParams = new URLSearchParams(window.location.search);
                const redirectTo = urlParams.get("redirectTo");
                router.push(redirectTo ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : "/signup");
              }}
              className="text-[var(--coral-500)] hover:opacity-80 font-semibold transition-opacity"
            >
              Sign up here
            </a>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
