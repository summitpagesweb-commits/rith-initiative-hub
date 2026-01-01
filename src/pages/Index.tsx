import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { UnderDevelopment } from "@/components/shared/UnderDevelopment";

// Hero Section
function HeroSection() {
  return <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-secondary/30">
      <div className="container-wide py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 animate-fade-up">
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
          <div className="relative animate-fade-up stagger-2">
            <div className="relative z-10">
              <PlaceholderImage aspectRatio="square" label="Hero image - Cultural event photography" className="rounded-2xl shadow-elevated" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>;
}

// Mission Preview Section
function MissionPreview() {
  return <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <PlaceholderImage aspectRatio="video" label="Community gathering photo" className="rounded-2xl shadow-soft" />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
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
        </div>
      </div>
    </section>;
}

// Stats Section
function StatsSection() {
  const stats = [{
    icon: Users,
    value: "5,000+",
    label: "Community Members"
  }, {
    icon: Calendar,
    value: "50+",
    label: "Events Hosted"
  }, {
    icon: Heart,
    value: "100%",
    label: "Volunteer Driven"
  }];
  return <section className="section-padding">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => <div key={index} className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="font-heading text-4xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>)}
        </div>
        <UnderDevelopment className="text-center mt-6" />
      </div>
    </section>;
}

// Featured Blog Posts Section
function BlogPreviewSection() {
  const posts = [{
    title: "Celebrating Diwali: A Night of Lights",
    excerpt: "Our annual Diwali celebration brought together over 500 community members for an evening of traditional dance, music, and festivities.",
    date: "November 15, 2024"
  }, {
    title: "Youth Cultural Workshop Series",
    excerpt: "Introducing our new workshop series designed to teach young people about Indian classical arts, language, and heritage.",
    date: "October 28, 2024"
  }, {
    title: "Community Garden Project Launch",
    excerpt: "Growing together: Our new community garden will feature traditional Indian herbs and vegetables, open to all neighbors.",
    date: "October 10, 2024"
  }];
  return <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading title="Latest Updates" subtitle="Stories and news from our community" className="mb-0" />
          <Button variant="subtle" asChild>
            <Link to="/blog">
              View All Posts
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => <article key={index} className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300">
              <PlaceholderImage aspectRatio="video" label="Blog post image" className="rounded-none" />
              <div className="p-6">
                <p className="text-sm text-primary font-medium mb-2">{post.date}</p>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            </article>)}
        </div>
        <UnderDevelopment className="text-center mt-6" />
      </div>
    </section>;
}

// Events Preview Section
function EventsPreviewSection() {
  const events = [{
    title: "Holi Festival of Colors",
    date: "March 15, 2025",
    time: "11:00 AM - 4:00 PM",
    location: "Central Virginia Park"
  }, {
    title: "Classical Music Evening",
    date: "February 22, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Community Center"
  }];
  return <section className="section-padding">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <SectionHeading title="Upcoming Events" subtitle="Join us for cultural celebrations and community gatherings" />
            <div className="space-y-6">
              {events.map((event, index) => <div key={index} className="p-6 rounded-xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-semibold text-foreground mb-1">
                        {event.title}
                      </h4>
                      <p className="text-primary font-medium text-sm">{event.date} • {event.time}</p>
                      <p className="text-muted-foreground text-sm">{event.location}</p>
                    </div>
                  </div>
                </div>)}
            </div>
            <UnderDevelopment className="mt-4" />
            <Button variant="hero" size="lg" className="mt-8" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PlaceholderImage aspectRatio="portrait" label="Event photo 1" className="rounded-xl" />
            <PlaceholderImage aspectRatio="portrait" label="Event photo 2" className="rounded-xl mt-8" />
          </div>
        </div>
      </div>
    </section>;
}

// CTA Section
function CTASection() {
  return <section className="section-padding bg-foreground text-background">
      <div className="container-narrow text-center">
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
      </div>
    </section>;
}

// Gallery Preview
function GalleryPreview() {
  return <section className="section-padding">
      <div className="container-wide">
        <SectionHeading title="Moments From Our Events" subtitle="Glimpses of culture, community, and celebration" centered />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <PlaceholderImage key={i} aspectRatio="square" label={`Gallery image ${i}`} className="rounded-xl hover:scale-105 transition-transform duration-300" />)}
        </div>
        <UnderDevelopment className="text-center mt-6" />
      </div>
    </section>;
}
const Index = () => {
  return <Layout>
      <HeroSection />
      <MissionPreview />
      <StatsSection />
      <EventsPreviewSection />
      <BlogPreviewSection />
      <GalleryPreview />
      <CTASection />
    </Layout>;
};
export default Index;