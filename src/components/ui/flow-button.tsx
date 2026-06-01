"use client";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type FlowButtonVariant = "primary" | "secondary";

type FlowButtonProps = {
  text?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  variant?: FlowButtonVariant;
};

const baseClass =
  "group relative inline-flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] px-8 py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] active:scale-[0.95]";

const variantWrapper: Record<FlowButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-primary-foreground hover:border-secondary hover:text-secondary-foreground",
  secondary:
    "border-secondary bg-secondary text-secondary-foreground hover:border-primary hover:text-primary-foreground",
};

const variantArrow: Record<FlowButtonVariant, string> = {
  primary: "stroke-primary-foreground group-hover:stroke-secondary-foreground",
  secondary: "stroke-secondary-foreground group-hover:stroke-primary-foreground",
};

const variantRipple: Record<FlowButtonVariant, string> = {
  primary: "bg-secondary",
  secondary: "bg-primary",
};

export function FlowButton({
  text = "Modern Button",
  href,
  className,
  onClick,
  variant = "primary",
}: FlowButtonProps) {
  const arrow = variantArrow[variant];
  const content = (
    <>
      <ArrowRight
        className={cn(
          "absolute w-4 h-4 left-[-25%] fill-none z-[9] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          arrow,
        )}
      />

      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      <span
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[320px] group-hover:h-[320px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
          variantRipple[variant],
        )}
      />

      <ArrowRight
        className={cn(
          "absolute w-4 h-4 right-4 fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          arrow,
        )}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cn(baseClass, variantWrapper[variant], className)}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseClass, variantWrapper[variant], className)}>
      {content}
    </button>
  );
}
