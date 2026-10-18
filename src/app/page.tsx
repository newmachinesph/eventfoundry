import Link from "next/link";
import Footer from "@/components/Footer";
import {
  Sparkles,
  CircleCheckBig,
  Clock,
  Users,
  TrendingUp,
  Star,
  CircleAlert,
  ChartColumn,
  Zap,
  Brain,
  Shield,
  Building2,
  Camera,
  Music,
  ChefHat,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import TestimonialCarousel from "@/components/TestimonialCarousel";

const stats = [
  { Icon: Clock, value: "60s", label: "Average match time" },
  { Icon: Users, value: "200+", label: "Curated partners" },
  { Icon: TrendingUp, value: "5000+", label: "Events sourced" },
  { Icon: Star, value: "98%", label: "Client satisfaction" },
];

const beforeItems = [
  { Icon: Clock, text: "3–7 days to source options" },
  { Icon: Users, text: "Multiple vendor contacts required" },
  { Icon: CircleAlert, text: "Inconsistent, opaque pricing" },
  { Icon: ChartColumn, text: "Uncertain quality standards" },
];

const afterItems = [
  { Icon: Zap, text: "~60-second smart matching" },
  { Icon: Brain, text: "AI-assisted recommendations" },
  { Icon: Shield, text: "Curated by experienced organisers" },
  { Icon: CircleCheckBig, text: "One ecosystem, zero fragmentation" },
];

const steps = [
  {
    num: "01",
    Icon: Brain,
    title: "Tell Us What You Need",
    desc: "Answer a few guided questions about your event — type, size, location, and budget. Our consultant-style flow starts easy and builds naturally.",
  },
  {
    num: "02",
    Icon: Sparkles,
    title: "AI Matches You Instantly",
    desc: "Our engine scans our curated database and surfaces the best-fit venues and vendors — structured, comparable, and transparent.",
  },
  {
    num: "03",
    Icon: CircleCheckBig,
    title: "Select Your Favourites",
    desc: "Browse, compare, and shortlist your preferred options. Accept or reject with a single click. Request more if needed.",
  },
  {
    num: "04",
    Icon: Users,
    title: "Get Your Quote & Consult",
    desc: "We compile a detailed quote and connect you with our sales team to validate your event and give you the confidence to book.",
  },
];

const categories = [
  { href: "/brands", Icon: Building2, label: "Venues", count: "50+ partners" },
  { href: "/photography", Icon: Camera, label: "Photographers", count: "30+ partners" },
  { href: "/entertainment", Icon: Music, label: "Entertainment", count: "25+ partners" },
  { href: "/catering", Icon: ChefHat, label: "Catering", count: "20+ partners" },
];

const consultantFeatures = [
  "Objective-driven questions, not open-ended forms",
  "Multiple-choice options to keep you in control",
  "AI narrows the field; you make the final call",
  "Human sales consultant validates your final selection",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F4EE]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            alt="Grand ballroom event space"
            className="w-full h-full object-cover"
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429518879/UtuzPw49jVfKAouNtyxyq8/hero-warm-ballroom-NNsRoyTKX4Ksbep4bSknCm.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--near-black)]/90 via-[var(--near-black)]/70 to-[var(--near-black)]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--near-black)]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-24 pb-20">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in-up"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              <Sparkles size={14} className="text-[var(--coral-500)]" />
              <span className="text-white/90 text-sm font-medium">
                AI-Powered Event Sourcing
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in-up animate-delay-100"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Find your perfect{" "}
              <span className="text-[var(--coral-500)]">venue &amp; vendors</span>{" "}
              in 60 seconds.
            </h1>

            <p
              className="text-white text-lg md:text-xl leading-relaxed mb-10 max-w-xl animate-fade-in-up animate-delay-200"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Stop spending days sourcing. Event Foundry uses AI to match you with curated
              venues and vendors — instantly, transparently, and beautifully.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <Link href="/source">
                <button className="forge-btn-primary px-8 py-4 text-base font-semibold rounded-xl flex items-center gap-2">
                  Start Sourcing <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/brands">
                <button className="forge-btn-ghost px-8 py-4 text-base font-semibold rounded-xl">
                  View Our Partners
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 animate-fade-in-up animate-delay-400">
              {["200+ curated partners", "5,000+ events sourced", "98% client satisfaction"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CircleCheckBig size={14} className="text-[var(--coral-500)]" />
                    <span
                      className="text-white text-sm"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2" style={{ transform: "translateX(-50%)" }}>
          <div className="animate-float flex flex-col items-center gap-2">
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
            <span
              className="text-white text-xs uppercase tracking-widest"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-gradient-to-r from-[var(--coral-500)] to-[var(--coral-500)]/90 py-8 border-b border-[var(--coral-500)]/30">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {[
              { title: "No Fees", desc: "Zero hidden charges, ever" },
              { title: "Human Experts", desc: "Not robots. Real consultants." },
              { title: "Full-Service", desc: "Coordination included, no extras" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <CircleCheckBig size={24} className="text-white flex-shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-wide">
                    {item.title}
                  </p>
                  <p className="text-white/90 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[var(--near-black)] py-12 border-y border-white/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ Icon, value, label }, i) => (
              <div
                key={label}
                className="text-center"
                style={{ opacity: 1, transform: "translateY(0px)", transition: `0.6s ${i * 100}ms` }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon size={18} className="text-[var(--coral-500)]" />
                  <span
                    className="text-3xl md:text-4xl font-extrabold text-white"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {value}
                  </span>
                </div>
                <p className="text-white text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-24 bg-[#F9F4EE]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="forge-section-label mb-3">The Problem We Solve</p>
            <h2
              className="text-4xl md:text-5xl text-[var(--near-black)] max-w-2xl mx-auto"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Event sourcing is{" "}
              <span className="relative">
                broken
                <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-[var(--coral-500)]" />
              </span>
              . We fixed it.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <div className="bg-white rounded-2xl p-8 border border-red-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <CircleAlert size={18} className="text-red-400" />
                </div>
                <div>
                  <p className="forge-section-label" style={{ color: "#f87171" }}>
                    Before Event Foundry
                  </p>
                  <h3
                    className="text-lg font-bold text-[var(--near-black)]"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    The Traditional Way
                  </h3>
                </div>
              </div>
              <ul className="space-y-4">
                {beforeItems.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span
                      className="text-[#4A5568] text-sm leading-relaxed"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-red-50">
                <p
                  className="text-2xl font-extrabold text-red-400"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  3–7 days
                </p>
                <p className="text-xs text-[#4A5568]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  to source options for a single event
                </p>
              </div>
            </div>

            {/* After */}
            <div className="bg-[var(--near-black)] rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--coral-500)]/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-[var(--coral-500)]" />
                </div>
                <div>
                  <p className="forge-section-label mb-0">After Event Foundry</p>
                  <h3
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    The Smart Way
                  </h3>
                </div>
              </div>
              <ul className="space-y-4">
                {afterItems.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span
                      className="text-white text-sm leading-relaxed"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p
                  className="text-2xl font-extrabold text-[var(--coral-500)]"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  ~60 seconds
                </p>
                <p className="text-xs text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  from brief to matched recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="forge-section-label mb-3">How It Works</p>
            <h2
              className="text-4xl md:text-5xl text-[var(--near-black)]"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              From brief to booked
              <br />
              in four steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(({ num, Icon, title, desc }, i) => (
              <div key={num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-[120px] left-[calc(50%+2rem)] right-[-50%] h-px bg-[var(--coral-500)]/20 z-0" />
                )}
                <div className="relative z-10 text-center p-6">
                  <div className="inline-flex flex-col items-center mb-4">
                    <span
                      className="text-6xl font-extrabold leading-none mb-2"
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        color: "rgba(255, 107, 53, 0.15)",
                      }}
                    >
                      {num}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-[var(--near-black)] flex items-center justify-center shadow-lg">
                      <Icon size={22} className="text-[var(--coral-500)]" />
                    </div>
                  </div>
                  <h3
                    className="text-lg font-bold text-[var(--near-black)] mb-2"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-[#4A5568] text-sm leading-relaxed"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Source */}
      <section className="py-16 bg-[#F9F4EE]">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="forge-section-label text-center mb-10">What We Source</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ href, Icon, label, count }) => (
              <Link key={href} href={href}>
                <div className="forge-card p-6 text-center group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-[var(--coral-500)]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--coral-500)]/20 transition-colors">
                    <Icon size={22} className="text-[var(--coral-500)]" />
                  </div>
                  <p
                    className="font-bold text-[var(--near-black)] text-base"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[#4A5568] text-sm mt-0.5"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {count}
                  </p>
                </div>
              </Link>
            ))}
            <div className="forge-card p-6 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-[#E8E8E8] flex items-center justify-center mx-auto mb-3">
                <span
                  className="text-2xl font-bold text-[#999]"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  +
                </span>
              </div>
              <p
                className="font-bold text-[var(--near-black)] text-base"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                And Many More
              </p>
              <p
                className="text-[#4A5568] text-sm mt-0.5"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                Florists, planners, more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Consultant */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="forge-section-label mb-4">Your AI Consultant</p>
              <h2
                className="text-4xl md:text-5xl text-[var(--near-black)] mb-6"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                We work like a consultant,
                <br />
                not a search engine.
              </h2>
              <p
                className="text-[#4A5568] text-lg leading-relaxed mb-8"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                Most clients don&apos;t know exactly what they want — and that&apos;s okay. Our
                guided flow starts with easy questions and builds naturally toward the critical
                decisions, just like a skilled event planner would.
              </p>
              <ul className="space-y-4 mb-8">
                {consultantFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <CircleCheckBig
                      size={18}
                      className="text-[var(--coral-500)] mt-0.5 flex-shrink-0"
                    />
                    <span
                      className="text-[#4A5568] text-sm"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/source">
                <button className="forge-btn-primary px-8 py-4 text-base font-semibold rounded-xl flex items-center gap-2">
                  Try It Now <ArrowRight size={18} />
                </button>
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  alt="Rooftop event venue with Singapore skyline"
                  className="w-full h-80 md:h-[480px] object-cover"
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429518879/UtuzPw49jVfKAouNtyxyq8/venue-rooftop-modern-kTfzbD8UwkvR4Qt6tcq7gG.webp"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[var(--near-black)] text-white rounded-2xl p-5 shadow-xl">
                <p
                  className="text-3xl font-extrabold text-[var(--coral-500)]"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  60s
                </p>
                <p className="text-xs text-white mt-1" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  Average match time
                </p>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-[var(--coral-500)]/20">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--coral-500)]" />
                  <span
                    className="text-sm font-semibold text-[var(--near-black)]"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    AI-Powered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      {/* CTA */}
      <section className="relative py-28 bg-[var(--near-black)] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--coral-500)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center">
          <p className="forge-section-label mb-4">Get Started Today</p>
          <h2
            className="text-4xl md:text-6xl text-white mb-6 max-w-3xl mx-auto"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Ready to source your{" "}
            <span className="text-[var(--coral-500)]">next event?</span>
          </h2>
          <p
            className="text-white text-lg mb-10 max-w-xl mx-auto"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Join hundreds of event planners who save days every week with Event Foundry.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/source">
              <button className="forge-btn-primary px-10 py-4 text-base font-semibold rounded-xl flex items-center gap-2">
                Start Sourcing Now <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/past-events">
              <button className="forge-btn-ghost px-10 py-4 text-base font-semibold rounded-xl text-white border-2 border-white">
                View Past Events
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
