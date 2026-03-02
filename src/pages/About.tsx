import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/shared/PageMeta";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Heart, Users, Globe, BookOpen } from "lucide-react";
import missionCelebrationImage from "@/assets/mission-celebration.jpg";
import ourStoryFoundingImage from "@/assets/our-story-founding.jpg";

const values = [
  {
    icon: Heart,
    title: "Cultural Preservation",
    description:
      "We are committed to preserving and sharing the rich traditions, arts, and heritage of Indian culture for future generations.",
  },
  {
    icon: Users,
    title: "Community Building",
    description:
      "We create inclusive spaces where people of all backgrounds can come together, learn, and celebrate cultural diversity.",
  },
  {
    icon: Globe,
    title: "Cross-Cultural Connection",
    description:
      "We believe in building bridges between communities, fostering understanding and appreciation across cultures.",
  },
  {
    icon: BookOpen,
    title: "Education & Outreach",
    description:
      "We provide educational programs that teach traditional arts, languages, and customs to people of all ages.",
  },
];

const boardMembers = [
  { name: "Ruchi Gupta", role: "President" },
  { name: "Prabir Mehta", role: "Vice President" },
  { name: "Sumeet Gupta", role: "Treasurer" },
];

const advisoryMembers = [{ name: "Priti Patil" }, { name: "Niraj Verma" }];

export default function About() {
  return (
    <Layout>
      <PageMeta
        title="About Us"
        description="Learn about The Rith Initiative, a 501(c)(3) Indian American nonprofit exploring Indian wisdom, arts, and culture through community programming in Virginia."
        keywords="Indian American nonprofit about, Indian cultural organization Virginia, 501c3 Indian foundation, Indian heritage mission"
        path="/about"
      />
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal variant="fade-up">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                About The Rith Initiative
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={100}>
              <p className="text-base text-muted-foreground leading-relaxed italic">
                We are a 501(c)(3) nonprofit exploring and celebrating living Indian culture and wisdom through
                community events, arts, and programming in Virginia.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal variant="slide-left">
              <div>
                <SectionHeading title="Our Mission" subtitle="Building bridges through culture, art, and community" />
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Rith Initiative exists to explore, share, and grow Indian culture through the arts. We see
                    creativity as a bridge that connects generations and geographies, fostering understanding and a
                    deeper sense of belonging.
                  </p>
                  <p>
                    Our mission is to create spaces where Indian traditions meet contemporary expression, inviting
                    artists and audiences of all ages to engage with heritage with openness and curiosity.
                  </p>
                  <p>
                    Through exhibitions, performances, storytelling, and community engagement, we spark dialogue,
                    nurture collaboration, and celebrate the many ways culture continues to evolve — rhythm by rhythm,
                    story by story.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="slide-right" delay={100}>
              <div className="relative">
                <img
                  src={missionCelebrationImage}
                  alt="Traditional Indian dancers performing at community celebration"
                  className="rounded-2xl shadow-elevated w-full h-auto object-cover aspect-square"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Story Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <ScrollReveal variant="slide-left" className="order-2 lg:order-1">
              <div>
                <img
                  src={ourStoryFoundingImage}
                  alt="Women in colorful sarees at cultural event"
                  className="rounded-2xl shadow-soft w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal variant="slide-right" className="order-1 lg:order-2">
              <div>
                <SectionHeading title="Our Story" subtitle="From a small gathering to a thriving community" />
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Rith Initiative emerged from a simple but powerful intention — to celebrate India through the arts
                    in a way that feels authentic, accessible, and rooted in community. Founded in Richmond, Virginia,
                    by artists Ruchi Gupta and Prabir Mehta, Rith Initiative was born at the intersection of culture,
                    creativity, and public engagement.
                  </p>
                  <p>
                    Years earlier, their paths crossed at Mother India, an event hosted by Mehta at Gallery5 that
                    explored Indian identity through performance and visual art. That moment planted the seed of
                    collaboration. In 2024, that seed blossomed into the first Diwali Festival at Lewis Ginter Botanical
                    Garden, a community‑driven celebration that brought together families, artists, dancers, musicians,
                    and volunteers from across the region — revealing a shared desire for spaces where Indian culture
                    could be experienced with depth, joy, and openness.
                  </p>
                  <p>
                    In 2025, the vision expanded with the second Diwali Music and Arts Festival, hosted in partnership
                    with the Virginia Museum of History and Culture. This event introduced new dimensions of
                    sustainability and environmental consciousness — from composting food waste to installing refillable
                    water stations — showing how cultural celebration and ecological care can move in rhythm together.
                    That same year, Rith Initiative became a 501(c)(3) nonprofit dedicated to preserving and sharing
                    Indian culture through the arts.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal variant="fade-up">
            <SectionHeading title="Our Values" subtitle="The principles that guide everything we do" centered />
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
                <div className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 h-full">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Team Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <ScrollReveal variant="fade-up">
            <SectionHeading title="Rith Team" subtitle="The people behind the initiative" centered />
          </ScrollReveal>

          {/* Board */}
          <div className="mb-12">
            <ScrollReveal variant="fade-up">
              <h3 className="font-heading text-xl font-semibold text-foreground text-center mb-8">Board</h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {boardMembers.map((member, index) => (
                <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
                  <div className="text-center">
                    <PlaceholderImage
                      aspectRatio="square"
                      label={member.name}
                      className="w-full max-w-[260px] mx-auto rounded-2xl mb-4 shadow-soft"
                    />
                    <h4 className="font-heading text-lg font-semibold text-foreground">{member.name}</h4>
                    <p className="text-muted-foreground text-sm">{member.role}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Advisory */}
          <div>
            <ScrollReveal variant="fade-up">
              <h3 className="font-heading text-xl font-semibold text-foreground text-center mb-8">Advisory</h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {advisoryMembers.map((member, index) => (
                <ScrollReveal key={index} variant="fade-up" delay={index * 100}>
                  <div className="text-center">
                    <PlaceholderImage
                      aspectRatio="square"
                      label={member.name}
                      className="w-full max-w-[260px] mx-auto rounded-2xl mb-4 shadow-soft"
                    />
                    <h4 className="font-heading text-lg font-semibold text-foreground">{member.name}</h4>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
