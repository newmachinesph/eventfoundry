"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CircleCheckBig,
  Star,
  Sparkles,
  Building2,
  Hotel,
  Waves,
  Sunset,
  TreePine,
  UtensilsCrossed,
  MapPin,
  Users,
  ArrowRight,
  Camera,
  Music,
  ChefHat,
  Flower,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

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

function getVenueChipType(venue_types: string[]): string {
  const t = venue_types.join(" ").toLowerCase();
  if (t.includes("hotel")) return "Hotel";
  if (t.includes("villa") || t.includes("private")) return "Villa";
  if (t.includes("rooftop")) return "Rooftop";
  if (t.includes("garden") || t.includes("outdoor")) return "Garden";
  if (t.includes("restaurant")) return "Restaurant";
  return "Hotel"; // default fallback
}

/* ─── Data Types ───────────────────────────────────────────────────────── */

type Venue = {
  name: string;
  location: string;
  capacity: number | string;
  featured: boolean;
  rating: number;
  description: string;
  tags: string[];
  price: string;
  image: string;
  type: string;
};

type Vendor = {
  name: string;
  specialty: string;
  featured: boolean;
  rating: number;
  description: string;
  tags: string[];
  price: string;
  image: string;
  type: string;
};

/* ─── Chip configs ──────────────────────────────────────────────────────── */

const venueChips = [
  { label: "All", Icon: Building2 },
  { label: "Hotel", Icon: Hotel },
  { label: "Villa", Icon: Waves },
  { label: "Rooftop", Icon: Sunset },
  { label: "Garden", Icon: TreePine },
  { label: "Restaurant", Icon: UtensilsCrossed },
];

const vendorChips = [
  { label: "All", Icon: Users },
  { label: "Photography", Icon: Camera },
  { label: "Entertainment", Icon: Music },
  { label: "Catering", Icon: ChefHat },
  { label: "Floristry", Icon: Flower },
];

/* ─── Card ──────────────────────────────────────────────────────────────── */

