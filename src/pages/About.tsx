import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { UnderDevelopment } from "@/components/shared/UnderDevelopment";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { Heart, Users, Globe, BookOpen } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Cultural Preservation",
    description: "We are committed to preserving and sharing the rich traditions, arts, and heritage of Indian culture for future generations."
  },
  {
    icon: Users,
    title: "Community Building",
    description: "We create inclusive spaces where people of all backgrounds can come together, learn, and celebrate cultural diversity."
  },
  {
    icon: Globe,
    title: "Cross-Cultural Connection",
    description: "We believe in building bridges between communities, fostering understanding and appreciation across cultures."
  },
  {
    icon: BookOpen,
    title: "Education & Outreach",
    description: "We provide educational programs that teach traditional arts, languages, and customs to people of all ages."
  }
];

const team = [
  { name: "Team Member 1", role: "Founder & Director" },
  { name: "Team Member 2", role: "Programs Coordinator" },
  { name: "Team Member 3", role: "Community Outreach" },
  { name: "Team Member 4", role: "Events Manager" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 animate-fade-up">
              About The Rith Initiative
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up stagger-1">
              We are a 501(c)(3) nonprofit organization dedicated to sharing and preserving 
              Indian culture through community events, arts, and cultural programming in Central Virginia.
            </p>
            <UnderDevelopment className="mt-4 animate-fade-up stagger-2" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionHeading 
                title="Our Mission"
                subtitle="Building bridges through culture, art, and community"
              />
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  The Rith Initiative was founded with a deep belief that cultural heritage is a 
                  treasure meant to be shared. Our mission is to bring the beauty, wisdom, and 
                  vibrancy of Indian culture to communities across Central Virginia, creating 
                  opportunities for people of all backgrounds to experience and appreciate this 
                  rich heritage.
                </p>
                <p>
                  Through festivals, workshops, performances, and community gatherings, we 
                  celebrate traditions that have been passed down through generations while 
                  adapting them for modern audiences. We believe that by sharing our culture, 
                  we strengthen the fabric of our entire community.
                </p>
                <p>
                  Whether you're exploring Indian culture for the first time or reconnecting 
                  with your roots, The Rith Initiative welcomes you to join our growing family 
                  of cultural ambassadors and community builders.
                </p>
              </div>
              <UnderDevelopment className="mt-4" />
            </div>
            <div className="relative">
              <PlaceholderImage 
                aspectRatio="square" 
                label="Mission image - Community celebration"
                className="rounded-2xl shadow-elevated"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Story Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <PlaceholderImage 
                aspectRatio="video" 
                label="Our story - Founding moment"
                className="rounded-2xl shadow-soft"
              />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading 
                title="Our Story"
                subtitle="From a small gathering to a thriving community"
              />
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  The Rith Initiative began as a small gathering of families who wanted to 
                  share their cultural traditions with their children and neighbors. What 
                  started as informal celebrations in living rooms and backyards has grown 
                  into a recognized nonprofit organization serving thousands of community 
                  members.
                </p>
                <p>
                  Our founders envisioned a place where the next generation could learn 
                  about their heritage while their neighbors could discover the richness 
                  of Indian culture. Today, that vision has become a reality, with programs 
                  that reach across Central Virginia.
                </p>
              </div>
              <UnderDevelopment className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading 
            title="Our Values"
            subtitle="The principles that guide everything we do"
            centered
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
          <UnderDevelopment className="text-center mt-6" />
        </div>
      </section>

      <SectionDivider />

      {/* Team Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <SectionHeading 
            title="Our Team"
            subtitle="Dedicated volunteers making a difference"
            centered
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <PlaceholderImage 
                  aspectRatio="square" 
                  label={member.name}
                  className="rounded-2xl mb-4 shadow-soft"
                />
                <h4 className="font-heading text-lg font-semibold text-foreground">
                  {member.name}
                </h4>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
            ))}
          </div>
          <UnderDevelopment className="text-center mt-6" />
        </div>
      </section>

      <SectionDivider />

      {/* Impact Section */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <SectionHeading 
            title="Our Impact"
            subtitle="Making a difference in Central Virginia"
            centered
          />
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <p className="font-heading text-4xl md:text-5xl font-bold text-primary">5,000+</p>
              <p className="text-muted-foreground">Community Members</p>
            </div>
            <div>
              <p className="font-heading text-4xl md:text-5xl font-bold text-primary">50+</p>
              <p className="text-muted-foreground">Events Hosted</p>
            </div>
            <div>
              <p className="font-heading text-4xl md:text-5xl font-bold text-primary">10+</p>
              <p className="text-muted-foreground">Partner Organizations</p>
            </div>
          </div>
          <UnderDevelopment />
        </div>
      </section>
    </Layout>
  );
}
