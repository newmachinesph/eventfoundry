"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/brands", label: "Brands" },
  { href: "/past-events", label: "Past Events" },
  { href: "/#how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    const path = href.split("#")[0] || "/";
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const [path, hash] = href.split("#");
    if (!hash) return;
    const targetPath = path || "/";
    if (pathname === targetPath) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[var(--near-black)] shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-coral-500"
                  : "text-warm-400 hover:text-white"
              }`}
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Log Out
            </button>
          ) : (
            <>
              <Link href="/login">
                <button
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Log In
                </button>
              </Link>
              <Link href="/source">
                <button className="btn-primary px-5 py-2.5 text-sm font-semibold rounded-lg">
                  Start Sourcing →
                </button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[var(--near-black)] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                isActive(link.href) ? "text-coral-500" : "text-white/80 hover:text-white"
              }`}
              style={{ fontFamily: '"DM Sans", sans-serif' }}
              onClick={(e) => { handleNavClick(e, link.href); setMobileOpen(false); }}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="text-sm font-semibold text-white/80 hover:text-white text-left"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Log Out
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <span className="text-sm font-medium text-white/80 hover:text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  Log In
                </span>
              </Link>
              <Link href="/source" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary w-full px-5 py-2.5 text-sm font-semibold rounded-lg mt-2">
                  Start Sourcing →
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
