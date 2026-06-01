import Link from "next/link";
import { testimonials } from "@/lib/data";

export default function TestimonialsPage() {
  return (
    <>
      <section className="pt-36 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">Testimonials</h1>
      </section>

      <section className="pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-8 bg-surface rounded-lg border border-white/5">
              <p className="text-foreground text-base leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="text-foreground font-semibold text-sm">{testimonial.clientName}</p>
              <p className="text-text-muted text-xs mt-1">{testimonial.service}</p>
              {testimonial.projectId && (
                <Link href="/work" className="text-accent text-xs uppercase tracking-wide mt-4 inline-block hover:text-accent-hover transition-colors">
                  View Project
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to be our next success story?</h2>
          <Link href="/contact" className="px-10 py-4 bg-accent text-white text-sm font-medium uppercase tracking-widest hover:bg-accent-hover transition-colors">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
