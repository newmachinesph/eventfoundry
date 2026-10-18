"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Building2, Users, Package,
  ChevronLeft, ChevronRight,
  Briefcase, Heart, Cake, PartyPopper, Mic, Sparkles,
  Utensils, Leaf, Wind, Waves, Home,
  Camera, Video, ChefHat, Music, Flower2, Aperture,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const sourcingTypes = [
  { id: "venue",   label: "Venue Only",          desc: "Find the perfect space for your event",                    icon: Building2, iconBg: "bg-blue-50",   iconColor: "text-blue-500" },
  { id: "vendors", label: "Vendors Only",         desc: "Source photographers, caterers, entertainment & more",    icon: Users,     iconBg: "bg-purple-50", iconColor: "text-purple-500" },
  { id: "package", label: "Full Event Package",   desc: "Venue + vendors — we'll handle the whole thing",          icon: Package,   iconBg: "bg-amber-50",  iconColor: "text-[var(--coral-500)]" },
];

const eventTypeOptions = [
  { id: "corporate", label: "Corporate Event",   icon: Briefcase },
  { id: "wedding",   label: "Wedding",            icon: Heart },
  { id: "birthday",  label: "Birthday",           icon: Cake },
  { id: "social",    label: "Social Gathering",   icon: PartyPopper },
  { id: "conference",label: "Conference",         icon: Mic },
  { id: "other",     label: "Other",              icon: Sparkles },
];

const venueTypeOptions = [
  { id: "hotel-ballroom", label: "Hotel Ballroom",       icon: Building2 },
  { id: "restaurant",     label: "Restaurant",           icon: Utensils },
  { id: "garden",         label: "Garden / Outdoor",     icon: Leaf },
  { id: "rooftop",        label: "Rooftop",              icon: Wind },
  { id: "waterfront",     label: "Waterfront",           icon: Waves },
  { id: "villa",          label: "Villa / Private Estate", icon: Home },
];

const locationOptions = [
  "CBD / Marina Bay",
  "Orchard / River Valley",
  "Sentosa",
  "North (Woodlands / Yishun)",
  "East (Changi / Tampines)",
  "West (Jurong / Clementi)",
  "Central (Bishan / Toa Payoh)",
  "Flexible / No Preference",
];

const amenityOptions = [
  "Swimming Pool",
  "Karaoke / AV Setup",
  "Ample Parking",
  "In-house Catering",
  "Accommodation",
  "Outdoor Space",
  "Stage / Performance Area",
  "Bridal Suite",
];

const venueBudgetOptions = [
  "Under $5,000",
  "$5,000 – $10,000",
  "$10,000 – $20,000",
  "$20,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
];

const vendorCategoryOptions = [
  { id: "photographer",  label: "Photographer",    icon: Camera },
  { id: "videographer",  label: "Videographer",    icon: Video },
  { id: "catering",      label: "Catering",        icon: ChefHat },
  { id: "live-music",    label: "Live Music / DJ", icon: Music },
  { id: "florist",       label: "Florist / Décor", icon: Flower2 },
  { id: "photobooth",    label: "Photobooth",      icon: Aperture },
];

const perVendorBudgetOptions = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
];

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface FormState {
  sourcingType: string;
  eventType: string;
  guestCount: string;
  eventDate: string;
  venueTypes: string[];
  preferredLocations: string[];
  amenities: string[];
  venueBudget: string;
  vendorCategories: string[];
  perVendorBudget: string;
}

const initialForm: FormState = {
  sourcingType: "",
  eventType: "",
  guestCount: "",
  eventDate: "",
  venueTypes: [],
  preferredLocations: [],
  amenities: [],
  venueBudget: "",
  vendorCategories: [],
  perVendorBudget: "",
};

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

/* ─── Derived step logic ─────────────────────────────────────────────────── */

type Screen = "sourcing" | "details" | "venue" | "vendors";

function getScreen(step: number, sourcingType: string): Screen {
  if (step === 1) return "sourcing";
  if (step === 2) return "details";
  if (step === 3 && sourcingType === "vendors") return "vendors";
  if (step === 3) return "venue";
  return "vendors"; // step 4 → only reached when sourcingType === "package"
}

function getStepLabel(step: number, sourcingType: string): string {
  if (step === 1) return "Sourcing Type";
  if (step === 2) return "Event Details";
  if (step === 3 && sourcingType === "vendors") return "Vendor Preferences";
  if (step === 3) return "Venue Preferences";
  return "Vendor Preferences";
}

/* ─── Shared style helpers ───────────────────────────────────────────────── */

const CHIP =
  "px-3.5 py-2 rounded-full text-sm font-medium border transition-all";
const chipActive = "border-[var(--coral-500)] bg-[var(--coral-500)]/10 text-[var(--coral-500)]";
const chipIdle   = "border-gray-200 text-[#4A5568] hover:border-[var(--coral-500)] hover:text-[var(--coral-500)]";

const TILE =
  "flex flex-col items-center gap-2 py-4 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center";
