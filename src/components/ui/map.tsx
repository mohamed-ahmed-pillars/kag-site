"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

type LatLng = { lat: number; lng: number; label?: string };
type Region = { lat: { min: number; max: number }; lng: { min: number; max: number } };

interface MapProps {
  dots?: Array<{ start: LatLng; end: LatLng }>;
  lineColor?: string;
  dotColor?: string;
  secondaryColor?: string;
  showLabels?: boolean;
  animationDuration?: number;
  loop?: boolean;
  region?: Region;
}

export function WorldMap({
  dots = [],
  lineColor = "#374c9b",
  dotColor = "#374c9b66",
  secondaryColor = "#d5de24",
  showLabels = true,
  animationDuration = 2,
  loop = true,
  region,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const map = useMemo(
    () =>
      new DottedMap({
        height: 100,
        grid: "diagonal",
        ...(region ? { region } : {}),
      }),
    [region],
  );

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: dotColor,
        shape: "circle",
        backgroundColor: "transparent",
      }),
    [map, dotColor],
  );

  // dotted-map uses a Mercator projection with a cropped region, so we use
  // map.getPin() (which returns coords in the SVG's own width×height space).
  // The next/image renders that SVG with object-contain inside our overlay's
  // 800×400 viewBox, so we replicate object-contain math here: fit the image
  // to the overlay while preserving its aspect ratio, then offset.
  const VB_W = 800;
  const VB_H = 400;
  const { width: imgW, height: imgH } = map.image;
  const imgAspect = imgW / imgH;
  const vbAspect = VB_W / VB_H;
  let renderedW: number;
  let renderedH: number;
  if (imgAspect >= vbAspect) {
    renderedW = VB_W;
    renderedH = VB_W / imgAspect;
  } else {
    renderedH = VB_H;
    renderedW = VB_H * imgAspect;
  }
  const offsetX = (VB_W - renderedW) / 2;
  const offsetY = (VB_H - renderedH) / 2;

  const projectPoint = (lat: number, lng: number) => {
    const pin = map.getPin({ lat, lng });
    if (!pin) return { x: 0, y: 0 };
    return {
      x: offsetX + (pin.x / imgW) * renderedW,
      y: offsetY + (pin.y / imgH) * renderedH,
    };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    // Bow proportional to chord length, capped, so short arcs to Paris/Berlin
    // don't visually detour over London/Rotterdam.
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const chord = Math.hypot(dx, dy);
    const bow = Math.min(chord * 0.18, 28);
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - bow;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  // Deduplicate the points list — the origin (Cairo) is shared across every
  // arc, so without this we'd render its dot, pulse, and label N times stacked.
  // The first dot's start is treated as the origin; it renders last (on top)
  // and gets a larger, primary-colored marker.
  const uniquePoints = useMemo(() => {
    type P = { x: number; y: number; label?: string; isOrigin: boolean };
    const seen = new Map<string, P>();
    const originKey =
      dots.length > 0
        ? `${dots[0].start.lat.toFixed(4)},${dots[0].start.lng.toFixed(4)}`
        : null;
    for (const d of dots) {
      for (const ll of [d.start, d.end]) {
        const key = `${ll.lat.toFixed(4)},${ll.lng.toFixed(4)}`;
        if (!seen.has(key)) {
          const { x, y } = projectPoint(ll.lat, ll.lng);
          seen.set(key, { x, y, label: ll.label, isOrigin: key === originKey });
        }
      }
    }
    return Array.from(seen.values()).sort(
      (a, b) => Number(a.isOrigin) - Number(b.isOrigin),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dots, map]);

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-card/40 font-sans md:aspect-[2.5/1] lg:aspect-[2/1]">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none object-contain [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt="world map"
        height={495}
        width={1056}
        draggable={false}
        unoptimized
        priority
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-auto absolute inset-0 h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime =
            (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />

              {loop && (
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{
                    offsetPath: `path('${createCurvedPath(startPoint, endPoint)}')`,
                  }}
                />
              )}
            </g>
          );
        })}

        {(() => {
          const origin = uniquePoints.find((u) => u.isOrigin);
          return uniquePoints.map((p, i) => {
          // Place each destination's label in the direction away from Cairo
          // so clusters fan out instead of stacking on top of each other.
          // Cairo's own label drops directly below its (larger) dot.
          const LABEL_W = 80;
          const LABEL_H = 22;
          const RADIAL_OFFSET = 28;
          let labelX: number;
          let labelY: number;
          if (p.isOrigin || !origin) {
            labelX = p.x - LABEL_W / 2;
            labelY = p.y + 14;
          } else {
            const dx = p.x - origin.x;
            const dy = p.y - origin.y;
            const dist = Math.hypot(dx, dy) || 1;
            const cx = p.x + (dx / dist) * RADIAL_OFFSET;
            const cy = p.y + (dy / dist) * RADIAL_OFFSET;
            labelX = cx - LABEL_W / 2;
            labelY = cy - LABEL_H / 2;
            // If the radial position would clip the top edge (e.g. Berlin
            // near the map's lat max), drop the label below the dot instead.
            if (labelY < 4) {
              labelX = p.x - LABEL_W / 2;
              labelY = p.y + 10;
            }
          }
          const fill = p.isOrigin ? lineColor : secondaryColor;
          const baseR = p.isOrigin ? 6 : 3;
          const pulseR = p.isOrigin ? 18 : 12;
          return (
            <g key={`point-${i}`}>
              <motion.g
                onHoverStart={() => setHoveredLocation(p.label || `Location ${i}`)}
                onHoverEnd={() => setHoveredLocation(null)}
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={baseR}
                  fill={fill}
                  filter="url(#glow)"
                  className="drop-shadow-lg"
                />
                {p.isOrigin && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={baseR - 2}
                    fill="white"
                    opacity="0.85"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={baseR}
                  fill={fill}
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from={baseR}
                    to={pulseR}
                    dur="2s"
                    begin={`${(i % 4) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="2s"
                    begin={`${(i % 4) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </motion.g>

              {showLabels && p.label && (
                <motion.g
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * i + 0.3, duration: 0.5 }}
                  className="pointer-events-none"
                >
                  <foreignObject
                    x={labelX}
                    y={labelY}
                    width={LABEL_W}
                    height={LABEL_H}
                    className="block overflow-visible"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className={
                          p.isOrigin
                            ? "whitespace-nowrap rounded border border-primary/40 bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground shadow-md"
                            : "whitespace-nowrap rounded border border-primary/20 bg-card/95 px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm"
                        }
                      >
                        {p.label}
                      </span>
                    </div>
                  </foreignObject>
                </motion.g>
              )}
            </g>
          );
        });
        })()}
      </svg>

      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 rounded-lg border border-primary/15 bg-card/95 px-3 py-2 text-sm font-medium text-foreground backdrop-blur-sm sm:hidden"
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
