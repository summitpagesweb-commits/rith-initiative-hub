import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-elevated",
        "transition-all duration-300 hover:scale-110 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp 
        size={24} 
        className="animate-[bounce_2s_ease-in-out_infinite]" 
      />
    </button>
  );
}
