"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface VideoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  videos?: string[];
  title?: string;
}

export default function VideoLightbox({ isOpen, onClose, videoUrl, videos, title }: VideoLightboxProps) {
  const allVideos = videos?.length ? videos : videoUrl ? [videoUrl] : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allVideos.length);
  }, [allVideos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allVideos.length) % allVideos.length);
  }, [allVideos.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [isOpen]);

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (allVideos.length > 1) {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, allVideos.length, goNext, goPrev]);

  const currentUrl = allVideos[currentIndex];
  const isLocalVideo = currentUrl?.startsWith("/");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          {/* Previous / Next arrows */}
          {allVideos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
                aria-label="Previous video"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
                aria-label="Next video"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {currentUrl ? (
              isLocalVideo ? (
                <video
                  key={currentIndex}
                  src={currentUrl}
                  controls
                  autoPlay
                  poster={currentUrl.replace("/videos/", "/images/posters/").replace(".mp4", ".jpg")}
                  className="w-full h-full rounded-lg bg-black"
                />
              ) : (
                <iframe
                  src={currentUrl}
                  title={title || "Video"}
                  className="w-full h-full rounded-lg"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              <div className="w-full h-full rounded-lg bg-surface-light flex items-center justify-center">
                <p className="text-text-muted text-lg font-[family-name:var(--font-heading)] uppercase tracking-wider">
                  Video Coming Soon
                </p>
              </div>
            )}
          </motion.div>

          <div className="absolute bottom-8 flex flex-col items-center gap-2">
            {title && (
              <p className="text-white/50 text-sm font-[family-name:var(--font-heading)] uppercase tracking-wider">
                {title}
              </p>
            )}
            {allVideos.length > 1 && (
              <p className="text-white/30 text-xs">
                {currentIndex + 1} / {allVideos.length}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
