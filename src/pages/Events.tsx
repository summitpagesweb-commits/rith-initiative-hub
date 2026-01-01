import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { UnderDevelopment } from "@/components/shared/UnderDevelopment";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const upcomingEvents = [
  {
    id: 1,
    title: "Holi Festival of Colors",
    date: "March 15, 2025",
    time: "11:00 AM - 4:00 PM",
    location: "Central Virginia Community Park",
    description: "Join us for our biggest celebration of the year! Experience the joy of Holi with traditional music, dance, delicious food, and of course, vibrant colors. This family-friendly event welcomes everyone to participate in this beautiful celebration of spring and new beginnings.",
    category: "Festival"
  },
  {
    id: 2,
    title: "Classical Music Evening: Ragas of the Night",
    date: "February 22, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Downtown Community Center",
    description: "An intimate evening featuring renowned classical musicians performing traditional ragas. Experience the depth and beauty of Indian classical music in a setting designed for deep listening and appreciation.",
    category: "Music"
  },
  {
    id: 3,
    title: "Youth Dance Workshop: Bharatanatyam Basics",
    date: "February 8, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "The Rith Initiative Cultural Space",
    description: "A beginner-friendly workshop introducing children ages 8-14 to the ancient art of Bharatanatyam. No prior experience required. Participants will learn basic movements, hand gestures, and the cultural significance of this classical dance form.",
    category: "Workshop"
  },
  {
    id: 4,
    title: "Cooking Class: Traditional South Indian Cuisine",
    date: "January 25, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Community Kitchen",
    description: "Learn to prepare authentic South Indian dishes including dosas, sambar, and chutneys. Our experienced home cooks will share family recipes and techniques passed down through generations.",
    category: "Workshop"
  }
];

const pastEvents = [
  {
    id: 1,
    title: "Diwali Festival of Lights 2024",
    date: "November 15, 2024",
    location: "Central Virginia Convention Center",
    attendees: "500+",
    description: "Our annual Diwali celebration brought together the community for an evening of traditional lamps, fireworks, dance performances, and festive food."
  },
  {
    id: 2,
    title: "Navratri Garba Nights",
    date: "October 3-12, 2024",
    location: "Community Center",
    attendees: "300+",
    description: "Nine nights of traditional Garba and Dandiya Raas dancing, celebrating the triumph of good over evil with music, dance, and community spirit."
  },
  {
    id: 3,
    title: "Independence Day Cultural Program",
    date: "August 15, 2024",
    location: "City Amphitheater",
    attendees: "400+",
    description: "A patriotic celebration featuring classical and folk performances, speeches, and a tribute to India's diverse cultural heritage."
  },
  {
    id: 4,
    title: "Summer Art Camp for Kids",
    date: "July 15-19, 2024",
    location: "The Rith Initiative Cultural Space",
    attendees: "50",
    description: "A week-long camp where children explored Indian arts including rangoli, mehndi, and traditional painting techniques."
  }
];

export default function Events() {
  const [showAllPast, setShowAllPast] = useState(false);
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
            <UnderDevelopment className="mt-4 animate-fade-up stagger-2" />
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
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id}
                className="group grid md:grid-cols-[300px_1fr] gap-6 p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <PlaceholderImage 
                  aspectRatio="video" 
                  label={`${event.title} image`}
                  className="rounded-xl"
                />
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      {event.location}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {event.description}
                  </p>
                  <div>
                    <Button variant="hero" size="sm">
                      Register Now
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <UnderDevelopment className="mt-6" />
        </div>
      </section>

      {/* Past Events */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <SectionHeading 
            title="Past Events"
            subtitle="Highlights from our previous programs and celebrations"
          />
          <div className="grid md:grid-cols-2 gap-8">
            {displayedPastEvents.map((event) => (
              <div 
                key={event.id}
                className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft"
              >
                <PlaceholderImage 
                  aspectRatio="video" 
                  label={`${event.title} photos`}
                  className="rounded-none"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                    <Calendar size={14} />
                    {event.date}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    <MapPin size={14} className="inline mr-1" />
                    {event.location} • {event.attendees} attendees
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {event.description}
                  </p>
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
          <UnderDevelopment className="text-center mt-6" />
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
                <p className="text-muted-foreground">YouTube video embed placeholder</p>
              </div>
            </div>
            <UnderDevelopment className="text-center mt-4" />
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
