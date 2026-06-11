import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gannoe Media | Videography & Photography",
    template: "%s | Gannoe Media",
  },
  description:
    "Professional videography, highlight reels, photography, and visual storytelling by Henry Gannoe. Based in Pennsylvania.",
  keywords: [
    "videography",
    "highlight reels",
    "sports videography",
    "photography",
    "Penn State",
    "filmmaker",
    "video editor",
    "portraits",
  ],
  openGraph: {
    title: "Gannoe Media | Videography & Photography",
    description:
      "Professional videography, highlight reels, photography, and visual storytelling by Henry Gannoe.",
    url: "https://gannoemedia.com",
    siteName: "Gannoe Media",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gannoe Media",
    description:
      "Professional videography, highlight reels, photography, and visual storytelling.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative">
        <Navbar />
        <main className="flex-1 relative z-[1]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
