"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirectTo");
      setTimeout(() => {
        router.push(redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login");
      }, 3000);
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
              Create Account
            </h1>
            <p
              className="text-[var(--warm-500)] text-base"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Start sourcing your perfect event in minutes
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              {error}
            </div>
          )}

          {success ? (
            <div className="px-4 py-6 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm text-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              <p className="font-semibold text-base mb-1">Check your email!</p>
              <p>We sent a confirmation link to <strong>{email}</strong>. Redirecting to login…</p>
            </div>
          ) : (
            <form className="space-y-4 mb-8" onSubmit={handleSubmit}>

              <div>
                <label
                  className="block text-sm font-semibold text-[var(--near-black)] mb-2"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--warm-400)] pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[var(--warm-200)] text-[var(--near-black)] placeholder-[var(--warm-400)] text-sm focus:outline-none focus:border-[var(--coral-500)] focus:ring-2 focus:ring-[var(--coral-500)]/20 transition-all"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  />
                </div>
              </div>

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
                <label
                  className="block text-sm font-semibold text-[var(--near-black)] mb-2"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--warm-400)] pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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

              <div>
                <label
                  className="block text-sm font-semibold text-[var(--near-black)] mb-2"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--warm-400)] pointer-events-none"
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-[var(--warm-200)] text-[var(--near-black)] placeholder-[var(--warm-400)] text-sm focus:outline-none focus:border-[var(--coral-500)] focus:ring-2 focus:ring-[var(--coral-500)]/20 transition-all"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--warm-400)] hover:text-[var(--near-black)] transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[var(--warm-200)] accent-[var(--coral-500)] cursor-pointer flex-shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[var(--warm-500)] cursor-pointer leading-relaxed"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  I agree to the{" "}
                  <Link href="#" className="text-[var(--coral-500)] hover:opacity-80 font-semibold transition-opacity">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[var(--coral-500)] hover:opacity-80 font-semibold transition-opacity">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl forge-btn-primary text-white font-semibold text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          <p
            className="text-center text-[var(--warm-500)] text-sm"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const urlParams = new URLSearchParams(window.location.search);
                const redirectTo = urlParams.get("redirectTo");
                router.push(redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login");
              }}
              className="text-[var(--coral-500)] hover:opacity-80 font-semibold transition-opacity"
            >
              Sign in here
            </a>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
