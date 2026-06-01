"use client";

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  ariaLabel: string;
}

interface NavCardItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavLink[];
}

const navItems: NavCardItem[] = [
  {
    label: "Work",
    bgColor: "#1B1722",
    textColor: "#fff",
    links: [
      { label: "All Projects", href: "/work", ariaLabel: "View all projects" },
      { label: "Highlight Reels", href: "/work?filter=highlight-reels", ariaLabel: "Highlight reels" },
      { label: "Commercial", href: "/work?filter=commercial", ariaLabel: "Commercial work" },
    ],
  },
  {
    label: "About",
    bgColor: "#2F293A",
    textColor: "#fff",
    links: [
      { label: "About Henry", href: "/about", ariaLabel: "About Henry Gannoe" },
      { label: "Services", href: "/services", ariaLabel: "View services" },
      { label: "Testimonials", href: "/testimonials", ariaLabel: "Client testimonials" },
    ],
  },
  {
    label: "Connect",
    bgColor: "#2F293A",
    textColor: "#fff",
    links: [
      { label: "Contact", href: "/contact", ariaLabel: "Get in touch" },
      { label: "Instagram", href: "https://www.instagram.com/gannoemedia/", ariaLabel: "Instagram" },
      { label: "TikTok", href: "https://www.tiktok.com/@henrygannoe", ariaLabel: "TikTok" },
    ],
  },
];

const EASE = "power3.out";
const NAV_HEIGHT = 60;
const EXPANDED_HEIGHT = 280;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hoverIntentRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 50);
      if (currentY > lastScrollY.current && currentY > 100) {
        setVisible(false);
        // Close menu when hiding navbar
        if (isExpanded) closeMenu();
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  // Close menu on route change
  useEffect(() => {
    if (isExpanded) closeMenu();
  }, [pathname]);

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return EXPANDED_HEIGHT;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement | null;
      if (contentEl) {
        const saved = {
          visibility: contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position: contentEl.style.position,
          height: contentEl.style.height,
        };

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";
        contentEl.offsetHeight; // force reflow

        const h = NAV_HEIGHT + contentEl.scrollHeight + 16;

        contentEl.style.visibility = saved.visibility;
        contentEl.style.pointerEvents = saved.pointerEvents;
        contentEl.style.position = saved.position;
        contentEl.style.height = saved.height;

        return h;
      }
    }
    return EXPANDED_HEIGHT;
  }, []);

  const createTimeline = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return null;

    const cards = cardsRef.current.filter(Boolean);
    gsap.set(navEl, { height: NAV_HEIGHT, overflow: "hidden" });
    gsap.set(cards, { y: 40, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.35, ease: EASE });
    tl.to(cards, { y: 0, opacity: 1, duration: 0.35, ease: EASE, stagger: 0.06 }, "-=0.1");

    return tl;
  }, [calculateHeight]);

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [createTimeline]);

  // Rebuild timeline on resize
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      if (isExpanded) {
        gsap.set(navRef.current, { height: calculateHeight() });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded, calculateHeight, createTimeline]);

  const openMenu = () => {
    const tl = tlRef.current;
    if (!tl || isExpanded) return;
    setIsOpen(true);
    setIsExpanded(true);
    tl.play(0);
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    setIsOpen(false);
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
    tl.reverse();
  };

  const toggleMenu = () => {
    if (isExpanded) closeMenu();
    else openMenu();
  };

  // Hover intent — open on hover with small delay, close on leave
  const handleMouseEnter = () => {
    if (hoverIntentRef.current) clearTimeout(hoverIntentRef.current);
    hoverIntentRef.current = setTimeout(() => {
      openMenu();
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverIntentRef.current) clearTimeout(hoverIntentRef.current);
    hoverIntentRef.current = setTimeout(() => {
      closeMenu();
    }, 300);
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[i] = el;
  };

  const isExternal = (href: string) => href.startsWith("http");

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-[calc(100%+2rem)]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav
        ref={navRef}
        className={`w-full max-w-[800px] rounded-xl border border-white/10 shadow-lg shadow-black/20 relative overflow-hidden will-change-[height] ${
          isExpanded ? "card-nav-open" : ""
        }`}
        style={{
          backgroundColor: atTop && !isExpanded ? "rgba(10, 10, 11, 0.6)" : "rgba(10, 10, 11, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          height: NAV_HEIGHT,
        }}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 md:px-5 z-10" style={{ height: NAV_HEIGHT }}>
          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="flex flex-col items-center justify-center gap-[6px] h-full cursor-pointer group"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-[26px] h-[2px] bg-white/70 group-hover:bg-white transition-transform duration-250 origin-center ${
                isOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-[26px] h-[2px] bg-white/70 group-hover:bg-white transition-transform duration-250 origin-center ${
                isOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            GANNOE
          </Link>

          {/* Spacer to keep logo centered */}
          <div className="w-[26px]" />
        </div>

        {/* Card content */}
        <div
          className={`absolute left-0 right-0 p-2 flex gap-3 z-[1] ${
            isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"
          } max-md:flex-col max-md:items-stretch`}
          style={{ top: NAV_HEIGHT }}
          aria-hidden={!isExpanded}
        >
          {navItems.map((item, idx) => (
            <div
              key={item.label}
              ref={setCardRef(idx)}
              className="flex-1 min-w-0 rounded-lg flex flex-col p-3 md:p-4 gap-2 max-md:min-h-[60px]"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <span className="font-normal text-lg md:text-xl tracking-tight opacity-60">
                {item.label}
              </span>
              <div className="mt-auto flex flex-col gap-0.5">
                {item.links.map((lnk) =>
                  isExternal(lnk.href) ? (
                    <a
                      key={lnk.label}
                      href={lnk.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={lnk.ariaLabel}
                      className="text-sm md:text-[15px] inline-flex items-center gap-1.5 text-white/90 hover:text-white/60 transition-colors"
                    >
                      <ArrowUpRight size={14} className="shrink-0" />
                      {lnk.label}
                    </a>
                  ) : (
                    <Link
                      key={lnk.label}
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                      className="text-sm md:text-[15px] inline-flex items-center gap-1.5 text-white/90 hover:text-white/60 transition-colors"
                    >
                      <ArrowUpRight size={14} className="shrink-0" />
                      {lnk.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