const tileActive = "border-[var(--coral-500)] bg-[var(--coral-500)]/10 text-[var(--coral-500)]";
const tileIdle   = "border-gray-200 bg-[#fafafa] text-[#4A5568] hover:border-[var(--coral-500)] hover:text-[var(--coral-500)]";

const BUDGET_TILE =
  "py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all text-center";

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function SourcePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = form.sourcingType === "package" ? 4 : 3;
  const progress    = (step / totalSteps) * 100;
  const screen      = getScreen(step, form.sourcingType);
  const stepLabel   = getStepLabel(step, form.sourcingType);
  const isLastStep  = step === totalSteps;

  const canContinue: boolean = (() => {
    if (screen === "sourcing") return !!form.sourcingType;
    if (screen === "details")  return !!form.eventType && !!form.guestCount.trim();
    if (screen === "venue")    return !!form.venueBudget;
    if (screen === "vendors")  return form.vendorCategories.length > 0 && !!form.perVendorBudget;
    return false;
  })();

  const handleContinue = async () => {
    if (!isLastStep) { setStep((s) => s + 1); return; }

    const payload: Record<string, unknown> = {
      sourcing_type: form.sourcingType,
      event: {
        type:        form.eventType,
        guest_count: form.guestCount,
        date:        form.eventDate || null,
      },
    };

    if (form.sourcingType === "venue" || form.sourcingType === "package") {
      payload.venue_preferences = {
        types:     form.venueTypes,
        locations: form.preferredLocations,
        amenities: form.amenities,
        budget:    form.venueBudget,
      };
    }

    if (form.sourcingType === "vendors" || form.sourcingType === "package") {
      payload.vendor_preferences = {
        categories:        form.vendorCategories,
        per_vendor_budget: form.perVendorBudget,
      };
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      sessionStorage.setItem("matchResults", JSON.stringify(data));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirectTo=/recommendation");
      } else {
        router.push("/recommendation");
      }
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F4EE]">

      {/* ── Full-screen loader overlay ── */}
      {loading && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(249,244,238,0.97) 0%, rgba(255,107,53,0.08) 100%)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Animated ring */}
          <div className="relative mb-8">
            <div
              className="w-24 h-24 rounded-full border-4 border-[var(--coral-500)]/20"
              style={{ animation: "spin 2s linear infinite" }}
            />
            <div
              className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-[var(--coral-500)]"
              style={{ animation: "spin 1.2s linear infinite" }}
            />
            {/* Sparkle icon in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ fontSize: 32, animation: "pulse 1.5s ease-in-out infinite" }}>✨</span>
            </div>
          </div>

          <h2
            className="text-2xl font-extrabold text-[var(--near-black)] mb-2 text-center"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Finding your perfect matches
          </h2>
          <p
            className="text-[#4A5568] text-sm mb-6 text-center max-w-xs"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            We&apos;re scanning venues and vendors that fit your event criteria…
          </p>

          {/* Animated dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[var(--coral-500)]"
                style={{
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <style>{`
            @keyframes spin   { to { transform: rotate(360deg); } }
            @keyframes pulse  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }
            @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          `}</style>
        </div>
      )}
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-[var(--near-black)]/8 p-8 md:p-10">

            {/* ── Progress bar ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-medium text-[#4A5568] uppercase tracking-widest"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Step {step} of {totalSteps}
                </span>
                <span
                  className="text-xs text-[var(--coral-500)] font-semibold"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {stepLabel}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--coral-500)] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* ── Step 1: Sourcing type ── */}
            {screen === "sourcing" && (
              <>
                <h2
                  className="text-2xl md:text-3xl font-extrabold text-[var(--near-black)] mb-2"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  What are you looking for?
                </h2>
                <p
                  className="text-[#4A5568] text-sm mb-8"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Choose one to get started — we&apos;ll guide you from there.
                </p>
                <div className="space-y-3">
                  {sourcingTypes.map(({ id, label, desc, icon: Icon, iconBg, iconColor }) => (
                    <button
                      key={id}
                      onClick={() => setForm({ ...form, sourcingType: id })}
                      className={`wizard-option w-full text-left flex items-center gap-4${form.sourcingType === id ? " selected" : ""}`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={22} className={iconColor} />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--near-black)] text-base" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                          {label}
                        </p>
                        <p className="text-[#4A5568] text-sm mt-0.5" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                          {desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 2: Event details ── */}
            {screen === "details" && (
              <>
                <h2
                  className="text-2xl md:text-3xl font-extrabold text-[var(--near-black)] mb-2"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Tell us about your event.
                </h2>
                <p
                  className="text-[#4A5568] text-sm mb-8"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  So we can find the best match for you.
                </p>

                <div className="space-y-7">
                  {/* Event type */}
                  <div>
                    <p className="forge-section-label mb-3">What kind of event?</p>
                    <div className="grid grid-cols-3 gap-3">
                      {eventTypeOptions.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setForm({ ...form, eventType: id })}
                          className={`${TILE} ${form.eventType === id ? tileActive : tileIdle}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          <Icon size={22} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest count */}
                  <div>
                    <p className="forge-section-label mb-3">How many guests are you hosting?</p>
                    <div className="relative">
                      <Users
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 150"
                        value={form.guestCount}
                        onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm text-[var(--near-black)] placeholder-gray-400 focus:outline-none focus:border-[var(--coral-500)] focus:ring-2 focus:ring-[var(--coral-500)]/20 transition-all"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Event date */}
                  <div>
                    <p className="forge-section-label mb-3">
                      Event date{" "}
                      <span className="normal-case font-normal text-gray-400">(optional)</span>
                    </p>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-[var(--near-black)] focus:outline-none focus:border-[var(--coral-500)] focus:ring-2 focus:ring-[var(--coral-500)]/20 transition-all"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3 (venue / package): Venue preferences ── */}
            {screen === "venue" && (
              <>
                <h2
                  className="text-2xl md:text-3xl font-extrabold text-[var(--near-black)] mb-2"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  What kind of venue?
                </h2>
                <p
                  className="text-[#4A5568] text-sm mb-8"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Select all that apply — we&apos;ll find options that match.
                </p>

                <div className="space-y-7">
                  {/* Venue type */}
                  <div>
                    <p className="forge-section-label mb-3">Venue Type</p>
                    <div className="grid grid-cols-3 gap-3">
                      {venueTypeOptions.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setForm({ ...form, venueTypes: toggle(form.venueTypes, id) })}
                          className={`${TILE} ${form.venueTypes.includes(id) ? tileActive : tileIdle}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          <Icon size={22} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred locations */}
                  <div>
                    <p className="forge-section-label mb-3 flex items-center gap-1">
                      <MapPin size={12} /> Preferred Locations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {locationOptions.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setForm({ ...form, preferredLocations: toggle(form.preferredLocations, loc) })}
                          className={`${CHIP} ${form.preferredLocations.includes(loc) ? chipActive : chipIdle}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <p className="forge-section-label mb-3">
                      Must-Have Amenities{" "}
                      <span className="normal-case font-normal text-gray-400">(optional)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {amenityOptions.map((a) => (
                        <button
                          key={a}
                          onClick={() => setForm({ ...form, amenities: toggle(form.amenities, a) })}
                          className={`${CHIP} ${form.amenities.includes(a) ? chipActive : chipIdle}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Venue budget */}
                  <div>
                    <p className="forge-section-label mb-3">$ Venue Budget</p>
                    <div className="grid grid-cols-3 gap-2">
                      {venueBudgetOptions.map((b) => (
                        <button
                          key={b}
                          onClick={() => setForm({ ...form, venueBudget: b })}
                          className={`${BUDGET_TILE} ${form.venueBudget === b ? tileActive : tileIdle}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3 (vendors) / Step 4 (package): Vendor preferences ── */}
            {screen === "vendors" && (
              <>
                <h2
                  className="text-2xl md:text-3xl font-extrabold text-[var(--near-black)] mb-2"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Now, let&apos;s talk vendors.
                </h2>
                <p
                  className="text-[#4A5568] text-sm mb-8"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {form.sourcingType === "package"
                    ? "Which vendor categories do you need for your full event package?"
                    : "Which vendor categories are you looking for?"}
                </p>

                <div className="space-y-7">
                  {/* Vendor categories */}
                  <div>
                    <p className="forge-section-label mb-3">Vendor Categories</p>
                    <div className="grid grid-cols-3 gap-3">
                      {vendorCategoryOptions.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setForm({ ...form, vendorCategories: toggle(form.vendorCategories, id) })}
                          className={`${TILE} ${form.vendorCategories.includes(id) ? tileActive : tileIdle}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          <Icon size={22} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Per-vendor budget */}
                  <div>
                    <p className="forge-section-label mb-3">$ Per-Vendor Budget</p>
                    <div className="grid grid-cols-3 gap-2">
                      {perVendorBudgetOptions.map((b) => (
                        <button
                          key={b}
                          onClick={() => setForm({ ...form, perVendorBudget: b })}
                          className={`${BUDGET_TILE} ${form.perVendorBudget === b ? tileActive : tileIdle}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Navigation ── */}
            <div className="flex flex-col gap-4 mt-10 pt-6 border-t border-gray-100">
              {/* Inline error */}
              {error && (
                <div
                  className="w-full text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={loading}
                  className={`flex items-center gap-2 text-[#4A5568] hover:text-[var(--near-black)] text-sm font-medium transition-colors ${
                    step === 1 ? "invisible" : ""
                  } disabled:opacity-40`}
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  <ChevronLeft size={18} /> Back
                </button>

                <button
                  onClick={handleContinue}
                  disabled={!canContinue || loading}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    canContinue && !loading
                      ? "forge-btn-primary text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {isLastStep ? (
                    <>Find My Matches <ChevronRight size={16} /></>
                  ) : (
                    <>Continue <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          <p
            className="text-center text-[#4A5568] text-xs mt-6"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            No commitment required. Our team reviews every match before sending your quote.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
