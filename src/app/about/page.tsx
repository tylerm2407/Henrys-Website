import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">About</h1>
      </section>

      <section className="pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              alt="Henry Gannoe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">Henry Gannoe</h2>
            <p className="text-text-muted text-lg leading-relaxed mb-5">
              I&apos;m Henry — a filmmaker, editor, and visual storyteller from East Lyme, Connecticut.
              I started Gannoe Media because I believe every story deserves to be told with intention.
            </p>
            <p className="text-text-muted leading-relaxed mb-5">
              Currently a junior at Penn State University studying Film Production. Outside the classroom,
              I work as a Media Production Intern at ROAR+ / Playfly Sports.
            </p>
            <p className="text-text-muted leading-relaxed">
              Whether shooting an athlete mid-stride, walking a golf course at golden hour, or capturing
              portraits in natural light — I bring obsessive attention to detail and a cinematic eye
              to every project.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-background rounded-lg border border-white/5">
            <p className="text-accent text-xs uppercase tracking-widest mb-2">Education</p>
            <h3 className="text-2xl font-bold text-foreground mb-2">Penn State University</h3>
            <p className="text-text-muted leading-relaxed">
              Film Production Major — Junior Year. Cinematography, editing, and visual storytelling.
            </p>
          </div>
          <div className="p-8 bg-background rounded-lg border border-white/5">
            <p className="text-accent text-xs uppercase tracking-widest mb-2">Experience</p>
            <h3 className="text-2xl font-bold text-foreground mb-2">ROAR+ / Playfly Sports</h3>
            <p className="text-text-muted leading-relaxed">
              Media Production Intern — video and photo content for sports marketing campaigns.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Want to Work Together?</h2>
          <Link href="/contact" className="px-10 py-4 bg-accent text-white text-sm font-medium uppercase tracking-widest hover:bg-accent-hover transition-colors">
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
