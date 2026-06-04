"use client";

const certifications = [
  { src: "/certifications/iso-22000.avif", alt: "ISO 22000" },
  { src: "/certifications/halal.avif",     alt: "Halal" },
  { src: "/certifications/fda.png",        alt: "FDA" },
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
          {Array.from({ length: 8 }).flatMap((_, copy) =>
            certifications.map((cert, j) => {
              const i = copy * certifications.length + j;
              const isFirstSet = copy < 4;
              return (
                <div
                  key={`${cert.alt}-${i}`}
                  className="flex shrink-0 items-center justify-center px-4"
                  aria-hidden={isFirstSet ? undefined : "true"}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.src}
                    alt={isFirstSet ? cert.alt : ""}
                    className="h-16 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-20"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
