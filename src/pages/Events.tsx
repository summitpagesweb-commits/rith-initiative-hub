import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllPast, setShowAllPast] = useState(false);

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

        setUpcomingEvents(upcoming || []);
        setPastEvents(past || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const displayedPastEvents = showAllPast ? pastEvents : pastEvents.slice(0, 2);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 animate-fade-up">
              Events & Programs
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up stagger-1">
              Join us for cultural celebrations, educational workshops, and community gatherings 
              that bring the beauty of Indian heritage to life.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading 
            title="Upcoming Events"
            subtitle="Mark your calendar for these exciting programs"
          />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="group grid md:grid-cols-[300px_1fr] gap-6 p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300"
                >
                  {event.featured_image_url ? (
                    <img 
                      src={event.featured_image_url} 
                      alt={event.title}
                      className="w-full h-auto aspect-video object-cover rounded-xl"
                    />
                  ) : (
                    <PlaceholderImage 
                      aspectRatio="video" 
                      label={`${event.title} image`}
                      className="rounded-xl"
                    />
                  )}
                  <div className="flex flex-col">
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
                        <Calendar size={16} className="text-primary" />
                        {format(new Date(event.start_date), 'MMMM d, yyyy')}
                      </span>
                      {event.time && (
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          {event.time}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-2">
                          <MapPin size={16} className="text-primary" />
                          {event.location}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                        {event.description}
                      </p>
                    )}
                    <div>
                      {event.registration_link ? (
                        <Button 
                          variant="hero" 
                          size="sm"
                          onClick={() => window.open(event.registration_link!, '_blank')}
                        >
                          Register Now
                          <ArrowRight size={16} />
                        </Button>
                      ) : (
                        <Button variant="hero" size="sm" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">Check back soon for new events and programs!</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <SectionHeading 
            title="Past Events"
            subtitle="Highlights from our previous programs and celebrations"
          />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : pastEvents.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                {displayedPastEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft"
                  >
                    {event.featured_image_url ? (
                      <img 
                        src={event.featured_image_url} 
                        alt={event.title}
                        className="w-full h-auto aspect-video object-cover"
                      />
                    ) : (
                      <PlaceholderImage 
                        aspectRatio="video" 
                        label={`${event.title} photos`}
                        className="rounded-none"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                        <Calendar size={14} />
                        {format(new Date(event.start_date), 'MMMM d, yyyy')}
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-muted-foreground text-sm mb-3">
                          <MapPin size={14} className="inline mr-1" />
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {!showAllPast && pastEvents.length > 2 && (
                <div className="text-center mt-8">
                  <Button variant="subtle" onClick={() => setShowAllPast(true)}>
                    Show More Events
                    <ChevronDown size={16} />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No past events to display.</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Section Placeholder */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading 
            title="Event Highlights"
            subtitle="Watch moments from our celebrations"
            centered
          />
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Video highlights coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-foreground text-background">
        <div className="container-narrow text-center">
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
        </div>
      </section>
    </Layout>
  );
}
