"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  brand: string;
  name: string;
  imageUrl: string;
  videoUrl: string;
  themeColor: string;
  className?: string;
};

export function ProductCard({
  brand,
  name,
  imageUrl,
  videoUrl,
  themeColor,
  className,
}: ProductCardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive && !reducedMotion) {
      v.play().catch(() => { });
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive, reducedMotion]);

  React.useEffect(() => {
    if (reducedMotion) return;
    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarse) return;
    const node = rootRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsActive(entry.isIntersecting);
        }
      },
      { threshold: 0.6 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setIsActive(true);
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setIsActive(false);
  };

  return (
    <div
      ref={rootRef}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{ "--theme-color": themeColor } as React.CSSProperties}
      className={cn("group h-full w-full", className)}
    >
      <div
        className={cn(
          "relative block h-full w-full overflow-hidden rounded-2xl",
          "shadow-[0_0_40px_-15px_hsl(var(--theme-color)/0.5)]",
          "transition-all duration-500 ease-out",
          "group-hover:scale-[1.03]",
          "group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.65)]",
        )}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            isActive ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--theme-color) / 0.75), hsl(var(--theme-color) / 0.1) 35%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
            {brand}
          </span>
          <h3 className="font-heading mt-2 text-2xl md:text-3xl font-bold tracking-tight">
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
}
