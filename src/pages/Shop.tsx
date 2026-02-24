import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/shared/PageMeta";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ShoppingBag } from "lucide-react";

export default function Shop() {
  return (
    <Layout>
      <PageMeta
        title="Shop"
        description="Browse Indian cultural merchandise and artisan products from The Rith Initiative. Support Indian American arts and heritage with your purchase."
        keywords="Indian cultural merchandise, Indian artisan products, Indian American shop, support Indian arts, Indian heritage gifts"
        path="/shop"
      />
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal variant="fade-up">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                Shop
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={100}>
              <p className="text-base text-muted-foreground leading-relaxed italic">
                Support The Rith Initiative by purchasing cultural merchandise and handcrafted items.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Products Section - Placeholder */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal variant="fade-up">
            <SectionHeading
              title="Our Collection"
              subtitle="Curated items celebrating Indian culture and heritage"
              centered
            />
          </ScrollReveal>
          
          <ScrollReveal variant="fade-up" delay={100}>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md">
                We're curating a special collection of cultural items and merchandise. 
                Check back soon to discover unique products that support our mission.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
