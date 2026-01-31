import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { UnderDevelopment } from "@/components/shared/UnderDevelopment";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { BlogDetailModal } from "@/components/shared/BlogDetailModal";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import communityGatheringImage from "@/assets/community-gathering.jpg";

interface Event {
  id: string;
  title: string;
  start_date: string;
  time: string | null;
  location: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_name: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-secondary/30">
      <div className="container-wide py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal variant="fade-up">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                501(c)(3) Nonprofit Organization
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-tight">
                Celebrating & Preserving{" "}
                <span className="text-primary">Indian Culture</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                The Rith Initiative brings the richness of Indian heritage to Central Virginia through 
                community events, arts programs, and cultural celebrations that unite people of all backgrounds.
              </p>
              <UnderDevelopment />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/events">
                    Explore Events
                    <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/donate">Support Our Mission</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={200}>
            <div className="relative">
              <div className="relative z-10">
                <PlaceholderImage aspectRatio="square" label="Hero image - Cultural event photography" className="rounded-2xl shadow-elevated" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// Mission Preview Section
function MissionPreview() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal variant="slide-left" className="order-2 lg:order-1">
            <img 
              src={communityGatheringImage} 
              alt="Community gathering at Virginia Historical Society" 
              className="rounded-2xl shadow-soft w-full h-auto object-cover"
            />
          </ScrollReveal>
          <ScrollReveal variant="slide-right" className="order-1 lg:order-2">
            <div className="space-y-6">
              <SectionHeading title="Our Mission" subtitle="Building bridges through culture, art, and community" />
              <p className="text-muted-foreground leading-relaxed">
                The Rith Initiative is dedicated to sharing the beauty and depth of Indian culture 
                with communities across Central Virginia. Through vibrant festivals, educational 
                workshops, and artistic performances, we create spaces where traditions are honored, 
                stories are shared, and connections are forged.
              </p>
              <UnderDevelopment />
              <Button variant="subtle" size="lg" asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { icon: Users, value: "XXX", label: "Volunteers" },
    { icon: Calendar, value: "XXX", label: "Community Engagements" },
    { icon: Heart, value: "100%", label: "Volunteer Driven" },
  ];
  
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-heading text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <UnderDevelopment className="text-center mt-6" />
      </div>
    </section>
  );
}

// Featured Blog Posts Section
function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, content, excerpt, author_name, category, published_at, created_at')
          .eq('is_published', true)
          .eq('is_archived', false)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const displayedPosts = showAll ? posts : posts.slice(0, 3);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading title="Latest Updates" subtitle="Stories and news from our community" className="mb-0" />
            {posts.length > 3 && (
              <Button variant="subtle" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show Less' : 'View All Posts'}
                <ArrowRight size={16} className={showAll ? 'rotate-90' : ''} />
              </Button>
            )}
          </div>
        </ScrollReveal>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post, index) => (
              <ScrollReveal key={post.id} variant="fade-up" delay={index * 100}>
                <article 
                  className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer h-full"
                  onClick={() => handlePostClick(post)}
                >
                  <PlaceholderImage aspectRatio="video" label="Blog post image" className="rounded-none" />
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {post.category}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                    </p>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground">No updates yet. Check back soon!</p>
          </div>
        )}

        <BlogDetailModal 
          post={selectedPost}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </section>
  );
}

