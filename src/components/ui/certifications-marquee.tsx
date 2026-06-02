"use client";

const certifications = [
  { src: "/certifications/iso-22000.avif", alt: "ISO 22000" },
  { src: "/certifications/halal.avif",     alt: "Halal" },
  { src: "/certifications/fda.png",        alt: "FDA" },
  { src: "/certifications/gmp.png",        alt: "GMP" },
  { src: "/certifications/brc.png",        alt: "BRC" },
  { src: "/certifications/iso-45001.avif", alt: "ISO 45001" },
] as const;

interface CertificationsMarqueeProps {
  heading: string;
}

export default function CertificationsMarquee({ heading }: CertificationsMarqueeProps) {
  return (
    <div>
      <h3
        id="cert-marquee-heading"
        className="mb-6 text-center font-heading text-sm font-medium uppercase tracking-wider text-foreground/60"
      >
        {heading}
      </h3>

      <div
        aria-labelledby="cert-marquee-heading"
        role="region"
        className="group relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-marquee flex w-max gap-16">
          {[...certifications, ...certifications].map((cert, i) => (
            <div
              key={`${cert.alt}-${i}`}
              className="flex shrink-0 items-center justify-center px-4"
              aria-hidden={i >= certifications.length ? "true" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.src}
                alt={i >= certifications.length ? "" : cert.alt}
                className="h-12 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
