"use client";

import { Suspense, useState, useMemo, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  TrendingDown,
  Building2,
  Camera,
  UtensilsCrossed,
  Flower2,
  Music,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  LayoutGrid,
  Star,
  MapPin,
  Users,
  X,
  Heart,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import type { MatchedVenue, MatchedVendor } from "@/app/api/match/route";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type CardType = "Venue" | "Vendor";
type SortKey = "match" | "price-asc" | "price-desc" | "rating" | "reviews";
type ViewMode = "grid" | "compare";

interface Recommendation {
  name: string;
  cardType: CardType;
  typeLabel: string;
  match: number;
  featured: boolean;
  rating: number;
  reviews: number;
  location: string;
  capacity: number | null;
  priceRaw: number;        // raw number for sorting
  price: string;
  estTotal: string;
  description: string;
  tags: string[];
  image: string;
}

/* ─── Image pools ────────────────────────────────────────────────────────── */

const VENUE_IMAGES = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80",
  "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=800&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
];

const VENDOR_IMAGES: Record<string, string[]> = {
  Photography: [
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663429518879/UtuzPw49jVfKAouNtyxyq8/vendor-photographer-geiBaHpGRPTqCP9DfXEkic.webp",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
  ],
  Catering: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  ],
  "Decor & Flowers": [
    "https://images.unsplash.com/photo-1490750967868-88df5691cc68?w=800&q=80",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80",
    "https://images.unsplash.com/photo-1464982326199-86f32f81b211?w=800&q=80",
  ],
  Entertainment: [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    "https://images.unsplash.com/photo-1537365587684-f490dff69498?w=800&q=80",
  ],
};

function pickImage(pool: string[], seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
}

/* ─── Data mappers ───────────────────────────────────────────────────────── */

function venueToRec(v: MatchedVenue, idx: number): Recommendation {
  return {
    name: v.name,
    cardType: "Venue",
    typeLabel: "Venue",
    match: v.match_score,
    featured: v.is_featured,
    rating: v.rating,
    reviews: v.review_count,
    location: v.region,
    capacity: v.max_capacity,
    priceRaw: v.est_total_price,
    price: `$${v.min_pax_price.toLocaleString()}/pax`,
    estTotal: `$${v.est_total_price.toLocaleString()}`,
    description: v.description,
    tags: [...(v.venue_type ?? []).slice(0, 2), v.region],
    image: pickImage(VENUE_IMAGES, v.slug ?? String(idx)),
  };
}

function vendorToRec(v: MatchedVendor, idx: number): Recommendation {
  const pool = VENDOR_IMAGES[v.category] ?? VENUE_IMAGES;
  return {
    name: v.name,
    cardType: "Vendor",
    typeLabel: v.category,
    match: v.match_score,
    featured: v.is_featured,
    rating: v.rating,
    reviews: v.review_count,
    location: "Singapore",
    capacity: null,
    priceRaw: v.base_price,
    price: `From $${v.base_price.toLocaleString()}`,
    estTotal: `$${v.base_price.toLocaleString()}`,
    description: v.description,
    tags: [...(v.specialties ?? []).slice(0, 2), v.category],
    image: pickImage(pool, v.slug ?? String(idx)),
  };
}

/* ─── Mock fallback ──────────────────────────────────────────────────────── */

