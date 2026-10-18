"use client";

import { useState } from "react";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "The AI matching is incredibly accurate. We found our perfect venue and catering partner on the first try. Event Foundry is now our go-to platform.",
    name: "David Patel",
    role: "Senior Events Manager",
    company: "TechConf Asia",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663429518879/UtuzPw49jVfKAouNtyxyq8/hero-warm-ballroom-NNsRoyTKX4Ksbep4bSknCm.webp",
    duration: "0:41",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "We used to spend a full week just sourcing venues. Now we have curated shortlists in minutes. The quality of partners is exceptional.",
    name: "Sarah Chen",
    role: "Head of Corporate Events",
    company: "Meridian Group",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663429518879/UtuzPw49jVfKAouNtyxyq8/venue-rooftop-modern-kTfzbD8UwkvR4Qt6tcq7gG.webp",
    duration: "1:02",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="forge-section-label">TRUSTED BY LEADING ORGANIZERS</span>
          </div>
          <h2
            className="text-3xl md:text-4xl text-[var(--near-black)] mb-4"
            style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800 }}
          >
            Loved by Event Professionals
          </h2>
          <p
            className="text-warm-400 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Hear from organizers who&apos;ve transformed their event sourcing with Event
            Foundry
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative group">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-[var(--near-black)]">
                <img
                  alt={t.name}
                  className="w-full h-full object-cover"
                  src={t.image}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-[var(--coral-500)] flex items-center justify-center shadow-lg">
                    <Play size={28} className="text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {t.duration}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-[var(--coral-500)] fill-[var(--coral-500)]"
                    />
                  ))}
                </div>
                <p
                  className="text-xl md:text-2xl text-[var(--near-black)] font-semibold leading-relaxed mb-6"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="border-l-4 border-[var(--coral-500)] pl-4">
                <p
                  className="font-bold text-[var(--near-black)] text-lg"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {t.name}
                </p>
                <p
                  className="text-warm-400 text-sm"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {t.role}, {t.company}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--coral-500)] hover:text-[var(--coral-500)] transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === current ? "bg-[var(--coral-500)]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--coral-500)] hover:text-[var(--coral-500)] transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
