import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persona | Personality Insight Lab",
  description: "A thoughtful, evidence-informed personality insight experience.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
