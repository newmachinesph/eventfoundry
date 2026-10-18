import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Event Foundry — AI-Powered Event Sourcing",
  description:
    "Find your perfect venue & vendors in 60 seconds. Event Foundry uses AI to match you with curated venues and vendors — instantly, transparently, and beautifully.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sora.variable} antialiased`}>
      <body className="min-h-screen">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
