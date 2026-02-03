import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Image, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MediaItem {
  id: string;
  url: string;
  media_type: string;
  title: string | null;
  description: string | null;
}

interface PastEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  time: string | null;
  location: string | null;
  category: string | null;
  featured_image_url: string | null;
}

interface PastEventsBookProps {
  events: PastEvent[];
  eventMedia: Record<string, MediaItem[]>;
  onMediaClick: (eventId: string, index: number) => void;
}

export function PastEventsBook({ events, eventMedia, onMediaClick }: PastEventsBookProps) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // Group events into spreads (2 per spread)
  const spreads: PastEvent[][] = [];
  for (let i = 0; i < events.length; i += 2) {
    spreads.push(events.slice(i, i + 2));
  }

  const totalSpreads = Math.max(spreads.length, 1);
  const currentEventsPair = spreads[currentSpread] || [];
  const leftEvent = currentEventsPair[0];
  const rightEvent = currentEventsPair[1];

  const canGoNext = currentSpread < totalSpreads - 1;
  const canGoPrev = currentSpread > 0;

  const nextSpread = () => {
    if (canGoNext && !isFlipping) {
      setIsFlipping(true);
      setFlippedCards(new Set()); // Reset flipped cards when changing spread
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const prevSpread = () => {
    if (canGoPrev && !isFlipping) {
      setIsFlipping(true);
      setFlippedCards(new Set()); // Reset flipped cards when changing spread
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const goToSpread = (index: number) => {
    if (!isFlipping && index !== currentSpread) {
      setIsFlipping(true);
      setFlippedCards(new Set()); // Reset flipped cards when changing spread
      setTimeout(() => {
        setCurrentSpread(index);
        setIsFlipping(false);
      }, 400);
    }
  };

  const toggleCardFlip = (cardIndex: number) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardIndex)) {
        next.delete(cardIndex);
      } else {
        next.add(cardIndex);
      }
      return next;
    });
  };

  const renderMediaGallery = (event: PastEvent) => {
    const media = eventMedia[event.id];
    if (!media || media.length === 0) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 w-full">
            <Image size={14} />
            View Media ({media.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{event.title} - Media Gallery</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">Click any image to enlarge</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {media.map((item, index) => (
              <div 
                key={item.id} 
                className="rounded-lg overflow-hidden border border-border bg-muted/30 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => item.media_type !== 'link' && onMediaClick(event.id, index)}
              >
                {item.media_type === 'image' && (
                  <img 
                    src={item.url} 
                    alt={item.title || 'Event media'} 
                    className="w-full h-40 object-cover"
                  />
                )}
                {item.media_type === 'video' && (
                  <div className="relative w-full h-40 bg-secondary flex items-center justify-center">
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <svg className="w-5 h-5 text-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                {item.media_type === 'link' && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-4 h-40 hover:bg-muted transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={20} className="text-primary" />
                    <span className="text-sm font-medium truncate">{item.title || item.url}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderEventCard = (event: PastEvent | undefined, cardIndex: number, side: 'left' | 'right') => {
    const isFlipped = flippedCards.has(cardIndex);
    
    // Show placeholder if no event
    if (!event) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center relative">
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

    const media = eventMedia[event.id];
    const hasMedia = media && media.length > 0;

    return (
      <div 
        className="h-full perspective-1000 cursor-pointer"
        onClick={() => toggleCardFlip(cardIndex)}
      >
        <div 
          className={`
            relative w-full h-full transition-transform duration-500 transform-style-3d
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of card - Featured Image/Poster */}
          <div 
            className="absolute inset-0 backface-hidden p-3 sm:p-4 md:p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="h-full flex flex-col">
              {event.featured_image_url ? (
                <div className="flex-1 flex items-start justify-center overflow-hidden rounded-lg pt-2">
                  <img
                    src={event.featured_image_url}
                    alt={event.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                  <div className="text-center p-4">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-primary/40" />
                    <p className="text-muted-foreground font-heading">{event.title}</p>
                  </div>
                </div>
              )}
              <div className={`mt-3 pt-3 border-t border-border/30 ${side === 'left' ? 'text-left' : 'text-right'}`}>
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.start_date), 'MMMM d, yyyy')}
                </p>
                <p className="text-xs text-primary mt-1 italic">Click to see details →</p>
              </div>
            </div>
          </div>

          {/* Back of card - Event Details */}
          <div 
            className="absolute inset-0 backface-hidden p-3 sm:p-4 md:p-6 rotate-y-180"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {/* Event Category Badge */}
              {event.category && (
                <span className="inline-block self-start px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                  {event.category}
                </span>
              )}
              
              {/* Event Title */}
              <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground mb-2 line-clamp-2">
                {event.title}
              </h3>

              {/* Event Details */}
              <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary flex-shrink-0" />
                  <span>{format(new Date(event.start_date), 'MMMM d, yyyy')}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{event.location}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div className="flex-1 overflow-y-auto mb-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Media Button */}
              {hasMedia && (
                <div onClick={(e) => e.stopPropagation()}>
                  {renderMediaGallery(event)}
                </div>
              )}

              {/* Flip back hint */}
              <p className="text-xs text-primary mt-2 text-center italic">Click to flip back</p>
            </div>
          </div>
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

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">No past events to display.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Book Container */}
      <div className="relative">
        {/* Book Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-foreground/10 rounded-[50%] blur-lg" />
        
        {/* Book Spine - lighter color */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-3 sm:w-4 md:w-6 bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400 z-20 rounded-sm shadow-md" />
        
        {/* Book Pages Container - lighter cream/white tones */}
        <div className={`relative flex bg-gradient-to-b from-stone-50 to-stone-100/80 rounded-lg shadow-2xl border-4 sm:border-6 md:border-8 border-stone-300 min-h-[450px] sm:min-h-[550px] md:min-h-[650px] transition-opacity duration-200 ${isFlipping ? 'opacity-90' : 'opacity-100'}`}>
          {/* Left Page */}
          <div className="w-1/2 bg-gradient-to-br from-white via-stone-50 to-stone-100/50 border-r border-stone-200/50 relative overflow-hidden">
            {/* Page texture lines */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, currentColor 25px)',
            }} />
            {/* Page edge shadow */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent" />
            
            {renderEventCard(leftEvent, 0, 'left')}
            
            {/* Page number - left */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 font-body italic">
              {currentSpread * 2 + 1}
            </div>
            
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
            className="w-1/2 bg-gradient-to-bl from-white via-stone-50 to-stone-100/50 relative overflow-hidden"
          >
            {/* Page texture lines */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, currentColor 25px)',
            }} />
            {/* Page edge shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/5 to-transparent" />
            
            {renderEventCard(rightEvent, 1, 'right')}
            
            {/* Page number - right */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 font-body italic">
              {currentSpread * 2 + 2}
            </div>
            
            {/* Navigation - Next */}
            <div 
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <NavigationArrow 
                direction="right" 
                onClick={nextSpread} 
                disabled={isFlipping || !canGoNext} 
              />
            </div>
            
            {/* Corner curl effect on hover - only when can go next */}
            {canGoNext && (
              <div 
                className="absolute bottom-0 right-0 w-16 h-16 origin-bottom-right 
                  transition-transform duration-300 hover:scale-110 pointer-events-none cursor-pointer"
                onClick={nextSpread}
              >
                <div className="absolute bottom-0 right-0 w-0 h-0 
                  border-l-[30px] border-l-transparent 
                  border-b-[30px] border-b-stone-200
                  hover:border-l-[40px] hover:border-b-[40px]
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

      {/* Instructions */}
      <div className="text-center mt-6 text-muted-foreground text-sm space-y-1">
        <p>Click on any event card to flip and see details</p>
        <p>Use the arrows to browse through past events</p>
      </div>
    </div>
  );
}
