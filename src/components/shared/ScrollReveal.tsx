import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "fade-down";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const variantStyles: Record<AnimationVariant, { initial: string; visible: string }> = {
  "fade-up": {
    initial: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    initial: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-in": {
    initial: "opacity-0",
    visible: "opacity-100",
  },
  "slide-left": {
    initial: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "slide-right": {
    initial: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "scale": {
    initial: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
};

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  const { initial, visible } = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all will-change-transform",
        isVisible ? visible : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}
