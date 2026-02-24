import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/shared/PageMeta";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ShopItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  purchase_link: string | null;
  category: string | null;
}

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('shop_items')
          .select('*')
          .eq('is_published', true)
          .eq('is_archived', false)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const categories = [...new Set(items.filter(i => i.category).map(i => i.category!))];

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

      {/* Products Section */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal variant="fade-up">
            <SectionHeading
              title="Our Collection"
              subtitle="Curated items celebrating Indian culture and heritage"
              centered
            />
          </ScrollReveal>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : items.length === 0 ? (
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
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {items.map((item, index) => (
                <ScrollReveal key={item.id} variant="fade-up" delay={index * 80}>
                  <div className="group bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden flex flex-col h-full">
                    {/* Image */}
                    {item.image_url ? (
                      <div className="aspect-square bg-secondary/20 overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-secondary/20 flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {item.category && (
                        <span className="text-xs font-medium text-primary mb-2">{item.category}</span>
                      )}
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                        <span className="text-lg font-semibold text-foreground">
                          ${Number(item.price).toFixed(2)}
                        </span>
                        {item.purchase_link && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => window.open(item.purchase_link!, '_blank')}
                            className="gap-2"
                          >
                            Buy Now
                            <ExternalLink size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
