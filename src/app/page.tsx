"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import GetInTouch from "@/components/GetInTouch";
import "@/components/Hero.css";

const heroVideos = ["/videos/hero-reel.mp4", "/videos/showreel.mp4"];
const TOTAL_FRAMES = 73;
const SCROLL_HEIGHT = 350; // vh units

function HeroSection() {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = useCallback(() => {
    setCurrentVideo((prev) => (prev + 1) % heroVideos.length);
  }, []);

  return (
    <section className="hero">
      {/* Video background */}
      <div className="bg">
        <video
          key={currentVideo}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
        >
          <source src={heroVideos[currentVideo]} type="video/mp4" />
        </video>
      </div>

      {/* Cinematic overlays */}
      <div className="grade" />
      <div className="vig" />
      <div className="grain" />

      {/* Split baseline content */}
      <div className="hero-content">
        <h1 className="hero-wordmark rise d2">
          Gannoe<br />Media
        </h1>
        <div className="hero-right rise d3">
          <p className="hero-role">Film &middot; Video &middot; Photography</p>
          <div className="hero-divider" />
          <p className="hero-lead">
            Sports films, highlight edits and brand work — built to make the moment hit harder.
          </p>
          <div className="hero-cta">
            <Link href="/work" className="hero-btn">
              My Work <span className="ar">&rarr;</span>
            </Link>
          </div>
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

      // Draw image in the left third at half viewport size
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const scale = Math.min(vw / imgW, vh / imgH) * 0.5 * dpr;
      const dw = imgW * scale;
      const dh = imgH * scale;
      const dx = (cw / 3 - dw) / 2;
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

      </div>
    </div>
  );
}


export default function Home() {
  return (
    <>
      <HeroSection />
      <CameraScrollSection />
      <div className="bg-background">
        <GetInTouch />
      </div>
    </>
  );
}