function BrandCard({
  name,
  location,
  capacity,
  featured,
  rating,
  description,
  tags,
  price,
  image,
}: {
  name: string;
  location: string;
  capacity: number | string;
  featured: boolean;
  rating: number;
  description: string;
  tags: string[];
  price: string;
  image: string;
}) {
  return (
    <div className="forge-card overflow-hidden group">
      <div className="relative h-52 overflow-hidden">
        <img
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {featured && (
          <div className="absolute top-3 left-3">
            <span
              className="bg-[var(--coral-500)] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              <Sparkles size={10} /> Featured
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span
            className="text-xs font-bold text-[var(--near-black)]"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            {rating}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3
          className="font-bold text-[var(--near-black)] text-lg mb-1 leading-tight"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {name}
        </h3>

        <div
          className="flex items-center gap-1 text-[#4A5568] text-xs mb-3"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          <MapPin size={11} />
          <span>{location}</span>
          <span className="mx-1.5 text-gray-300">·</span>
          <Users size={11} />
          <span>
            {typeof capacity === "number" ? `Up to ${capacity} pax` : capacity}
          </span>
        </div>

        <p
          className="text-[#4A5568] text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#F9F4EE] text-[#4A5568] text-xs px-2 py-0.5 rounded-full"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-xs text-[#4A5568] uppercase tracking-wide"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              From
            </span>
            <p
              className="text-lg font-extrabold text-[var(--near-black)]"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {price}
            </p>
          </div>
          <Link href="/source">
            <button className="forge-btn-primary px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              Source <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function BrandsPage() {
  const [activeTab, setActiveTab] = useState<"Venues" | "Vendors">("Venues");
  const [activeChip, setActiveChip] = useState("All");

  const [venues, setVenues] = useState<Venue[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeChip]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [venuesRes, vendorsRes] = await Promise.all([
        supabase.from("venues").select("*").order("rating", { ascending: false }),
        supabase.from("vendors").select("*").order("rating", { ascending: false })
      ]);

      if (venuesRes.data) {
        setVenues(venuesRes.data.map((v: any, i: number) => ({
          name: v.name,
          location: v.region,
          capacity: v.max_capacity,
          featured: v.is_featured,
          rating: v.rating,
          description: v.description,
          tags: [...(v.venue_type || []).slice(0, 2), v.region].filter(Boolean),
          price: `$${v.min_pax_price || 0}/pax`,
          image: pickImage(VENUE_IMAGES, v.slug || String(i)),
          type: getVenueChipType(v.venue_type || []),
        })));
      }

      if (vendorsRes.data) {
        setVendors(vendorsRes.data.map((v: any, i: number) => ({
          name: v.name,
          specialty: v.category,
          featured: v.is_featured,
          rating: v.rating,
          description: v.description,
          tags: [...(v.specialties || []).slice(0, 2), v.category].filter(Boolean),
          price: `From $${v.base_price || 0}`,
          image: pickImage(VENDOR_IMAGES[v.category] || VENUE_IMAGES, v.slug || String(i)),
          type: v.category === "Decor & Flowers" ? "Floristry" : v.category,
        })));
      }
      
      setLoading(false);
    }
    fetchData();
  }, []);

  const chips = activeTab === "Venues" ? venueChips : vendorChips;

  const filteredVenues =
    activeChip === "All" ? venues : venues.filter((v) => v.type === activeChip);

  const filteredVendors =
    activeChip === "All" ? vendors : vendors.filter((v) => v.type === activeChip);

  const items = activeTab === "Venues" ? filteredVenues : filteredVendors;

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F9F4EE]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[var(--near-black)] pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--near-black)] via-[#1A2235] to-[var(--near-black)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--coral-500)]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center">
          <p className="forge-section-label mb-4">Our Partners</p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Curated venues &amp; vendors.
          </h1>
          <p
            className="text-white/60 text-lg max-w-xl mx-auto mb-8"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Hand-picked and quality-checked by our team of experienced event planners.
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { Icon: CircleCheckBig, text: "200+ verified partners" },
              { Icon: Star, text: "4.8 average rating" },
              { Icon: Sparkles, text: "AI-matched recommendations" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={14} className="text-[var(--coral-500)]" />
                <span
                  className="text-white/60 text-sm"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-100">
            {(["Venues", "Vendors"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveChip("All");
                }}
                className={`px-6 py-4 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[var(--coral-500)] text-[var(--coral-500)]"
                    : "border-transparent text-[#4A5568] hover:text-[var(--near-black)]"
                }`}
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chips */}
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {chips.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => setActiveChip(label)}
                className={`forge-chip flex-shrink-0 flex items-center gap-1.5 ${
                  activeChip === label ? "active" : ""
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#4A5568] text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              Showing{" "}
              <span className="font-semibold text-[var(--near-black)]">{items.length}</span>{" "}
              {activeTab.toLowerCase()}
            </p>
            <Link href="/source">
              <button className="forge-btn-primary px-5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2">
                Start Sourcing <ArrowRight size={15} />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[var(--coral-500)]" size={48} />
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === "Venues"
                  ? (paginatedItems as Venue[]).map((v) => (
                      <BrandCard
                        key={v.name}
                        name={v.name}
                        location={v.location}
                        capacity={v.capacity}
                        featured={v.featured}
                        rating={v.rating}
                        description={v.description}
                        tags={v.tags}
                        price={v.price}
                        image={v.image}
                      />
                    ))
                  : (paginatedItems as Vendor[]).map((v) => (
                      <BrandCard
                        key={v.name}
                        name={v.name}
                        location={v.specialty}
                        capacity={v.price}
                        featured={v.featured}
                        rating={v.rating}
                        description={v.description}
                        tags={v.tags}
                        price={v.price}
                        image={v.image}
                      />
                    ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-[#4A5568] hover:border-[var(--coral-500)] hover:text-[var(--coral-500)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span
                    className="text-sm font-semibold text-[var(--near-black)] px-4"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-[#4A5568] hover:border-[var(--coral-500)] hover:text-[var(--coral-500)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p
                className="text-[#4A5568] text-base"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                No {activeTab.toLowerCase()} found for this filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--near-black)]">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: "-0.03em" }}
          >
            Ready to source your event?
          </h2>
          <p
            className="text-white/60 text-base mb-8 max-w-md mx-auto"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Let our AI match you with the perfect combination from our partner network.
          </p>
          <Link href="/source">
            <button className="forge-btn-primary px-10 py-4 text-base font-semibold rounded-xl inline-flex items-center gap-2 mx-auto">
              Start Sourcing Now <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
