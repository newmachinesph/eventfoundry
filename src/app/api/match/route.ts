import { createClient } from "@supabase/supabase-js";

/* ─── Supabase (service key not needed — anon key + RLS SELECT is fine) ── */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface MatchRequest {
  sourcing_type: "venue" | "vendors" | "package";
  event: {
    type: string;
    guest_count: string;
    date: string | null;
  };
  venue_preferences?: {
    types: string[];
    locations: string[];
    amenities: string[];
    budget: string;
  };
  vendor_preferences?: {
    categories: string[];
    per_vendor_budget: string;
  };
}

export interface MatchedVenue {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  address: string;
  max_capacity: number;
  min_pax_price: number;
  est_total_price: number;
  venue_type: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  match_score: number;
}

export interface MatchedVendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  base_price: number;
  specialties: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  match_score: number;
}

/* ─── Mapping helpers ────────────────────────────────────────────────────── */

/** Wizard location label → DB region values */
const LOCATION_TO_REGIONS: Record<string, string[]> = {
  "CBD / Marina Bay":            ["CBD", "Marina Bay", "Raffles Place"],
  "Orchard / River Valley":      ["Orchard"],
  "Sentosa":                     ["Sentosa"],
  "North (Woodlands / Yishun)":  [], // no seeded venues in this area
  "East (Changi / Tampines)":    ["Changi"],
  "West (Jurong / Clementi)":    [], // no seeded venues in this area
  "Central (Bishan / Toa Payoh)":["Outram", "Bugis"],
  "Flexible / No Preference":    [], // signals: skip region filter
};

/** Wizard vendor category id → DB category */
const VENDOR_CAT_MAP: Record<string, string> = {
  photographer:  "Photography",
  videographer:  "Photography",
  catering:      "Catering",
  "live-music":  "Entertainment",
  florist:       "Decor & Flowers",
  photobooth:    "Entertainment",
};

/** Wizard venue type label → DB venue_type keywords */
const VENUE_TYPE_MAP: Record<string, string[]> = {
  "hotel-ballroom": ["Hotel Ballroom"],
  restaurant:       ["Restaurant"],
  garden:           ["Garden", "Outdoor"],
  rooftop:          ["Rooftop"],
  waterfront:       ["Waterfront", "Beachfront", "Marina View"],
  villa:            ["Villa", "Boutique", "Private"],
};

/** Parse budget strings like "$5,000 – $10,000" → { min, max } */
function parseBudgetRange(budget: string): { min: number; max: number } {
  const nums = budget.replace(/[$,+]/g, "").split(/–|-/).map((s) => parseInt(s.trim(), 10));
  if (nums.length === 1) {
    // e.g. "Under $5,000"
    if (budget.startsWith("Under")) return { min: 0, max: nums[0] };
    // e.g. "$100,000+"
    return { min: nums[0], max: 9_999_999 };
  }
  return { min: nums[0], max: nums[1] };
}

/** Compute a simple match score 0–100 for a venue */
function scoreVenue(
  venue: Record<string, unknown>,
  prefs: NonNullable<MatchRequest["venue_preferences"]>,
  guestCount: number
): number {
  let score = 50; // base
  let checks = 0;
  let hits = 0;

  // Rating quality boost (up to +15)
  const rating = venue.rating as number;
  score += Math.round((rating - 4.0) * 15);

  // Featured boost
  if (venue.is_featured) score += 5;

  // Guest capacity match
  if (guestCount > 0) {
    checks++;
    if ((venue.max_capacity as number) >= guestCount) hits++;
  }

  // Venue type overlap
  if (prefs.types.length > 0) {
    const dbTypes = (venue.venue_type as string[]).join(" ").toLowerCase();
    const wantedKeywords = prefs.types.flatMap((t) => VENUE_TYPE_MAP[t] ?? []);
    checks += wantedKeywords.length;
    hits += wantedKeywords.filter((k) => dbTypes.includes(k.toLowerCase())).length;
  }

  // Location match
  if (prefs.locations.length > 0 && !prefs.locations.includes("Flexible / No Preference")) {
    const wantedRegions = prefs.locations.flatMap((l) => LOCATION_TO_REGIONS[l] ?? []);
    checks++;
    if (wantedRegions.includes(venue.region as string)) hits++;
  }

  if (checks > 0) score += Math.round((hits / checks) * 20);

  return Math.min(99, Math.max(50, score));
}

