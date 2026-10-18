"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Filter,
  Calendar,
  MapPin,
  Users,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Category = "All Events" | "Weddings" | "Corporate" | "Social" | "Product Launch" | "Conference";

type PastEvent = {
  title: string;
  date: string;
  location: string;
  guests: number;
  description: string;
  venue: string;
  vendors: string[];
  quote: string;
  quoteName: string;
  quoteRole: string;
  image: string;
  photoCount: number;
  category: Category;
};

/* ─── Data ──────────────────────────────────────────────────────────────── */

const events: PastEvent[] = [
  {
    title: "Marina Bay Wedding Celebration",
    date: "Feb 14, 2026",
    location: "Singapore",
    guests: 250,
    description:
      "An elegant waterfront wedding with stunning Marina Bay views, featuring a custom-designed ballroom setup and live band performance.",
    venue: "The Fullerton Hotel",
    vendors: ["Luminary Studios", "Floral Designs Co.", "Gourmet Catering"],
    quote:
      "Event Foundry made our wedding planning effortless. The venue and vendors they matched us with were absolutely perfect!",
    quoteName: "Sarah & Michael",
    quoteRole: "Newlyweds",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    photoCount: 4,
    category: "Weddings",
  },
  {
    title: "Tech Summit 2026",
    date: "Mar 10, 2026",
    location: "Singapore",
    guests: 800,
    description:
      "A large-scale tech conference featuring keynote speakers, breakout sessions, and networking events across three days.",
    venue: "Marina Bay Sands Convention Centre",
    vendors: ["AV Professionals", "Catering Plus", "Event Design Studio"],
    quote:
      "The platform helped us find the perfect venue and vendors in just minutes. Our conference was a massive success!",
    quoteName: "David Chen",
    quoteRole: "Event Director, TechCorp",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    photoCount: 4,
    category: "Conference",
  },
  {
    title: "Corporate Gala Dinner",
    date: "Jan 28, 2026",
    location: "Singapore",
    guests: 400,
    description:
      "An exclusive corporate gala celebrating company milestones with fine dining, entertainment, and awards ceremony.",
    venue: "Sentosa Cove Villa",
    vendors: ["Luminary Studios", "Fine Dining Catering", "Decor Artistry"],
    quote:
      "Event Foundry's AI matching was incredible. We got the perfect venue and vendors that exceeded all expectations.",
    quoteName: "Jennifer Wong",
    quoteRole: "CEO, Global Enterprises",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663429518879/UtuzPw49jVfKAouNtyxyq8/venue-rooftop-dDTWYpz24aiEAKNqks87Xt.webp",
    photoCount: 4,
    category: "Corporate",
  },
  {
    title: "Product Launch Party",
    date: "Feb 5, 2026",
    location: "Singapore",
    guests: 300,
    description:
      "A vibrant product launch event with interactive installations, live demonstrations, and celebrity appearances.",
    venue: "Orchard Central Rooftop",
    vendors: ["Creative Studios", "Premium Catering", "DJ Entertainment"],
    quote:
      "The platform's recommendations were spot-on. Our launch event was featured in 3 major publications!",
    quoteName: "Marcus Lee",
    quoteRole: "Marketing Director, InnovateTech",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    photoCount: 4,
    category: "Product Launch",
  },
  {
    title: "Charity Gala Fundraiser",
    date: "Jan 15, 2026",
    location: "Singapore",
    guests: 500,
    description:
      "An elegant charity gala raising funds for education initiatives, featuring auctions and performances.",
    venue: "The Fullerton Hotel",
    vendors: ["Luminary Studios", "Gourmet Catering", "Floral Designs Co."],
    quote:
      "Event Foundry helped us organize a beautiful gala that raised $500K for our cause. Truly grateful!",
    quoteName: "Patricia Ng",
    quoteRole: "Founder, Education First NGO",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    photoCount: 4,
    category: "Social",
  },
  {
    title: "Intimate Garden Wedding",
    date: "Dec 20, 2025",
    location: "Singapore",
    guests: 120,
    description:
      "A romantic garden wedding with personalized touches, outdoor ceremony, and sunset reception.",
    venue: "Sentosa Cove Villa",
    vendors: ["Luminary Studios", "Floral Designs Co.", "Intimate Catering"],
    quote:
      "Perfect! Event Foundry matched us with vendors who understood our vision completely. Our wedding was magical!",
    quoteName: "Emily & James",
    quoteRole: "Newlyweds",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    photoCount: 4,
    category: "Weddings",
  },
];

