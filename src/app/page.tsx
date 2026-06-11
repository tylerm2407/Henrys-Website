"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GetInTouch from "@/components/GetInTouch";
import "@/components/Hero.css";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 73;
const SCROLL_HEIGHT = 350; // vh units

const GALLERY_VIDEOS = [
  "/videos/gallery-1.mp4",
  "/videos/gallery-2.mp4",
  "/videos/gallery-3.mp4",
];

const WORK_STRIP = [
  { src: "/images/work-1.jpg", label: "Game Day \u00b7 01" },
  { src: "/images/work-2.jpg", label: "Highlight \u00b7 02" },
  { src: "/images/work-3.jpg", label: "Brand \u00b7 03" },
  { src: "/images/work-4.jpg", label: "Recruit \u00b7 04" },
];

function HeroSection() {
  const tcRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frames = 0;
    const interval = setInterval(() => {
      frames = (frames + 1) % (24 * 60 * 60 * 24);
      const f = frames % 24;
      const s = Math.floor(frames / 24) % 60;
      const m = Math.floor(frames / 1440) % 60;
      const h = Math.floor(frames / 86400);
      const p = (n: number) => String(n).padStart(2, "0");
      if (tcRef.current) {
        tcRef.current.textContent = `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
      }
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

  const stripItems = [...WORK_STRIP, ...WORK_STRIP];

  return (
    <section className="hero">
      <div className="auraline" />
      <div className="grain" />

      {/* Film HUD strip */}
      <div className="hud-strip">
        <div className="hud-group">
          <span className="led" />
          REC&nbsp;&nbsp;<span ref={tcRef}>00:00:00:00</span>
        </div>
        <div className="hud-group">
          <span className="readout-text">4K &middot; 24FPS</span>
          <div className="bars">
            <i /><i /><i /><i /><i />
          </div>
        </div>
      </div>

      {/* Scrolling marquee wordmark */}
      <div className="marquee rise d1">
        <div className="mtrack">
          <span>Gannoe Media</span>
          <span className="fill">Gannoe Media</span>
          <span>Gannoe Media</span>
          <span className="fill">Gannoe Media</span>
        </div>
      </div>

      <div className="meta rise d2">
        <p className="role">Film &middot; Video &middot; Photography</p>
        <div className="cta">
          <Link href="/gallery" className="btn solid">
            My Work <span className="ar">&rarr;</span>
          </Link>
          <a href="#showreel" className="btn ghost">
            &#9655; Showreel
          </a>
        </div>
      </div>

      {/* Film strip of work */}
      <div className="strip rise d3">
        <div className="french">
          {stripItems.map((item, i) => (
            <div key={i} className="cell">
              <img src={item.src} alt="" />
              <em>{item.label}</em>
            </div>
          ))}
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
  const fadeOutRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  // Camera frame loading + drawing
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

      const dpr = window.devicePixelRatio || 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = Math.round(vw * dpr);
      const ch = Math.round(vh * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      ctx.clearRect(0, 0, cw, ch);

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

      const fadeOverlay = fadeOutRef.current;
      if (fadeOverlay) {
        const fadeStart = 0.85;
        const fadeProg = Math.max(0, Math.min(1, (progress - fadeStart) / (1 - fadeStart)));
        fadeOverlay.style.opacity = String(fadeProg * 0.7);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stacking card scale-down animation (CodyHouse pattern)
  useGSAP(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const cards = stack.querySelectorAll<HTMLElement>('.stack-card');
    cards.forEach((card, i) => {
      if (i === 0) return;

      const prevCards = Array.from(cards).slice(0, i);

      ScrollTrigger.create({
        trigger: card,
        start: 'top 55%',
        end: 'top 20%',
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          prevCards.forEach((prev, pi) => {
            const depth = i - pi;
            const s = 1 - (p * 0.05 * depth);
            const b = 1 - (p * 0.3 * depth);
            prev.style.transform = `scale(${Math.max(s, 0.85)})`;
            prev.style.filter = `brightness(${Math.max(b, 0.3)})`;
          });
        },
      });
    });
  }, { scope: stackRef });

  // Tight spacing so all 3 cards stack within the camera scroll duration
  const cardSpacing = '20vh';

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${SCROLL_HEIGHT}vh` }}
    >
      {/* Sticky background: camera canvas + wander pods + fade overlay */}
      <div
        className="sticky top-0 w-full overflow-hidden bg-black"
        style={{ height: '100vh', zIndex: 1 }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        <div
          ref={fadeOutRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: '#000', opacity: 0, willChange: 'opacity' }}
        />
      </div>

      {/*
        Stacking cards column — positioned absolutely within the 350vh container.
        - The cards use position:sticky so they stack as you scroll.
        - They are children of the 350vh container, so once the container
          scrolls past the viewport, the cards scroll away with it.
        - marginTop pulls them up to overlap the sticky camera background.
        - paddingTop delays card #1 so nothing appears during the hero.
      */}
      <div
        ref={stackRef}
        className="gallery-cards-column"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '55%',
          zIndex: 6,
          paddingTop: '60vh',
          paddingBottom: '80vh',
          paddingRight: '5%',
          paddingLeft: '3%',
          overflow: 'visible',
        }}
      >
        {GALLERY_VIDEOS.map((src, i) => (
          <div
            key={src}
            className="stack-card"
            style={{
              position: 'sticky',
              top: `calc(20vh + ${i * 6}px)`,
              marginBottom: i < GALLERY_VIDEOS.length - 1 ? cardSpacing : 0,
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '16 / 9',
              boxShadow: '0 0 24px rgba(30, 64, 124, 0.3), 0 0 60px rgba(30, 64, 124, 0.1)',
              border: '1px solid rgba(79, 127, 216, 0.2)',
              willChange: 'transform, filter',
              transformOrigin: 'center top',
              zIndex: i + 1,
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            >
              <source src={src} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  return (
    <>
      <HeroSection />
      <CameraScrollSection />

      {/* View Full Gallery CTA */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          padding: '40px 24px 24px',
          background: '#000',
        }}
      >
        <Link
          href="/gallery"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            padding: '16px 32px',
            borderRadius: 12,
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            backdropFilter: 'blur(6px)',
            textDecoration: 'none',
            transition: 'transform 0.18s, box-shadow 0.22s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.transform = 'translateY(-2px)';
            el.style.borderColor = '#244a8c';
            el.style.boxShadow = '0 10px 32px rgba(70, 123, 232, 0.7)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = 'translateY(0)';
            el.style.borderColor = 'rgba(255, 255, 255, 0.14)';
            el.style.boxShadow = 'none';
          }}
        >
          View Full Gallery <span style={{ transition: 'transform 0.2s', display: 'inline-block' }}>&rarr;</span>
        </Link>
      </div>

      <GetInTouch />
    </>
  );
}
