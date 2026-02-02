import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Heart, Gift, Users, BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const DONATION_LINK = "https://www.paypal.com/donate?hosted_button_id=LDD3U2Q5B59QE";

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
            <ScrollReveal variant="fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Heart size={16} />
                501(c)(3) Tax-Deductible
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={100}>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                Support Our Mission
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Your generous contribution helps us share the beauty of Indian culture with
                communities across Virginia. Every donation makes a lasting impact.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Donate Now CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5">
        <div className="container-narrow">
          <ScrollReveal variant="scale">
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
                  cultural preservation and community building in Virginia.
                </p>
                
                <form action="https://www.paypal.com/donate" method="post" target="_top" className="inline-block">
                  <input type="hidden" name="hosted_button_id" value="LDD3U2Q5B59QE" />
                  <input 
                    type="image" 
                    src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" 
                    name="submit" 
                    title="PayPal - The safer, easier way to pay online!" 
                    alt="Donate with PayPal button"
                    className="cursor-pointer"
                  />
                  <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                </form>
                
                <p className="text-sm text-muted-foreground mt-6">
                  Secure payment powered by PayPal
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Other Ways to Help */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <ScrollReveal variant="fade-up">
            <SectionHeading
              title="Other Ways to Help"
              subtitle="Financial contributions aren't the only way to support our mission"
              centered
            />
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              { title: "Volunteer", desc: "Share your time and talents at our events and programs.", link: "/contact", cta: "Learn More" },
              { title: "Corporate Sponsorship", desc: "Partner with us to make a larger community impact.", link: "/contact", cta: "Contact Us" },
            ].map((item, index) => (
              <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center h-full flex flex-col">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{item.desc}</p>
                  <Button variant="subtle" asChild>
                    <Link to={item.link}>{item.cta}</Link>
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Trust Section */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Your Trust Matters
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              The Rith Initiative is a registered 501(c)(3) nonprofit organization. All donations
              are tax-deductible to the fullest extent allowed by law. We are committed to
              transparency and responsible stewardship of every contribution.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
