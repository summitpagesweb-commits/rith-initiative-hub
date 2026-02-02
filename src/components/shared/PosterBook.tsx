import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');

  // Group posters into spreads (2 per spread)
  const spreads: Poster[][] = [];
  for (let i = 0; i < posters.length; i += 2) {
    spreads.push(posters.slice(i, i + 2));
  }

  const totalSpreads = spreads.length;
  const currentPostersPair = spreads[currentSpread] || [];
  const leftPoster = currentPostersPair[0];
  const rightPoster = currentPostersPair[1];

  const nextSpread = () => {
    if (currentSpread < totalSpreads - 1 && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevSpread = () => {
    if (currentSpread > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const renderPosterPage = (poster: Poster | undefined, side: 'left' | 'right') => {
    if (!poster) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="text-muted-foreground/50 text-lg font-heading mb-2">
            More memories coming soon...
          </div>
          <p className="text-muted-foreground/40 text-sm">
            Stay tuned for our upcoming events
          </p>
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

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Book Container */}
      <div className="relative perspective-[2000px]">
        {/* Book Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-foreground/10 rounded-[50%] blur-lg" />
        
        {/* Book Spine */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 z-20 rounded-sm shadow-lg" />
        
        {/* Book Pages Container */}
        <div className="relative flex bg-gradient-to-b from-amber-50 to-amber-100/80 rounded-lg shadow-2xl border-4 sm:border-6 md:border-8 border-amber-900/90 min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
          {/* Left Page */}
          <div 
            className={`w-1/2 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/50 
              border-r border-amber-200/50 relative overflow-hidden
              ${isFlipping && flipDirection === 'backward' ? 'animate-page-flip-reverse' : ''}`}
          >
            {/* Page texture lines */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, currentColor 21px)',
            }} />
            {/* Page edge shadow */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent" />
            {/* Page corner fold effect */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-amber-200/30 to-transparent" />
            
            {renderPosterPage(leftPoster, 'left')}
            
            {/* Navigation - Previous */}
            {currentSpread > 0 && (
              <button
                onClick={prevSpread}
                disabled={isFlipping}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                  bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                aria-label="Previous spread"
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>

          {/* Right Page */}
          <div 
            className={`w-1/2 bg-gradient-to-bl from-amber-50 via-stone-50 to-amber-100/50 
              relative overflow-hidden cursor-pointer group
              ${isFlipping && flipDirection === 'forward' ? 'animate-page-flip' : ''}`}
            onClick={currentSpread < totalSpreads - 1 ? nextSpread : undefined}
          >
            {/* Page texture lines */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, currentColor 21px)',
            }} />
            {/* Page edge shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/5 to-transparent" />
            {/* Page corner fold effect */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-200/30 to-transparent" />
            
            {renderPosterPage(rightPoster, 'right')}
            
            {/* Hover flip indicator */}
            {currentSpread < totalSpreads - 1 && (
              <>
                {/* Page turn preview on hover */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/0 via-transparent to-transparent 
                  group-hover:from-black/5 transition-all duration-300 pointer-events-none" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                  bg-primary/10 opacity-0 group-hover:opacity-100 text-primary transition-all duration-200
                  group-hover:scale-110"
                  aria-hidden="true"
                >
                  <ChevronRight size={20} />
                </div>
                {/* Corner curl effect on hover */}
                <div className="absolute bottom-0 right-0 w-16 h-16 origin-bottom-right 
                  transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-0 h-0 
                    border-l-[40px] border-l-transparent 
                    border-b-[40px] border-b-amber-200/80
                    group-hover:border-l-[50px] group-hover:border-b-[50px]
                    transition-all duration-300 shadow-lg" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Book Ribbon Bookmark */}
        <div className="absolute -bottom-6 right-[45%] w-4 h-16 bg-primary/80 rounded-b-sm shadow-md z-10">
          <div className="absolute bottom-0 left-0 w-0 h-0 
            border-l-[8px] border-l-primary/80 
            border-r-[8px] border-r-primary/80 
            border-b-[8px] border-b-transparent" />
        </div>
      </div>

      {/* Page Indicator */}
      {totalSpreads > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {spreads.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isFlipping && index !== currentSpread) {
                  setFlipDirection(index > currentSpread ? 'forward' : 'backward');
                  setIsFlipping(true);
                  setTimeout(() => {
                    setCurrentSpread(index);
                    setIsFlipping(false);
                  }, 600);
                }
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                ${index === currentSpread 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
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
