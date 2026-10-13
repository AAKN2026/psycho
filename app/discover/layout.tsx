import type { Metadata } from "next";

const description =
  "Three everyday scenarios. Explore how you approach a challenge, reflect on your choices, and share a personal insight. A self-reflection activity, not a psychological diagnosis.";

export const metadata: Metadata = {
  title: "60-Second Self-Discovery | Persona",
  description,
  alternates: {
    canonical: "https://aakn2026.github.io/psycho/discover/",
  },
  openGraph: {
    title: "When life shifts, what do you do first? | Persona",
    description,
    url: "https://aakn2026.github.io/psycho/discover/",
    siteName: "Persona",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "When life shifts, what do you do first? | Persona",
    description,
  },
};

export default function DiscoverLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
