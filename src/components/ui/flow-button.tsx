"use client";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type FlowButtonProps = {
  text?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
};

const baseClass =
  "group relative inline-flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-primary bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-secondary hover:text-secondary-foreground hover:rounded-[12px] active:scale-[0.95]";

export function FlowButton({ text = "Modern Button", href, className, onClick }: FlowButtonProps) {
  const content = (
    <>
      <ArrowRight className="absolute w-4 h-4 left-[-25%] stroke-primary-foreground fill-none z-[9] group-hover:left-4 group-hover:stroke-secondary-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />

      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-secondary rounded-[50%] opacity-0 group-hover:w-[320px] group-hover:h-[320px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]" />

      <ArrowRight className="absolute w-4 h-4 right-4 stroke-primary-foreground fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-secondary-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cn(baseClass, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseClass, className)}>
      {content}
    </button>
  );
}