const MOCK: Recommendation[] = [
  {
    name: "The Fullerton Hotel",
    cardType: "Venue",
    typeLabel: "Venue",
    match: 97,
    featured: true,
    rating: 4.8,
    reviews: 312,
    location: "CBD",
    capacity: 500,
    priceRaw: 18000,
    price: "$180/pax",
    estTotal: "$18,000",
    description: "Iconic heritage building offering grand ballrooms and intimate function rooms with stunning Marina Bay views.",
    tags: ["Hotel Ballroom", "Heritage", "CBD"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  },
  {
    name: "Luminary Studios",
    cardType: "Vendor",
    typeLabel: "Photography",
    match: 96,
    featured: true,
    rating: 4.9,
    reviews: 203,
    location: "Singapore",
    capacity: null,
    priceRaw: 2800,
    price: "From $2,800",
    estTotal: "$2,800",
    description: "Award-winning photography and videography studio specialising in weddings and corporate events.",
    tags: ["Photography", "Videography", "Wedding"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663429518879/UtuzPw49jVfKAouNtyxyq8/vendor-photographer-geiBaHpGRPTqCP9DfXEkic.webp",
  },
  {
    name: "Marina Bay Sands",
    cardType: "Venue",
    typeLabel: "Venue",
    match: 92,
    featured: false,
    rating: 4.7,
    reviews: 487,
    location: "Marina Bay",
    capacity: 800,
    priceRaw: 22000,
    price: "$220/pax",
    estTotal: "$22,000",
    description: "Singapore's most iconic venue with sky-high ballrooms and panoramic city views.",
    tags: ["Convention Centre", "Luxury", "Marina Bay"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
];

/* ─── Sort helpers ───────────────────────────────────────────────────────── */

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "match",      label: "Best Match" },
  { key: "price-asc",  label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating",     label: "Highest Rating" },
  { key: "reviews",    label: "Most Reviewed" },
];

function sortRecs(recs: Recommendation[], key: SortKey): Recommendation[] {
  return [...recs].sort((a, b) => {
    switch (key) {
      case "match":      return b.match - a.match;
      case "price-asc":  return a.priceRaw - b.priceRaw;
      case "price-desc": return b.priceRaw - a.priceRaw;
      case "rating":     return b.rating - a.rating;
      case "reviews":    return b.reviews - a.reviews;
      default:           return 0;
    }
  });
}

// June 2026: June 1 = Monday → 1 empty Sunday cell before day 1
const JUNE_OFFSET = 1;
const JUNE_DAYS = 30;
const TODAY = 10;

/* ─── Type icon ──────────────────────────────────────────────────────────── */

function TypeIcon({ typeLabel }: { typeLabel: string }) {
  const props = { size: 11 };
  if (typeLabel === "Photography") return <Camera {...props} />;
  if (typeLabel === "Catering") return <UtensilsCrossed {...props} />;
  if (typeLabel === "Decor & Flowers" || typeLabel === "Decor") return <Flower2 {...props} />;
  if (typeLabel === "Entertainment") return <Music {...props} />;
  return <Building2 {...props} />;
}

/* ─── Recommendation card ────────────────────────────────────────────────── */

function RecommendationCard({
  rec,
  compact = false,
}: {
  rec: Recommendation;
  compact?: boolean;
}) {
  return (
    <div className={`forge-card overflow-hidden transition-all duration-300 ${compact ? "flex gap-0" : ""}`}>
      {/* Image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${compact ? "w-36 h-auto" : "h-48"}`}>
        <img alt={rec.name} src={rec.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <div
            className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <Sparkles size={11} />
            {rec.match}% match
          </div>
          {rec.featured && (
            <span
              className="bg-white/90 text-[var(--near-black)] text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Featured
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <div
            className="bg-[var(--near-black)]/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <TypeIcon typeLabel={rec.typeLabel} />
            {rec.cardType}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-bold text-[var(--near-black)] text-lg leading-tight"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            {rec.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              {rec.rating}
            </span>
            <span className="text-xs text-[#4A5568]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              ({rec.reviews})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#4A5568] text-sm mb-3" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          <MapPin size={13} />
          <span>{rec.location}</span>
          {rec.capacity && (
            <>
              <span className="mx-2 text-gray-300">·</span>
              <Users size={13} />
              <span>{rec.capacity}</span>
            </>
          )}
        </div>

        {!compact && (
          <p className="text-[#4A5568] text-sm leading-relaxed mb-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            {rec.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {rec.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#F9F4EE] text-[#4A5568] text-xs px-2.5 py-1 rounded-full"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 mt-auto">
          <div>
            <p className="text-lg font-extrabold text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              {rec.price}
            </p>
            <p className="text-xs text-[#4A5568] mt-0.5" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              Est. Total: <span className="font-semibold text-[var(--coral-500)]">{rec.estTotal}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 rounded-xl text-[#4A5568] text-sm font-semibold hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <X size={16} /> Pass
          </button>
          <button
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 forge-btn-primary rounded-xl text-sm font-semibold"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <Heart size={16} /> Shortlist
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Compare card (horizontal wide layout) ──────────────────────────────── */

function CompareCard({ rec }: { rec: Recommendation }) {
  return (
    <div className="forge-card overflow-hidden flex gap-0">
      <div className="relative w-48 flex-shrink-0">
        <img alt={rec.name} src={rec.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        <div className="absolute top-3 left-3">
          <div
            className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <Sparkles size={10} />
            {rec.match}%
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 grid grid-cols-4 gap-4 items-center">
        {/* Name + type */}
        <div>
          <div
            className="text-xs font-semibold text-[#9b8a8a] uppercase tracking-wider mb-1"
            style={{ fontFamily: "monospace" }}
          >
            {rec.typeLabel}
          </div>
          <h3 className="font-bold text-[var(--near-black)] text-base leading-tight" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            {rec.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-[#4A5568]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            <MapPin size={11} /> {rec.location}
          </div>
        </div>

        {/* Rating */}
        <div className="text-center">
          <div className="text-xs font-semibold text-[#9b8a8a] uppercase tracking-wider mb-1" style={{ fontFamily: "monospace" }}>Rating</div>
          <div className="flex items-center justify-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>{rec.rating}</span>
          </div>
          <div className="text-xs text-[#4A5568]" style={{ fontFamily: '"DM Sans", sans-serif' }}>({rec.reviews} reviews)</div>
        </div>

        {/* Price */}
        <div className="text-center">
          <div className="text-xs font-semibold text-[#9b8a8a] uppercase tracking-wider mb-1" style={{ fontFamily: "monospace" }}>Price</div>
          <div className="font-bold text-[var(--near-black)] text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>{rec.price}</div>
          <div className="text-xs text-[var(--coral-500)] font-semibold" style={{ fontFamily: '"DM Sans", sans-serif' }}>{rec.estTotal}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            className="flex items-center justify-center gap-1.5 py-2 forge-btn-primary rounded-xl text-xs font-semibold"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <Heart size={13} /> Shortlist
          </button>
          <button
            className="flex items-center justify-center gap-1.5 py-2 border-2 border-gray-200 rounded-xl text-xs font-semibold text-[#4A5568] hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <X size={13} /> Pass
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter panel ───────────────────────────────────────────────────────── */

interface FilterState {
  types: Set<string>;         // "Venue" | "Vendor"
  categories: Set<string>;    // typeLabel values
  featuredOnly: boolean;
  minMatch: number;
}

function FilterPanel({
  allCategories,
  filters,
  onChange,
  onClose,
}: {
  allCategories: string[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
}) {
  const toggleType = (t: string) => {
    const next = new Set(filters.types);
    next.has(t) ? next.delete(t) : next.add(t);
    onChange({ ...filters, types: next });
  };
  const toggleCat = (c: string) => {
    const next = new Set(filters.categories);
    next.has(c) ? next.delete(c) : next.add(c);
    onChange({ ...filters, categories: next });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xl mb-4 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          Filters
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
          <X size={16} className="text-[#4A5568]" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Card type */}
        <div>
          <p className="text-xs font-semibold text-[#9b8a8a] uppercase tracking-wider mb-3" style={{ fontFamily: "monospace" }}>
            Card Type
          </p>
          <div className="space-y-2">
            {["Venue", "Vendor"].map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => toggleType(t)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                    filters.types.has(t)
                      ? "bg-[var(--coral-500)] border-[var(--coral-500)]"
                      : "border-gray-300 group-hover:border-[var(--coral-500)]"
                  }`}
                >
                  {filters.types.has(t) && <Check size={12} className="text-white" />}
                </div>
                <span className="text-sm text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  {t}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        {allCategories.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#9b8a8a] uppercase tracking-wider mb-3" style={{ fontFamily: "monospace" }}>
              Category
            </p>
            <div className="space-y-2">
              {allCategories.map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => toggleCat(c)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      filters.categories.has(c)
                        ? "bg-[var(--coral-500)] border-[var(--coral-500)]"
                        : "border-gray-300 group-hover:border-[var(--coral-500)]"
                    }`}
                  >
                    {filters.categories.has(c) && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-sm text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured only */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          Featured only
        </span>
        <button
          onClick={() => onChange({ ...filters, featuredOnly: !filters.featuredOnly })}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            filters.featuredOnly ? "bg-[var(--coral-500)]" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              filters.featuredOnly ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Min match score */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            Min. Match Score
          </span>
          <span className="text-sm font-bold text-[var(--coral-500)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            {filters.minMatch}%
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={99}
          value={filters.minMatch}
          onChange={(e) => onChange({ ...filters, minMatch: Number(e.target.value) })}
          className="w-full accent-[var(--coral-500)]"
        />
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ types: new Set(), categories: new Set(), featuredOnly: false, minMatch: 50 })}
        className="mt-4 w-full py-2 text-sm text-[#4A5568] hover:text-[var(--coral-500)] transition-colors font-medium"
        style={{ fontFamily: '"DM Sans", sans-serif' }}
      >
        Reset all filters
      </button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

function RecommendationInner() {
  const [allRecs, setAllRecs] = useState<Recommendation[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    types: new Set(),
    categories: new Set(),
    featuredOnly: false,
    minMatch: 50,
  });
  const sortRef = useRef<HTMLDivElement>(null);

  /* Load from sessionStorage on mount */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("matchResults");
      if (raw) {
        const parsed = JSON.parse(raw) as {
          venues?: MatchedVenue[];
          vendors?: MatchedVendor[];
        };
        const venueRecs = (parsed.venues ?? []).map((v, i) => venueToRec(v, i));
        const vendorRecs = (parsed.vendors ?? []).map((v, i) => vendorToRec(v, i));
        const combined = [...venueRecs, ...vendorRecs].sort((a, b) => b.match - a.match);
        if (combined.length > 0) {
          setAllRecs(combined);
          setIsLive(true);
          return;
        }
      }
    } catch { /* fall through to mock */ }
    setAllRecs(MOCK);
  }, []);

  /* Close sort dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Derive all unique categories for filter panel */
  const allCategories = useMemo(
    () => [...new Set(allRecs.map((r) => r.typeLabel))].sort(),
    [allRecs]
  );

  /* Apply filters then sort */
  const displayed = useMemo(() => {
    let result = allRecs;
    if (filters.types.size > 0)
      result = result.filter((r) => filters.types.has(r.cardType));
    if (filters.categories.size > 0)
      result = result.filter((r) => filters.categories.has(r.typeLabel));
    if (filters.featuredOnly)
      result = result.filter((r) => r.featured);
    result = result.filter((r) => r.match >= filters.minMatch);
    return sortRecs(result, sortKey);
  }, [allRecs, filters, sortKey]);

  const activeFilterCount =
    filters.types.size +
    filters.categories.size +
    (filters.featuredOnly ? 1 : 0) +
    (filters.minMatch > 50 ? 1 : 0);

  /* Sidebar helpers */
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of allRecs) {
      counts[r.typeLabel] = (counts[r.typeLabel] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allRecs]);

  /* Calendar */
  const calendarCells: (number | null)[] = [
    ...Array(JUNE_OFFSET).fill(null),
    ...Array.from({ length: JUNE_DAYS }, (_, i) => i + 1),
  ];

  return (
    <div className="min-h-screen bg-[#F9F4EE]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-[1280px] mx-auto">

          {/* ── Header ── */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 bg-[var(--coral-500)]/10 text-[var(--coral-500)] px-4 py-2 rounded-full mb-4"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              <Sparkles size={14} />
              <span className="text-sm font-semibold">
                {isLive ? "AI-Matched Results" : "Sample Results"}
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl font-extrabold text-[var(--near-black)] mb-3"
              style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: "-0.03em" }}
            >
              Your personalised recommendations.
            </h1>
            <p className="text-[#4A5568] text-base max-w-xl mx-auto" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              {displayed.length} of {allRecs.length} option{allRecs.length !== 1 ? "s" : ""} match your criteria.
              {selectedDay ? ` Showing availability for June ${selectedDay}.` : " Select a date to see real-time availability."}
            </p>
          </div>

          {/* ── Main grid ── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-20 lg:self-start">

              {/* Calendar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[var(--near-black)] text-lg" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    Event Date
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-[#F9F4EE] rounded-lg transition-colors" aria-label="Previous month">
                      <ChevronLeft size={18} className="text-[#4A5568]" />
                    </button>
                    <span className="text-sm font-semibold text-[var(--near-black)] min-w-[120px] text-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      June 2026
                    </span>
                    <button className="p-1.5 hover:bg-[#F9F4EE] rounded-lg transition-colors" aria-label="Next month">
                      <ChevronRight size={18} className="text-[#4A5568]" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-5 pb-4 border-b border-gray-100">
                  {[
                    { color: "bg-emerald-500", label: "Available" },
                    { color: "bg-amber-500",   label: "Limited" },
                    { color: "bg-red-500",      label: "Booked" },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-xs text-[#4A5568]" style={{ fontFamily: '"DM Sans", sans-serif' }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-bold text-[#4A5568] py-2" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} className="aspect-square" />;
                    if (day <= TODAY) {
                      return (
                        <button key={day} disabled className="aspect-square rounded-lg text-xs font-semibold flex items-center justify-center border-2 bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                          {day}
                        </button>
                      );
                    }
                    const isSelected = day === selectedDay;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(isSelected ? null : day)}
                        className={`aspect-square rounded-lg text-xs font-semibold transition-all flex items-center justify-center border-2 border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100${isSelected ? " ring-2 ring-offset-1 ring-[var(--coral-500)]" : ""}`}
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget summary */}
              <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-emerald-700 mb-1" style={{ fontFamily: "monospace" }}>
                      Budget Status
                    </p>
                    <p className="text-2xl font-extrabold text-emerald-600" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      $0 spent
                    </p>
                  </div>
                  <CircleCheck size={28} className="text-emerald-500" />
                </div>
                <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--coral-500)] rounded-full" style={{ width: "0%" }} />
                </div>
                <div className="mt-3">
                  <TrendingDown size={18} className="text-[#c5b8b0] mx-auto mb-1" />
                  <p className="text-xs text-[#9b8a8a] text-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    Shortlist items to track your spend
                  </p>
                </div>
              </div>

              {/* Category breakdown */}
              {categoryBreakdown.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-widest font-semibold text-[#9b8a8a] mb-4" style={{ fontFamily: "monospace" }}>
                    Results Breakdown
                  </p>
                  <div className="space-y-3">
                    {categoryBreakdown.map(([label, count]) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[var(--coral-500)]/10 flex items-center justify-center flex-shrink-0">
                          <TypeIcon typeLabel={label} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--near-black)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                              {label}
                            </span>
                            <span className="text-xs font-bold text-[var(--coral-500)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                              {count}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--coral-500)] rounded-full"
                              style={{ width: `${(count / allRecs.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: controls + cards ── */}
            <div className="lg:col-span-2">

              {/* Filter panel (shown when open) */}
              {showFilters && (
                <FilterPanel
                  allCategories={allCategories}
                  filters={filters}
                  onChange={setFilters}
                  onClose={() => setShowFilters(false)}
                />
              )}

              {/* Control bar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">

                  {/* Filter button */}
                  <button
                    onClick={() => setShowFilters((v) => !v)}
                    className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-semibold transition-colors ${
                      showFilters || activeFilterCount > 0
                        ? "border-[var(--coral-500)] text-[var(--coral-500)] bg-[var(--coral-500)]/5"
                        : "border-gray-200 text-[var(--near-black)] hover:border-[var(--coral-500)] hover:text-[var(--coral-500)]"
                    }`}
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 w-5 h-5 rounded-full bg-[var(--coral-500)] text-white text-xs flex items-center justify-center font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Sort dropdown */}
                  <div className="relative" ref={sortRef}>
                    <button
                      onClick={() => setShowSort((v) => !v)}
                      className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-semibold transition-colors ${
                        showSort
                          ? "border-[var(--coral-500)] text-[var(--coral-500)]"
                          : "border-gray-200 text-[var(--near-black)] hover:border-[var(--coral-500)]"
                      }`}
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      <ArrowUpDown size={16} />
                      Sort: {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                      <ChevronDown size={14} className={`transition-transform ${showSort ? "rotate-180" : ""}`} />
                    </button>

                    {showSort && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 min-w-[200px] overflow-hidden">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => { setSortKey(opt.key); setShowSort(false); }}
                            className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              sortKey === opt.key
                                ? "bg-[var(--coral-500)]/10 text-[var(--coral-500)] font-semibold"
                                : "text-[#4A5568] hover:bg-[#F9F4EE]"
                            }`}
                            style={{ fontFamily: '"DM Sans", sans-serif' }}
                          >
                            {opt.label}
                            {sortKey === opt.key && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Grid / Compare toggle */}
                  <div className="flex gap-1 bg-[#F9F4EE] rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-[var(--coral-500)] shadow-sm"
                          : "text-[#4A5568] hover:text-[var(--near-black)]"
                      }`}
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      <LayoutGrid size={14} /> Grid
                    </button>
                    <button
                      onClick={() => setViewMode("compare")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                        viewMode === "compare"
                          ? "bg-white text-[var(--coral-500)] shadow-sm"
                          : "text-[#4A5568] hover:text-[var(--near-black)]"
                      }`}
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      <Columns3 size={14} /> Compare
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty state */}
              {displayed.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Filter size={32} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="font-bold text-[var(--near-black)] mb-2" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    No results match these filters
                  </h3>
                  <p className="text-sm text-[#4A5568] mb-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    Try adjusting your filters or sort order.
                  </p>
                  <button
                    onClick={() => setFilters({ types: new Set(), categories: new Set(), featuredOnly: false, minMatch: 50 })}
                    className="forge-btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {displayed.map((rec) => (
                    <RecommendationCard key={`${rec.name}-${rec.cardType}`} rec={rec} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayed.map((rec) => (
                    <CompareCard key={`${rec.name}-${rec.cardType}`} rec={rec} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ─── Page export ────────────────────────────────────────────────────────── */

export default function RecommendationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F4EE] flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full border-4 border-transparent border-t-[var(--coral-500)] mx-auto mb-4"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p className="text-[#4A5568] text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              Loading your results…
            </p>
          </div>
        </div>
      }
    >
      <RecommendationInner />
    </Suspense>
  );
}
