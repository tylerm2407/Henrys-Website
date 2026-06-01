"use client";

import Link from "next/link";
import { navLinks, socialLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Link href="/" className="text-xl font-bold tracking-widest text-foreground">
            GANNOE MEDIA
          </Link>

          <div className="flex flex-wrap gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-text-muted hover:text-foreground transition-colors uppercase tracking-wide">
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="text-xs text-text-muted hover:text-foreground transition-colors uppercase tracking-wide">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors text-sm">
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-text-muted/50">
            &copy; {new Date().getFullYear()} Gannoe Media. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
