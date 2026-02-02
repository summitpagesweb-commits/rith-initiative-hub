import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react";

interface Poster {
  src: string;
  alt: string;
  year: string;
  title: string;
}

interface PosterBookProps {
  posters: Poster[];
}

export function PosterBook({ posters }: PosterBookProps) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Group posters into spreads (2 per spread)
  const spreads: Poster[][] = [];
  for (let i = 0; i < posters.length; i += 2) {
    spreads.push(posters.slice(i, i + 2));
  }

  const totalSpreads = spreads.length;
  const currentPostersPair = spreads[currentSpread] || [];
  const leftPoster = currentPostersPair[0];
  const rightPoster = currentPostersPair[1];

  const canGoNext = currentSpread < totalSpreads - 1;
  const canGoPrev = currentSpread > 0;

  const nextSpread = () => {
    if (canGoNext && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const prevSpread = () => {
    if (canGoPrev && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const goToSpread = (index: number) => {
    if (!isFlipping && index !== currentSpread) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(index);
        setIsFlipping(false);
      }, 400);
    }
  };

  const renderPosterPage = (poster: Poster | undefined, side: 'left' | 'right') => {
    // Show placeholder if no poster or empty src
    if (!poster || !poster.src) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center relative">
          {/* Decorative placeholder */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary/40" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary/30 animate-pulse" />
          </div>
          <div className="text-muted-foreground/60 text-lg font-heading mb-2">
            More memories coming soon...
          </div>
          <p className="text-muted-foreground/40 text-sm max-w-[200px]">
            Stay tuned for our upcoming events and celebrations
          </p>
          {/* Decorative corner flourishes */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col p-3 sm:p-4 md:p-6">
        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={poster.src}
            alt={poster.alt}
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-md"
          />
        </div>
        <div className={`mt-3 pt-3 border-t border-border/30 ${side === 'left' ? 'text-left' : 'text-right'}`}>
          <p className="text-xs sm:text-sm font-medium text-foreground">{poster.title}</p>
          <p className="text-xs text-muted-foreground">{poster.year}</p>
        </div>
      </div>
    );
  };

  // Custom arrow button component
  const NavigationArrow = ({ 
    direction, 
    onClick, 
    disabled 
  }: { 
    direction: 'left' | 'right'; 
    onClick: () => void; 
    disabled: boolean;
  }) => {
    const isLeft = direction === 'left';
    const Icon = isLeft ? ChevronLeft : ChevronRight;
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          group relative p-2 sm:p-3 rounded-full 
          transition-all duration-300 z-10
          ${disabled 
            ? 'opacity-40 cursor-not-allowed' 
            : 'hover:scale-110 active:scale-95'}
        `}
        aria-label={isLeft ? "Previous spread" : "Next spread"}
      >
        {/* Outer decorative ring */}
        <div className={`
          absolute inset-0 rounded-full border-2 
          transition-all duration-300
          ${disabled 
            ? 'border-muted-foreground/20' 
            : 'border-primary/30 group-hover:border-primary/60 group-hover:scale-110'}
        `} />
        
        {/* Inner background with gradient */}
        <div className={`
          absolute inset-1 rounded-full 
          transition-all duration-300
          ${disabled 
            ? 'bg-muted/30' 
            : 'bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20'}
        `} />
        
        {/* Icon container */}
        <div className={`
          relative z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center
          transition-transform duration-300
          ${!disabled && (isLeft ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5')}
        `}>
          <Icon 
            className={`
              w-5 h-5 sm:w-6 sm:h-6 
              transition-colors duration-300
              ${disabled ? 'text-muted-foreground/40' : 'text-primary group-hover:text-primary/80'}
            `} 
          />
        </div>
        
        {/* Decorative dots */}
        {!disabled && (
          <>
            <span className={`
              absolute ${isLeft ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2
              w-1 h-1 rounded-full bg-primary/40
              transition-all duration-300
              ${isLeft ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}
            `} />
            <span className={`
              absolute ${isLeft ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2
              w-0.5 h-0.5 rounded-full bg-primary/30
              transition-all duration-300 delay-75
              ${isLeft ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}
            `} />
          </>
        )}
      </button>
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Book Container */}
      <div className="relative">
        {/* Book Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-foreground/10 rounded-[50%] blur-lg" />
        
        {/* Book Spine - lighter color */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-3 sm:w-4 md:w-6 bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400 z-20 rounded-sm shadow-md" />
        
        {/* Book Pages Container - lighter cream/white tones */}
        <div className={`relative flex bg-gradient-to-b from-stone-50 to-stone-100/80 rounded-lg shadow-2xl border-4 sm:border-6 md:border-8 border-stone-300 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] transition-opacity duration-200 ${isFlipping ? 'opacity-90' : 'opacity-100'}`}>
          {/* Left Page */}
          <div className="w-1/2 bg-gradient-to-br from-white via-stone-50 to-stone-100/50 border-r border-stone-200/50 relative overflow-hidden">
            {/* Page texture lines */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, currentColor 25px)',
            }} />
            {/* Page edge shadow */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent" />
            
            {renderPosterPage(leftPoster, 'left')}
            
            {/* Navigation - Previous */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <NavigationArrow 
                direction="left" 
                onClick={prevSpread} 
                disabled={isFlipping || !canGoPrev} 
              />
            </div>
          </div>

          {/* Right Page */}
          <div 
            className={`w-1/2 bg-gradient-to-bl from-white via-stone-50 to-stone-100/50 relative overflow-hidden group ${canGoNext ? 'cursor-pointer' : ''}`}
            onClick={nextSpread}
          >
            {/* Page texture lines */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, currentColor 25px)',
            }} />
            {/* Page edge shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/5 to-transparent" />
            
            {renderPosterPage(rightPoster, 'right')}
            
            {/* Navigation - Next */}
            <div 
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <NavigationArrow 
                direction="right" 
                onClick={nextSpread} 
                disabled={isFlipping || !canGoNext} 
              />
            </div>
            
            {/* Corner curl effect on hover - only when can go next */}
            {canGoNext && (
              <div className="absolute bottom-0 right-0 w-16 h-16 origin-bottom-right 
                transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-0 h-0 
                  border-l-[30px] border-l-transparent 
                  border-b-[30px] border-b-stone-200
                  group-hover:border-l-[40px] group-hover:border-b-[40px]
                  transition-all duration-300 shadow-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Indicator */}
      {totalSpreads > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {spreads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSpread(index)}
              disabled={isFlipping}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                ${index === currentSpread 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}
                disabled:cursor-not-allowed`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
          <span className="ml-3 text-sm text-muted-foreground">
            {currentSpread + 1} / {totalSpreads}
          </span>
        </div>
      )}
    </div>
  );
}
