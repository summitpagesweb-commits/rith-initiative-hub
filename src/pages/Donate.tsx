import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { UnderDevelopment } from "@/components/shared/UnderDevelopment";
import { Button } from "@/components/ui/button";
import { Heart, Gift, Users, BookOpen, Check } from "lucide-react";
import { Link } from "react-router-dom";

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

const donationLevels = [
  {
    amount: "$25",
    name: "Friend",
    description: "Provides supplies for one workshop participant",
    benefits: ["Newsletter updates", "Event announcements"]
  },
  {
    amount: "$50",
    name: "Supporter",
    description: "Sponsors a child's participation in cultural camp",
    benefits: ["Newsletter updates", "Event announcements", "Recognition on website"]
  },
  {
    amount: "$100",
    name: "Patron",
    description: "Funds materials for a community art project",
    benefits: ["Newsletter updates", "Event announcements", "Recognition on website", "VIP event seating"]
  },
  {
    amount: "$250",
    name: "Benefactor",
    description: "Supports a full workshop series",
    benefits: ["Newsletter updates", "Event announcements", "Recognition on website", "VIP event seating", "Exclusive donor events"]
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

      {/* Donation Levels */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <SectionHeading
            title="Ways to Give"
            subtitle="Choose a giving level that's right for you"
            centered
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationLevels.map((level, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col"
              >
                <div className="text-center mb-6">
                  <p className="font-heading text-4xl font-bold text-primary mb-2">{level.amount}</p>
                  <p className="font-heading text-lg font-semibold text-foreground">{level.name}</p>
                </div>
                <p className="text-muted-foreground text-sm text-center mb-6 flex-grow">
                  {level.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {level.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button variant="hero" className="w-full">
                  Donate {level.amount}
                </Button>
              </div>
            ))}
          </div>
          <UnderDevelopment className="text-center mt-6" />
        </div>
      </section>

      {/* Custom Amount */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border/50 shadow-elevated text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Make a Custom Donation
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              No amount is too small. Every contribution helps us continue our mission of
              cultural preservation and community building.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full sm:w-48 h-14 pl-8 pr-4 rounded-lg border border-border bg-background text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <Button variant="hero" size="xl">
                Donate Now
                <Heart size={20} />
              </Button>
            </div>
            <UnderDevelopment className="mt-6" />
          </div>
        </div>
      </section>

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
