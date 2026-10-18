"use client";

import { MessageCircle } from "lucide-react";

export default function ChatWidget() {
  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg shadow-[var(--coral-500)]/30 flex items-center justify-center transition-all duration-300 forge-btn-primary hover:scale-110"
        aria-label="Talk to Sales"
      >
        <MessageCircle size={22} className="text-white" />
      </button>
      <div className="fixed bottom-[72px] right-5 z-50 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>
    </>
  );
}
