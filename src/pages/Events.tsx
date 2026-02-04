import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PastEventsBook } from "@/components/shared/PastEventsBook";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink, Image } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MediaLightbox } from "@/components/shared/MediaLightbox";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  time: string | null;
  location: string | null;
  category: string | null;
  registration_link: string | null;
  featured_image_url: string | null;
}

interface MediaItem {
  id: string;
  url: string;
  media_type: string;
  title: string | null;
  description: string | null;
}

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [eventMedia, setEventMedia] = useState<Record<string, MediaItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<MediaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [highlightsVideoUrl, setHighlightsVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date().toISOString();

        // Fetch upcoming events
        const { data: upcoming, error: upcomingError } = await supabase
          .from('events')
          .select('*')
          .gte('start_date', now)
          .eq('is_archived', false)
          .order('start_date', { ascending: true });

        if (upcomingError) throw upcomingError;

        // Fetch past events
        const { data: past, error: pastError } = await supabase
          .from('events')
          .select('*')
          .lt('start_date', now)
          .eq('is_archived', false)
          .order('start_date', { ascending: false });

        if (pastError) throw pastError;

        const allEvents = [...(upcoming || []), ...(past || [])];
        setUpcomingEvents(upcoming || []);
        setPastEvents(past || []);

        // Fetch media for all events
        if (allEvents.length > 0) {
          const eventIds = allEvents.map(e => e.id);
          const { data: media, error: mediaError } = await supabase
            .from('media')
            .select('*')
            .eq('entity_type', 'event')
            .in('entity_id', eventIds)
            .order('display_order', { ascending: true });

          if (!mediaError && media) {
            const mediaByEvent: Record<string, MediaItem[]> = {};
            media.forEach((m) => {
              if (!mediaByEvent[m.entity_id]) {
                mediaByEvent[m.entity_id] = [];
              }
              mediaByEvent[m.entity_id].push(m);
            });
            setEventMedia(mediaByEvent);
          }
        }

        // Fetch event highlights video URL
        const { data: siteContent, error: siteContentError } = await supabase
          .from('site_content')
          .select('video_url')
          .eq('section_key', 'event_highlights')
          .single();

        if (!siteContentError && siteContent) {
          setHighlightsVideoUrl(siteContent.video_url);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  

  const toggleDescription = (eventId: string) => {
    setExpandedDescriptions(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const openMediaLightbox = (eventId: string, index: number = 0) => {
    const media = eventMedia[eventId];
    if (media && media.length > 0) {
      setLightboxMedia(media);
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const renderMediaGallery = (eventId: string, eventTitle: string) => {
    const media = eventMedia[eventId];
    if (!media || media.length === 0) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Image size={16} />
            View Media ({media.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{eventTitle} - Media Gallery</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">Click any image to enlarge</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {media.map((item, index) => (
              <div 
                key={item.id} 
                className="rounded-lg overflow-hidden border border-border bg-muted/30 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => item.media_type !== 'link' && openMediaLightbox(eventId, index)}
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal variant="fade-up">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                Events & Programs
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={100}>
              <p className="text-base text-muted-foreground leading-relaxed italic">
                Join us for cultural celebrations, educational workshops, and community gatherings 
                that bring the beauty of Indian heritage to life.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Upcoming Events */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal variant="fade-up">
            <SectionHeading 
              title="Upcoming Events"
              subtitle="Mark your calendar for these exciting programs"
            />
          </ScrollReveal>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => {
                const isExpanded = expandedDescriptions.has(event.id);
                const hasLongDescription = event.description && event.description.length > 200;
                
                return (
                  <ScrollReveal key={event.id} variant="fade-up" delay={index * 100}>
                    <div className="group grid md:grid-cols-[300px_1fr] gap-6 p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden">
                      {event.featured_image_url ? (
                        <div className="w-full bg-secondary/30 rounded-xl overflow-hidden flex items-center justify-center p-4">
                          <img 
                            src={event.featured_image_url} 
                            alt={event.title}
                            className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <PlaceholderImage 
                          aspectRatio="video" 
                          label={`${event.title} image`}
                          className="rounded-xl"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          {event.category && (
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {event.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary flex-shrink-0" />
                            {format(new Date(event.start_date), 'MMMM d, yyyy')}
                          </span>
                          {event.time && (
                            <span className="flex items-center gap-2">
                              <Clock size={16} className="text-primary flex-shrink-0" />
                              {event.time}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary flex-shrink-0" />
                              <span className="break-words">{event.location}</span>
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <div className="mb-4 flex-grow">
                            <p className={`text-muted-foreground text-sm leading-relaxed break-words ${!isExpanded && hasLongDescription ? 'line-clamp-3' : ''}`}>
                              {event.description}
                            </p>
                            {hasLongDescription && (
                              <button 
                                onClick={() => toggleDescription(event.id)}
                                className="text-primary text-sm font-medium mt-1 hover:underline"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                          {event.registration_link && (
                            <Button 
                              variant="hero" 
                              size="sm"
                              onClick={() => window.open(event.registration_link!, '_blank')}
                            >
                              Register Now
                              <ArrowRight size={16} />
                            </Button>
                          )}
                          {renderMediaGallery(event.id, event.title)}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <ScrollReveal variant="fade-up">
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground">Check back soon for new events and programs!</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Past Events - Book Style Gallery */}
      <section className="section-padding bg-secondary/20">
        <div className="container-wide">
          <ScrollReveal variant="fade-up">
            <SectionHeading 
              title="Past Events"
              subtitle="Flip through our past celebrations and memories"
              centered
            />
          </ScrollReveal>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollReveal variant="fade-up" delay={100}>
              <PastEventsBook 
                events={pastEvents}
                eventMedia={eventMedia}
                onMediaClick={openMediaLightbox}
              />
            </ScrollReveal>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* CTA Section */}
      <section className="section-padding bg-foreground text-background">
        <div className="container-narrow text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-6">
              Want to Host an Event?
            </h2>
            <p className="text-background/70 text-lg max-w-2xl mx-auto mb-8">
              We partner with community organizations, schools, and cultural groups to bring 
              Indian cultural programming to new audiences. Get in touch to discuss collaboration opportunities.
            </p>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
              <ArrowRight size={20} />
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Media Lightbox */}
      <MediaLightbox
        media={lightboxMedia}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </Layout>
  );
}
