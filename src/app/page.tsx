"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { socialLinks } from "@/lib/data";

const heroVideos = ["/videos/hero-reel.mp4", "/videos/showreel.mp4"];
const TOTAL_FRAMES = 73;
const SCROLL_HEIGHT = 350; // vh units

function HeroSection() {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = useCallback(() => {
    setCurrentVideo((prev) => (prev + 1) % heroVideos.length);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          key={currentVideo}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
        >
          <source src={heroVideos[currentVideo]} type="video/mp4" />
        </video>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-7xl md:text-9xl font-bold text-white tracking-wider">
          GANNOE MEDIA
        </h1>
        <p className="text-white/60 text-lg mt-4">
          Film &middot; Video &middot; Photography
        </p>
        <div className="flex gap-4 mt-10">
          <Link
            href="/work"
            className="px-8 py-3 bg-accent text-white text-sm font-medium uppercase tracking-widest hover:bg-accent-hover transition-colors"
          >
            View Work
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border border-white/20 text-white text-sm font-medium uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}

function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);
  const [textOpacity, setTextOpacity] = useState({ line1: 0, line2: 0 });

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/images/camera-frames/frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        loadedCountRef.current++;
        if (loadedCountRef.current === 1) drawFrame(0);
      };
      images.push(img);
    }
    imagesRef.current = images;

    function drawFrame(index: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      // Size canvas to viewport with device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = Math.round(vw * dpr);
      const ch = Math.round(vh * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      // Fill entire canvas with black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cw, ch);

      // Draw image centered at half viewport size
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const scale = Math.min(vw / imgW, vh / imgH) * 0.5 * dpr;
      const dw = imgW * scale;
      const dh = imgH * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function onScroll() {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableHeight = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );
      drawFrame(frameIndex);

      let line1 = 0;
      if (progress >= 0.25 && progress < 0.35) {
        line1 = (progress - 0.25) / 0.1;
      } else if (progress >= 0.35 && progress < 0.45) {
        line1 = 1;
      } else if (progress >= 0.45 && progress < 0.55) {
        line1 = 1 - (progress - 0.45) / 0.1;
      }

      let line2 = 0;
      if (progress >= 0.65 && progress < 0.75) {
        line2 = (progress - 0.65) / 0.1;
      } else if (progress >= 0.75) {
        line2 = 1;
      }

      setTextOpacity({ line1, line2 });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${SCROLL_HEIGHT}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Top fade from hero */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />

        {/* Bottom fade to next section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-10" />

        {/* Text overlays */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h2
            className="text-4xl md:text-7xl font-bold text-white text-center tracking-wider"
            style={{
              opacity: textOpacity.line1,
              transform: `translateY(${(1 - textOpacity.line1) * 20}px)`,
              transition: "none",
            }}
          >
            EVERY FRAME MATTERS
          </h2>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h2
            className="text-4xl md:text-7xl font-bold text-white text-center tracking-wider"
            style={{
              opacity: textOpacity.line2,
              transform: `translateY(${(1 - textOpacity.line2) * 20}px)`,
              transition: "none",
            }}
          >
            YOUR STORY STARTS HERE
          </h2>
        </div>
      </div>
    </div>
  );
}

const socialIcons: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.48a8.27 8.27 0 004.85 1.56V7.6a4.84 4.84 0 01-1.09-.91z" />
    </svg>
  ),
  Linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

function GetInTouch() {
  return (
    <section className="pt-28 pb-52 md:pt-40 md:pb-72 flex items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-foreground">
          Get In Touch
        </h2>

        <p className="text-text-muted text-lg md:text-xl mt-14 md:mt-16">
          Let&apos;s create something together.
        </p>

        <div className="flex items-center justify-center gap-20 md:gap-28 mt-16 md:mt-20">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              {socialIcons[social.icon]}
            </a>
          ))}
        </div>

        <Link
          href="/contact"
          className="mt-16 md:mt-20 px-10 py-4 border border-white/15 text-white text-sm font-medium uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <CameraScrollSection />
      <GetInTouch />
    </>
  );
}
