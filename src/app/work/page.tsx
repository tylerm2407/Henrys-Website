"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import VideoLightbox from "@/components/VideoLightbox";
import BorderGlow from "@/components/BorderGlow";
import { projects, categories } from "@/lib/data";
import type { Project } from "@/lib/data";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  function openProject(project: Project) {
    setActiveProject(project);
    setLightboxOpen(true);
  }

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">Our Work</h1>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-5 py-2 text-sm uppercase tracking-wide transition-colors ${
                activeFilter === cat.value
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <BorderGlow key={project.id} backgroundColor="#0a0a0b">
              <button
                onClick={() => openProject(project)}
                className="group block relative w-full overflow-hidden rounded-lg text-left"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {project.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center">
                        <Play size={24} className="text-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-accent text-xs uppercase tracking-widest mb-1">{project.categoryLabel}</p>
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  </div>
                </div>
              </button>
            </BorderGlow>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-24 text-center text-text-muted text-lg">No projects in this category yet.</p>
        )}
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Like What You See?</h2>
          <p className="text-text-muted text-lg mb-10">
            Every project starts with a conversation.
          </p>
          <Link href="/#contact" className="px-10 py-4 bg-accent text-white text-sm font-medium uppercase tracking-widest hover:bg-accent-hover transition-colors">
            Get In Touch
          </Link>
        </div>
      </section>

      <VideoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        videoUrl={activeProject?.videoUrl}
        videos={activeProject?.videos}
        title={activeProject?.title}
      />
    </>
  );
}
