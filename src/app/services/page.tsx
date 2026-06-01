import Link from "next/link";
import { services } from "@/lib/data";

export default function ServicesPage() {
  return (
    <>
      <section className="pt-36 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">Services</h1>
      </section>

      <section className="pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="p-8 bg-surface rounded-lg border border-white/5">
              <h2 className="text-xl font-bold text-foreground mb-3">{service.title}</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-6">{service.description}</p>
              <Link
                href={`/contact?service=${encodeURIComponent(service.formValue)}`}
                className="text-accent text-sm uppercase tracking-wide hover:text-accent-hover transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Don&apos;t see what you need?</h2>
          <Link href="/contact?service=Custom+Request" className="px-10 py-4 bg-accent text-white text-sm font-medium uppercase tracking-widest hover:bg-accent-hover transition-colors">
            Let&apos;s Talk
          </Link>
        </div>
      </section>
    </>
  );
}