const categories: { label: Category; emoji?: string }[] = [
  { label: "All Events" },
  { label: "Weddings", emoji: "💍" },
  { label: "Corporate", emoji: "🏢" },
  { label: "Social", emoji: "🎉" },
  { label: "Product Launch", emoji: "🚀" },
  { label: "Conference", emoji: "📊" },
];

/* ─── Card ──────────────────────────────────────────────────────────────── */

function EventCard({ event }: { event: PastEvent }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={event.image}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--coral-500)] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <ImageIcon size={16} />
            View Gallery ({event.photoCount})
          </button>
        </div>
        <div className="absolute top-3 right-3 bg-[var(--coral-500)] text-white px-2.5 py-1 rounded-full text-xs font-bold">
          {event.photoCount} photos
        </div>
      </div>

      <div className="p-6">
        <h3
          className="text-xl font-bold text-[var(--near-black)] mb-2"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {event.title}
        </h3>

        <div
          className="space-y-2 mb-4 text-sm text-[#4A5568]"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[var(--coral-500)]" />
            {event.date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[var(--coral-500)]" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[var(--coral-500)]" />
            {event.guests} guests
          </div>
        </div>

        <p
          className="text-sm text-[#4A5568] mb-4 line-clamp-2"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {event.description}
        </p>

        <div className="mb-4 pb-4 border-b border-gray-100">
          <p
            className="text-xs font-semibold text-[var(--near-black)] uppercase mb-2"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Venue &amp; Vendors
          </p>
          <div className="space-y-1">
            <p
              className="text-xs text-[var(--coral-500)] font-semibold"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              📍 {event.venue}
            </p>
            <div className="flex flex-wrap gap-1">
              {event.vendors.map((v) => (
                <span
                  key={v}
                  className="text-xs bg-[#F9F4EE] text-[#4A5568] px-2 py-1 rounded"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#F9F4EE] rounded-lg p-3 mb-4">
          <p
            className="text-xs italic text-[#4A5568] mb-2"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            &ldquo;{event.quote}&rdquo;
          </p>
          <p
            className="text-xs font-semibold text-[var(--near-black)]"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            — {event.quoteName}
          </p>
          <p className="text-xs text-[#999]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            {event.quoteRole}
          </p>
        </div>

        <button
          className="w-full py-2.5 bg-[var(--near-black)] hover:bg-[#1a1f2e] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          View Full Gallery <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PastEventsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All Events");

  const filtered =
    activeCategory === "All Events"
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9F4EE]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-[1280px] mx-auto">
          {/* Hero */}
          <div className="mb-12 text-center">
            <div
              className="inline-flex items-center gap-2 bg-[var(--coral-500)]/10 text-[var(--coral-500)] px-4 py-2 rounded-full mb-4"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              <Award size={14} />
              <span className="text-sm font-semibold">Success Stories</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-[var(--near-black)] mb-4"
              style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: "-0.03em" }}
            >
              Past Events Gallery
            </h1>
            <p
              className="text-lg text-[#4A5568] max-w-2xl mx-auto"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Explore the stunning events we&apos;ve helped bring to life. From intimate gatherings
              to grand celebrations, see how Event Foundry connects organizers with perfect venues
              and vendors.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(({ label, emoji }) => {
              const isActive = activeCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all ${
                    isActive
                      ? "bg-[var(--coral-500)] text-white shadow-lg shadow-[var(--coral-500)]/30"
                      : "bg-white text-[#4A5568] border border-gray-200 hover:border-[var(--coral-500)] hover:text-[var(--coral-500)]"
                  }`}
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  <Filter size={14} className="inline mr-1.5" />
                  {emoji ? `${emoji} ${label}` : label}
                </button>
              );
            })}
          </div>

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filtered.map((event) => (
                <EventCard key={event.title} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 mb-16">
              <p className="text-[#4A5568]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                No events found for this category.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[var(--near-black)] to-[#1a1f2e] rounded-2xl p-8 md:p-12 text-white text-center">
            <h2
              className="text-3xl font-extrabold mb-3"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Ready to Create Your Success Story?
            </h2>
            <p
              className="text-white/70 mb-6 max-w-2xl mx-auto"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Join hundreds of event organizers who&apos;ve used Event Foundry to find the perfect
              venues and vendors for their events.
            </p>
            <Link
              href="/source"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--coral-500)] hover:bg-[#D4720A] text-white rounded-xl font-semibold transition-colors"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Start Sourcing <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