// Events Preview Section
function EventsPreviewSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventPhotos, setEventPhotos] = useState<{ url: string; title: string | null }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date().toISOString();
        
        // Fetch upcoming events
        const { data, error } = await supabase
          .from('events')
          .select('id, title, start_date, time, location')
          .gte('start_date', now)
          .eq('is_archived', false)
          .order('start_date', { ascending: true })
          .limit(2);

        if (error) throw error;
        setEvents(data || []);

        // Fetch random media from all events for the photo slots
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('url, title')
          .eq('entity_type', 'event')
          .eq('media_type', 'image');

        if (!mediaError && mediaData && mediaData.length > 0) {
          // Shuffle and pick 2 random images
          const shuffled = [...mediaData].sort(() => 0.5 - Math.random());
          setEventPhotos(shuffled.slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal variant="slide-left">
            <div>
              <SectionHeading title="Upcoming Events" subtitle="Join us for cultural celebrations and community gatherings" />
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-6">
                  {events.map((event, index) => (
                    <ScrollReveal key={event.id} variant="fade-up" delay={index * 100}>
                      <div className="p-6 rounded-xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-heading text-lg font-semibold text-foreground mb-1">
                              {event.title}
                            </h4>
                            <p className="text-primary font-medium text-sm">
                              {format(new Date(event.start_date), 'MMMM d, yyyy')}
                              {event.time && ` • ${event.time}`}
                            </p>
                            {event.location && (
                              <p className="text-muted-foreground text-sm">{event.location}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-card border border-border/50 text-center">
                  <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
                </div>
              )}
              
              <Button variant="hero" size="lg" className="mt-8" asChild>
                <Link to="/events">
                  View All Events
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="slide-right" delay={100}>
            <div className="grid grid-cols-2 gap-4">
              {eventPhotos.length >= 2 ? (
                <>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary/30">
                    <img 
                      src={eventPhotos[0].url} 
                      alt={eventPhotos[0].title || "Event photo"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary/30 mt-8">
                    <img 
                      src={eventPhotos[1].url} 
                      alt={eventPhotos[1].title || "Event photo"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              ) : eventPhotos.length === 1 ? (
                <>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary/30">
                    <img 
                      src={eventPhotos[0].url} 
                      alt={eventPhotos[0].title || "Event photo"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <PlaceholderImage aspectRatio="portrait" label="Event photo 2" className="rounded-xl mt-8" />
                </>
              ) : (
                <>
                  <PlaceholderImage aspectRatio="portrait" label="Event photo 1" className="rounded-xl" />
                  <PlaceholderImage aspectRatio="portrait" label="Event photo 2" className="rounded-xl mt-8" />
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="section-padding bg-foreground text-background">
      <div className="container-narrow text-center">
        <ScrollReveal variant="fade-up">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Support Our Mission
          </h2>
          <p className="text-background/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Your contribution helps us continue sharing Indian culture and traditions with 
            communities across Central Virginia. Every donation makes a difference.
          </p>
          <UnderDevelopment className="text-background/50 mb-6" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/donate">
                Make a Donation
                <Heart size={20} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" className="border-background/30 text-background hover:bg-background hover:text-foreground" asChild>
              <Link to="/contact">Get Involved</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Gallery Preview
function GalleryPreview() {
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string; title: string | null }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // First try to get images from site_gallery
        const { data: siteImages, error: siteError } = await supabase
          .from('site_gallery')
          .select('id, url, title')
          .eq('section_key', 'home_gallery')
          .order('display_order', { ascending: true })
          .limit(8);

        if (!siteError && siteImages && siteImages.length > 0) {
          setGalleryImages(siteImages);
        } else {
          // Fallback to event media if no site gallery images
          const { data: eventMedia, error: eventError } = await supabase
            .from('media')
            .select('id, url, title')
            .eq('entity_type', 'event')
            .eq('media_type', 'image')
            .limit(8);

          if (!eventError && eventMedia) {
            setGalleryImages(eventMedia);
          }
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-wide">
        <ScrollReveal variant="fade-up">
          <SectionHeading title="Moments From Our Events" subtitle="Glimpses of culture, community, and celebration" centered />
        </ScrollReveal>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <ScrollReveal key={img.id} variant="scale" delay={i * 50}>
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary/30 hover:scale-105 transition-transform duration-300">
                  <img 
                    src={img.url} 
                    alt={img.title || `Gallery image ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ScrollReveal key={i} variant="scale" delay={i * 50}>
                <PlaceholderImage aspectRatio="square" label={`Gallery image ${i}`} className="rounded-xl hover:scale-105 transition-transform duration-300" />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <SectionDivider />
      <MissionPreview />
      <SectionDivider />
      <StatsSection />
      <SectionDivider />
      <EventsPreviewSection />
      <SectionDivider />
      <BlogPreviewSection />
      <SectionDivider />
      <GalleryPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
