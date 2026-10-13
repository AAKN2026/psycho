import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persona | Personality Insight Lab",
  description: "A thoughtful, evidence-informed personality insight experience.",
  applicationName: "Persona",
  icons: { icon: `${process.env.NODE_ENV === "production" ? "/psycho" : ""}/favicon.svg`, shortcut: `${process.env.NODE_ENV === "production" ? "/psycho" : ""}/favicon.svg` },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
