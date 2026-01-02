import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { UnderDevelopment } from "@/components/shared/UnderDevelopment";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { Button } from "@/components/ui/button";
import { Heart, Gift, Users, BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// TODO: Replace with actual donation link when received
const DONATION_LINK = "#";

const impactAreas = [
  {
    icon: Users,
    title: "Community Events",
    description: "Host festivals, cultural celebrations, and community gatherings that bring people together."
  },
  {
    icon: BookOpen,
    title: "Educational Programs",
    description: "Provide workshops, classes, and learning opportunities for all ages to explore Indian culture."
  },
  {
    icon: Gift,
    title: "Arts & Performance",
    description: "Support classical music, dance, and visual arts programs that preserve traditional practices."
  },
  {
    icon: Heart,
    title: "Youth Development",
    description: "Empower the next generation to connect with their heritage and become cultural ambassadors."
  }
];


export default function Donate() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
              <Heart size={16} />
              501(c)(3) Tax-Deductible
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 animate-fade-up stagger-1">
              Support Our Mission
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up stagger-2">
              Your generous contribution helps us share the beauty of Indian culture with
              communities across Central Virginia. Every donation makes a lasting impact.
            </p>
            <UnderDevelopment className="mt-4 animate-fade-up stagger-3" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Impact Section */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            title="Where Your Donation Goes"
            subtitle="Supporting cultural preservation and community building"
            centered
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <area.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {area.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
          <UnderDevelopment className="text-center mt-6" />
        </div>
      </section>

      <SectionDivider />

      {/* Donate Now CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5">
        <div className="container-narrow">
          <div className="bg-card rounded-3xl p-8 md:p-12 lg:p-16 border border-border/50 shadow-elevated text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Make a Donation
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Every contribution, no matter the size, helps us continue our mission of
                cultural preservation and community building in Central Virginia.
              </p>
              
              <Button 
                variant="hero" 
                size="xl" 
                asChild
                className="min-w-[240px] text-lg"
              >
                <a 
                  href={DONATION_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3"
                >
                  Donate Now
                  <ExternalLink size={20} />
                </a>
              </Button>
              
              <p className="text-sm text-muted-foreground mt-6">
                You will be redirected to our secure donation platform
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Other Ways to Help */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <SectionHeading
            title="Other Ways to Help"
            subtitle="Financial contributions aren't the only way to support our mission"
            centered
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Volunteer</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Share your time and talents at our events and programs.
              </p>
              <Button variant="subtle" asChild>
                <Link to="/contact">Learn More</Link>
              </Button>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Corporate Sponsorship</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Partner with us to make a larger community impact.
              </p>
              <Button variant="subtle" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">In-Kind Donations</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Contribute supplies, equipment, or services.
              </p>
              <Button variant="subtle" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
          <UnderDevelopment className="text-center mt-6" />
        </div>
      </section>

      <SectionDivider />

      {/* Trust Section */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Your Trust Matters
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            The Rith Initiative is a registered 501(c)(3) nonprofit organization. All donations
            are tax-deductible to the fullest extent allowed by law. We are committed to
            transparency and responsible stewardship of every contribution.
          </p>
          <p className="text-sm text-muted-foreground">
            EIN: XX-XXXXXXX (placeholder)
          </p>
          <UnderDevelopment className="mt-4" />
        </div>
      </section>
    </Layout>
  );
}
