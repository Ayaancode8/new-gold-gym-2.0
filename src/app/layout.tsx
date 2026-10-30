import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const teko = localFont({ src: "../../node_modules/@fontsource/teko/files/teko-latin-500-normal.woff2", variable: "--font-teko", display: "swap" });
const barlow = localFont({ src: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", variable: "--font-barlow", display: "swap" });
const inter = localFont({
  src: [
    { path: "../../node_modules/@fontsource/inter-tight/files/inter-tight-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/inter-tight/files/inter-tight-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/inter-tight/files/inter-tight-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-inter", display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "New Gold Gym 2.0 | Train with purpose.",
  description: "Explore New Gold Gym 2.0, see the training floor, compare monthly memberships from PKR 1,500 and enquire on WhatsApp.",
  openGraph: {
    type: "website", locale: "en_PK", siteName: "New Gold Gym 2.0",
    title: "New Gold Gym 2.0 | Train with purpose.",
    description: "Explore your gym. Find your routine. Choose the right support for you.",
    images: [{ url: "/images/social.jpg", width: 1200, height: 600, alt: "New Gold Gym training artwork" }],
  },
  twitter: { card: "summary_large_image", title: "New Gold Gym 2.0", images: ["/images/social.jpg"] },
  icons: { apple: "/apple-icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#171C19", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${teko.variable} ${barlow.variable} ${inter.variable}`}><body><Script id="owner-navigation-guard" strategy="beforeInteractive">{`window.addEventListener("popstate",function(event){if(window.__newGoldLeaveGuard)window.__newGoldLeaveGuard(event);},true);`}</Script>{children}</body></html>;
}
