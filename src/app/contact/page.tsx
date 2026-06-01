"use client";

import { Suspense, useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { socialLinks } from "@/lib/data";

const serviceOptions = [
  "Highlight Reel",
  "Video Edit",
  "Photography / Portraits",
  "Commercial / Business Video",
  "Custom Request",
];

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    socialHandle: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam && serviceOptions.includes(serviceParam)) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const inputClasses =
    "w-full bg-surface border border-white/10 rounded px-4 py-3 text-foreground placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors";

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-foreground mb-3">Thank you!</h3>
        <p className="text-text-muted text-lg">I&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm text-text-muted mb-1.5">Name *</label>
          <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Your name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-text-muted mb-1.5">Email *</label>
          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm text-text-muted mb-1.5">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="socialHandle" className="block text-sm text-text-muted mb-1.5">Social Handle</label>
          <input type="text" id="socialHandle" name="socialHandle" value={formData.socialHandle} onChange={handleChange} placeholder="@username" className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm text-text-muted mb-1.5">Service *</label>
        <select id="service" name="service" required value={formData.service} onChange={handleChange} className={`${inputClasses} ${formData.service === "" ? "text-text-muted/50" : ""}`}>
          <option value="" disabled>Select a service...</option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-text-muted mb-1.5">Message *</label>
        <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." className={`${inputClasses} resize-vertical`} />
      </div>

      <button type="submit" disabled={isSubmitting} className="px-10 py-3.5 bg-accent text-white text-sm font-medium uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-36 pb-12 px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">Contact</h1>
        <p className="mt-4 text-text-muted text-lg max-w-xl">
          Have a project in mind? Fill out the form and I&apos;ll get back to you.
        </p>
      </section>

      <section className="pb-20 px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="p-6 sm:p-10 bg-surface rounded-lg border border-white/5">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </section>

      <section className="pb-24 bg-surface">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">Or find me on social media</h2>
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-background border border-white/10 rounded text-sm text-foreground hover:border-accent/40 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
