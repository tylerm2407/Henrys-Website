"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import "./gallery.css";

/* ─── Media Data ─── */

interface MediaItem {
  id: string;
  type: "video" | "image";
  cat: string;
  title: string;
  thumb: string;
  src: string;
}

const MEDIA: MediaItem[] = [
  { id: "v1", type: "video", cat: "Highlights", title: "State Final — Game Day Reel", thumb: "https://picsum.photos/seed/gm-football/900/560", src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  { id: "i1", type: "image", cat: "Portraits", title: "Senior Portrait — №7", thumb: "https://picsum.photos/seed/gm-port1/900/560", src: "https://picsum.photos/seed/gm-port1/1800/1120" },
  { id: "v2", type: "video", cat: "Commercial", title: "Main Street Coffee — :30 Spot", thumb: "https://picsum.photos/seed/gm-coffee/900/560", src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "i2", type: "image", cat: "Highlights", title: "Friday Lights — Sideline", thumb: "https://picsum.photos/seed/gm-side/900/560", src: "https://picsum.photos/seed/gm-side/1800/1120" },
  { id: "v3", type: "video", cat: "Recruiting", title: "QB1 — Recruiting Tape", thumb: "https://picsum.photos/seed/gm-qb/900/560", src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
  { id: "i3", type: "image", cat: "Portraits", title: "Team Captains — Studio", thumb: "https://picsum.photos/seed/gm-cap/900/560", src: "https://picsum.photos/seed/gm-cap/1800/1120" },
  { id: "v4", type: "video", cat: "Events", title: "Rivalry Night — Aftermovie", thumb: "https://picsum.photos/seed/gm-night/900/560", src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  { id: "i4", type: "image", cat: "Commercial", title: "Gym Launch — Key Visual", thumb: "https://picsum.photos/seed/gm-gym/900/560", src: "https://picsum.photos/seed/gm-gym/1800/1120" },
  { id: "i5", type: "image", cat: "Highlights", title: "Hoops — Buzzer Beater", thumb: "https://picsum.photos/seed/gm-hoops/900/560", src: "https://picsum.photos/seed/gm-hoops/1800/1120" },
  { id: "i6", type: "image", cat: "Portraits", title: "Coach K — Editorial", thumb: "https://picsum.photos/seed/gm-coach/900/560", src: "https://picsum.photos/seed/gm-coach/1800/1120" },
  { id: "v5", type: "video", cat: "Commercial", title: "Auto Detail Co. — Brand Film", thumb: "https://picsum.photos/seed/gm-auto/900/560", src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
  { id: "i7", type: "image", cat: "Events", title: "Homecoming — Crowd", thumb: "https://picsum.photos/seed/gm-crowd/900/560", src: "https://picsum.photos/seed/gm-crowd/1800/1120" },
  { id: "i8", type: "image", cat: "Recruiting", title: "Combine Day — 40 Time", thumb: "https://picsum.photos/seed/gm-combine/900/560", src: "https://picsum.photos/seed/gm-combine/1800/1120" },
  { id: "i9", type: "image", cat: "Highlights", title: "Lacrosse — Spring Reel Still", thumb: "https://picsum.photos/seed/gm-lax/900/560", src: "https://picsum.photos/seed/gm-lax/1800/1120" },
  { id: "i10", type: "image", cat: "Portraits", title: "Senior Banners — Class of 26", thumb: "https://picsum.photos/seed/gm-banner/900/560", src: "https://picsum.photos/seed/gm-banner/1800/1120" },
  { id: "i11", type: "image", cat: "Events", title: "Signing Day — Ceremony", thumb: "https://picsum.photos/seed/gm-sign/900/560", src: "https://picsum.photos/seed/gm-sign/1800/1120" },
];

const FILTERS = ["All", "Highlights", "Portraits", "Commercial", "Recruiting", "Events"];
const GRID_SPANS = [2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1];

/* ─── Lightbox ─── */

function Lightbox({ item, onClose }: { item: MediaItem | null; onClose: () => void }) {
  const lbRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item || !lbRef.current || !cardRef.current) return;
    gsap.fromTo(lbRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { scale: 0.86, y: 30 }, { scale: 1, y: 0, duration: 0.55, ease: "power3.out" });
  }, [item]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && item) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div ref={lbRef} className="gal-lb open" onClick={(e) => { if (e.target === lbRef.current) onClose(); }}>
      <button className="gal-lb-close" onClick={onClose} aria-label="Close">✕</button>
      <div ref={cardRef} className="gal-lb-card">
        <div className="gal-lb-media">
          {item.type === "video" ? (
            <video src={item.src} controls autoPlay playsInline poster={item.thumb} />
          ) : (
            <img src={item.src} alt={item.title} />
          )}
        </div>
        <div className="gal-lb-foot">
          <h3>{item.title}</h3>
          <span>{item.cat} &middot; {item.type === "video" ? "Film" : "Still"}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Page (Depth Grid) ─── */

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [lbItem, setLbItem] = useState<MediaItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const openLb = useCallback((item: MediaItem) => setLbItem(item), []);
  const closeLb = useCallback(() => setLbItem(null), []);

  // mouse parallax
  useEffect(() => {
    const sec = sectionRef.current;
    const grid = gridRef.current;
    if (!sec || !grid) return;

    const onMove = (e: MouseEvent) => {
      const r = sec.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      grid.querySelectorAll<HTMLElement>(".g4-card").forEach((c) => {
        const d = +(c.dataset.depth || 1);
        gsap.to(c, { x: -nx * d * 9, y: -ny * d * 9, duration: 0.6, ease: "power2.out" });
      });
    };

    sec.addEventListener("mousemove", onMove);
    return () => sec.removeEventListener("mousemove", onMove);
  }, []);

  // filter animation
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.querySelectorAll<HTMLElement>(".g4-card").forEach((c) => {
      const show = filter === "All" || c.dataset.cat === filter;
      gsap.to(c, { opacity: show ? 1 : 0.12, scale: show ? 1 : 0.94, duration: 0.45, ease: "power2.out" });
      c.style.pointerEvents = show ? "" : "none";
    });
  }, [filter]);

  return (
    <>
      <div ref={sectionRef} className="gal-page">
        <div className="gal-head">
          <h2>The Wall</h2>
          <p>Full archive &middot; filter by type</p>
        </div>
        <div className="g4-scroll">
          <div className="g4-filters">
            {FILTERS.map((f) => (
              <button key={f} className={`g4-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div ref={gridRef} className="g4-grid">
            {MEDIA.map((it, i) => (
              <div
                key={it.id}
                className="g4-card"
                data-cat={it.cat}
                data-depth={(i % 3) + 1}
                style={{ gridRow: `span ${GRID_SPANS[i % GRID_SPANS.length]}` }}
                onClick={() => openLb(it)}
              >
                <img src={it.thumb} alt="" />
                {it.type === "video" && <span className="gal-play-badge">&#9654;</span>}
                <div className="card-meta"><b>{it.title}</b><span>{it.cat}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Lightbox item={lbItem} onClose={closeLb} />
    </>
  );
}
