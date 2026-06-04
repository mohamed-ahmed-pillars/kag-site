"use client";

import { useState, useEffect, ReactNode, useMemo, useRef } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type HeadingData = {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
};

const islandTransition: Transition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1],
  duration: 0.5,
};

function CircleProgress({ percentage }: { percentage: number }) {
  const size = 24;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="color-mix(in oklab, var(--primary-foreground) 25%, transparent)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--secondary)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        strokeLinecap="round"
      />
    </svg>
  );
}

type DynamicIslandTOCProps = {
  children?: ReactNode;
  selector?: string;
  expandedLabel?: string;
  closedLabel?: string;
};

export function DynamicIslandTOC({
  children,
  selector = "article h1, article h2, article h3, article h4, .prose h1, .prose h2, .prose h3, .prose h4, [data-toc]",
  expandedLabel = "TABLE OF CONTENTS",
  closedLabel = "Contents",
}: DynamicIslandTOCProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasExpandedRef = useRef(false);

  const scheduleHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  useEffect(() => {
    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

      const validHeadings = elements
        .filter((el) => !el.hasAttribute("data-toc-ignore"))
        .map((el, index) => {
          if (!el.id) {
            const generatedId =
              el.textContent
                ?.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "") || `toc-heading-${index}`;
            el.id = generatedId;
          }

          const depthAttr = el.getAttribute("data-toc-depth");
          let level = 2;

          if (depthAttr) {
            level = parseInt(depthAttr, 10);
          } else {
            const tagName = el.tagName.toUpperCase();
            if (tagName.startsWith("H") && tagName.length === 2) {
              level = parseInt(tagName[1], 10);
            }
          }

          const text = el.getAttribute("data-toc-title") || el.textContent || "Section";

          return { id: el.id, text, level, element: el };
        });

      validHeadings.sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );

      setHeadings(validHeadings);
    };

    const timer = setTimeout(getHeadings, 100);
    return () => clearTimeout(timer);
  }, [selector]);

  useEffect(() => {
    const computeScrollState = () => {
      let currentActiveId: string | null = null;
      for (const heading of headings) {
        const top = heading.element.getBoundingClientRect().top;
        if (top <= 120) {
          currentActiveId = heading.id;
        } else {
          break;
        }
      }

      if (!currentActiveId && headings.length > 0) {
        currentActiveId = headings[0].id;
      }

      setActiveId(currentActiveId);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
    };

    const handleScroll = () => {
      computeScrollState();
      setIsVisible(true);
      scheduleHide();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    computeScrollState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [headings]);

  useEffect(() => {
    if (isExpanded) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    } else if (wasExpandedRef.current) {
      setIsVisible(true);
      scheduleHide();
    }
    wasExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const activeHeading = headings.find((h) => h.id === activeId);

  const minLevel = useMemo(() => {
    if (headings.length === 0) return 1;
    return Math.min(...headings.map((h) => h.level));
  }, [headings]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={islandTransition}
            className="fixed inset-0 z-[9998] bg-primary/20 backdrop-blur-[4px]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isVisible || isExpanded) && (
          <motion.div
            key="toc-island"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-[30px] left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center"
          >
            <motion.div
              onClick={() => {
                if (!isExpanded) setIsExpanded(true);
              }}
              initial={false}
              animate={{
                width: isExpanded ? 340 : 280,
                height: isExpanded ? 400 : 52,
                borderRadius: isExpanded ? 24 : 26,
              }}
              transition={islandTransition}
              style={{ cursor: isExpanded ? "default" : "pointer" }}
              className="relative overflow-hidden border border-primary-foreground/15 bg-primary/95 text-primary-foreground shadow-2xl shadow-primary/40 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset ring-primary-foreground/10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent"
              />
              <motion.div
                initial={false}
                animate={{
                  opacity: isExpanded ? 0 : 1,
                  scale: isExpanded ? 0.95 : 1,
                  filter: isExpanded ? "blur(4px)" : "blur(0px)",
                }}
                transition={{ ...islandTransition, delay: isExpanded ? 0 : 0.1 }}
                className={cn("absolute inset-0 flex items-center gap-4 px-4 sm:px-5", isExpanded && "pointer-events-none")}
              >
                <div className="h-2 w-2 shrink-0 rounded-full bg-secondary ring-2 ring-secondary/30" />

                <div className="relative flex h-full flex-1 items-center overflow-hidden text-left">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={activeId || "empty"}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="block w-full overflow-hidden text-ellipsis whitespace-nowrap font-heading text-sm font-semibold text-primary-foreground"
                    >
                      {activeHeading?.text || closedLabel}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <CircleProgress percentage={progress} />
              </motion.div>

              <motion.div
                initial={false}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  scale: isExpanded ? 1 : 1.05,
                }}
                transition={{ ...islandTransition, delay: isExpanded ? 0.1 : 0 }}
                className={cn("absolute inset-0 flex flex-col", !isExpanded && "pointer-events-none")}
              >
                <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-5">
                  <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/70">
                    {expandedLabel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4" data-lenis-prevent="true">
                  <div className="flex flex-col gap-0.5">
                    {headings.map((h) => {
                      const isActive = activeId === h.id;
                      const isHovered = hoveredId === h.id;

                      const indentLevel = Math.max(0, h.level - minLevel);
                      const paddingLeft = indentLevel * 14 + 12;

                      return (
                        <button
                          key={h.id}
                          onMouseEnter={() => setHoveredId(h.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            const yOffset = -80;
                            const y = h.element.getBoundingClientRect().top + window.scrollY + yOffset;
                            window.scrollTo({ top: y, behavior: "smooth" });
                            setIsExpanded(false);
                          }}
                          style={{ paddingLeft: `${paddingLeft}px` }}
                          className={cn(
                            "group flex w-full shrink-0 cursor-pointer items-center rounded-lg border-none py-2 pr-3 text-left text-sm transition-all duration-300 ease-out",
                            isActive && "bg-primary-foreground/15 font-semibold text-primary-foreground",
                            !isActive && isHovered && "bg-primary-foreground/10 text-primary-foreground/90",
                            !isActive && !isHovered && "bg-transparent text-primary-foreground/55",
                          )}
                        >
                          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                            {h.text}
                          </span>

                          <motion.div
                            initial={false}
                            animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="ml-3 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary ring-2 ring-secondary/30"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
