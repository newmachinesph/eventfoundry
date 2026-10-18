import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[var(--near-black)] text-white border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs text-white/60"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              AI-powered event sourcing and matching platform. Connect with curated venues and
              vendors in 60 seconds.
            </p>
          </div>

          <div>
            <h4
              className="text-white/40 text-xs font-semibold mb-3 uppercase tracking-widest"
              style={{ fontFamily: "monospace" }}
            >
              Platform
            </h4>
            <ul
              className="space-y-2 text-sm text-white/60"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {[
                { href: "/", label: "Home" },
                { href: "/brands", label: "Brands" },
                { href: "/source", label: "Start Sourcing" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-coral-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-white/40 text-xs font-semibold mb-3 uppercase tracking-widest"
              style={{ fontFamily: "monospace" }}
            >
              Company
            </h4>
            <ul
              className="space-y-2 text-sm text-white/60"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {[
                { href: "#", label: "About Us" },
                { href: "#", label: "For Vendors" },
                { href: "#", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-coral-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <p
              className="text-white/40 text-xs"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              © 2025 Event Foundry. All rights reserved.
            </p>
            <span className="hidden md:block text-white/20 text-xs">·</span>
            <p
              className="text-white/25 text-xs italic"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Built for event planners, by event planners.
            </p>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/40 text-xs hover:text-white/70 transition-colors"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