/** Compute a simple match score 0–100 for a vendor */
function scoreVendor(
  vendor: Record<string, unknown>,
  prefs: NonNullable<MatchRequest["vendor_preferences"]>
): number {
  let score = 50;

  const rating = vendor.rating as number;
  score += Math.round((rating - 4.0) * 15);

  if (vendor.is_featured) score += 5;

  const wantedCats = prefs.categories.map((c) => VENDOR_CAT_MAP[c]).filter(Boolean);
  if (wantedCats.includes(vendor.category as string)) score += 10;

  return Math.min(99, Math.max(50, score));
}

/* ─── Route handler ──────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  let body: MatchRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sourcing_type, event, venue_preferences, vendor_preferences } = body;
  const guestCount = parseInt(event.guest_count ?? "0", 10) || 0;

  const results: { venues: MatchedVenue[]; vendors: MatchedVendor[] } = {
    venues: [],
    vendors: [],
  };

  /* ── Query venues ─────────────────────────────────────────────────────── */
  if (sourcing_type === "venue" || sourcing_type === "package") {
    const prefs = venue_preferences!;

    let query = supabase
      .from("venues")
      .select("id, name, slug, description, region, address, max_capacity, min_pax_price, est_total_price, venue_type, rating, review_count, is_featured")
      .order("rating", { ascending: false })
      .limit(30);

    // Region filter — collect all DB region values from selected location labels
    const wantedRegions = prefs.locations
      .filter((l) => l !== "Flexible / No Preference")
      .flatMap((l) => LOCATION_TO_REGIONS[l] ?? []);

    if (wantedRegions.length > 0) {
      query = query.in("region", wantedRegions);
    }

    // Budget filter
    if (prefs.budget) {
      const { min, max } = parseBudgetRange(prefs.budget);
      query = query.gte("est_total_price", min).lte("est_total_price", max);
    }

    // Guest capacity filter
    if (guestCount > 0) {
      query = query.gte("max_capacity", guestCount);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[match] venues query error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const scored = (data ?? [])
      .map((v) => ({
        ...(v as Record<string, unknown>),
        match_score: scoreVenue(v as Record<string, unknown>, prefs, guestCount),
      }))
      .sort((a, b) => (b.match_score as number) - (a.match_score as number))
      .slice(0, 8);

    results.venues = scored as unknown as MatchedVenue[];
  }

  /* ── Query vendors ────────────────────────────────────────────────────── */
  if (sourcing_type === "vendors" || sourcing_type === "package") {
    const prefs = vendor_preferences!;

    // Map wizard category ids → DB category strings
    const wantedCats = [
      ...new Set(prefs.categories.map((c) => VENDOR_CAT_MAP[c]).filter(Boolean)),
    ];

    let query = supabase
      .from("vendors")
      .select("id, name, slug, description, category, base_price, specialties, rating, review_count, is_featured")
      .order("rating", { ascending: false })
      .limit(40);

    if (wantedCats.length > 0) {
      query = query.in("category", wantedCats);
    }

    // Per-vendor budget filter
    if (prefs.per_vendor_budget) {
      const { max } = parseBudgetRange(prefs.per_vendor_budget);
      query = query.lte("base_price", max);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[match] vendors query error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const scored = (data ?? [])
      .map((v) => ({
        ...(v as Record<string, unknown>),
        match_score: scoreVendor(v as Record<string, unknown>, prefs),
      }))
      .sort((a, b) => (b.match_score as number) - (a.match_score as number))
      .slice(0, 8);

    results.vendors = scored as unknown as MatchedVendor[];
  }

  return Response.json(results);
}
