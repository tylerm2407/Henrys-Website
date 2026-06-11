"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  src: string;
  thumbnail?: string;
  category: string;
  aspectRatio: "16:9" | "4:3" | "3:2" | "9:16" | "1:1";
  projectId?: string;
  projectName?: string;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: GalleryLightboxProps) {
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    if (items.length > 1) {
      onNavigate((currentIndex + 1) % items.length);
    }
  }, [currentIndex, items.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (items.length > 1) {
      onNavigate((currentIndex - 1 + items.length) % items.length);
    }
  }, [currentIndex, items.length, onNavigate]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, goNext, goPrev]);

  // Touch swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(delta) > 50) {
        if (delta < 0) goNext();
        else goPrev();
      }
      touchStartX.current = null;
    },
    [goNext, goPrev]
  );

  const item = items[currentIndex];
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          {/* Navigation arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10 cursor-pointer"
                aria-label="Previous item"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10 cursor-pointer"
                aria-label="Next item"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          {/* Media container */}
          <motion.div
            key={item.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl px-4 md:px-12 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo */}
            {item.type === "photo" && (
              <img
                src={item.src}
                alt={item.projectName || item.category}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg select-none"
                draggable={false}
              />
            )}

            {/* Video */}
            {item.type === "video" && (
              <video
                key={item.src}
                src={item.src}
                controls
                autoPlay
                poster={item.thumbnail}
                className="max-h-[75vh] w-auto max-w-full rounded-lg bg-black"
              />
            )}

            {/* Metadata bar */}
            <div className="mt-4 flex items-center justify-between w-full max-w-4xl px-2">
              <div className="flex items-center gap-3">
                <span className="text-[#1E407C] text-xs font-[family-name:var(--font-heading)] uppercase tracking-widest">
                  {item.category}
                </span>
                {item.projectName && (
                  <span className="text-white/40 text-xs">
                    From:{" "}
                    {item.projectId ? (
                      <Link
                        href={`/work/${item.projectId}`}
                        className="text-white/50 hover:text-white/80 transition-colors underline underline-offset-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.projectName}
                      </Link>
                    ) : (
                      <span className="text-white/50">{item.projectName}</span>
                    )}
                  </span>
                )}
              </div>

              {/* Counter */}
              {items.length > 1 && (
                <span className="text-white/30 text-xs">
                  {currentIndex + 1} / {items.length}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
