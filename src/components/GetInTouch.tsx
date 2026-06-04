"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import "./GetInTouch.css";

const HG_LOGO =
  "data:image/png;base64,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";

export default function GetInTouch() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hasTyped = useRef(false);
  const [formData, setFormData] = useState({ name: "", email: "", project: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el || hasTyped.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hasTyped.current = true;
    const raw = el.getAttribute("data-type") || "";
    el.textContent = "";

    const span = document.createElement("span");
    const cur = document.createElement("span");
    cur.className = "git-cursor";
    el.appendChild(span);
    el.appendChild(cur);

    let i = 0;
    function step() {
      if (i <= raw.length) {
        span.innerHTML = raw.slice(0, i).replace(/\n/g, "<br>");
        i++;
        setTimeout(step, 46 + Math.random() * 46);
      } else {
        setTimeout(() => cur.remove(), 900);
      }
    }
    step();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Form submission:", formData);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="git-section">
      <div className="git-frame">
        {/* Aurora background */}
        <div className="git-aurora">
          <span className="git-blob git-b1" />
          <span className="git-blob git-b2" />
          <span className="git-blob git-b3" />
        </div>

        <div className="git-inner">
          {/* Logo */}
          <div className="git-mono">
            <img src={HG_LOGO} alt="HG — Gannoe Media" />
          </div>

          {/* Kicker */}
          <div className="git-kicker">Get in touch</div>

          {/* Typewriter headline */}
          <h2 className="git-headline" ref={headlineRef} data-type={"Let's tell\nyour story."}>
            Let&apos;s tell<br />your story.
          </h2>

          {/* Lead */}
          <p className="git-lead">
            Sports films, highlight edits, and brand work. Tell me what you&apos;re building and let&apos;s roll.
          </p>

          {isSubmitted ? (
            <div className="git-thank-you">
              <h3>Thank you!</h3>
              <p>I&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form className="git-form" onSubmit={handleSubmit}>
              <div className="git-row2">
                <div className="git-field">
                  <label>Name</label>
                  <input className="git-inp" name="name" placeholder="Your name" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="git-field">
                  <label>Email</label>
                  <input className="git-inp" name="email" type="email" placeholder="you@email.com" required value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="git-field">
                <label>Project</label>
                <textarea className="git-inp" name="project" placeholder="A few lines about what you have in mind..." required value={formData.project} onChange={handleChange} />
              </div>
              <button className="git-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send message"} <span className="git-ar">&rarr;</span>
              </button>
            </form>
          )}

          {/* Socials */}
          <div className="git-socials">
            <a className="git-soc" href="https://www.linkedin.com/in/henry-gannoe-513017252" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4" strokeLinecap="round" /></svg>
            </a>
            <a className="git-soc" href="https://www.instagram.com/gannoemedia/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a className="git-soc" href="https://www.tiktok.com/@henrygannoe" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 8.5v7a3 3 0 1 1-3-3" strokeLinecap="round" /><path d="M9 8.5c.4 2.4 2 4 4.5 4.2V9.6C12 9.3 11 8 11 6h-2" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
