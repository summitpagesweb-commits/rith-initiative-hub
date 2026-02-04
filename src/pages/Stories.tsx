import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { BlogDetailModal } from "@/components/shared/BlogDetailModal";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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

function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30">
      <div className="container-wide">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Our <span className="text-primary">Stories</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed italic">
              Discover the latest news, updates, and inspiring stories from The Rith Initiative 
              community. Stay connected with our cultural journey.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StoriesSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean))) as string[];
  const filteredPosts = selectedCategory 
    ? posts.filter(p => p.category === selectedCategory)
    : posts;

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Category Filter */}
        {categories.length > 0 && (
          <ScrollReveal variant="fade-up">
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <Button
                variant={selectedCategory === null ? "hero" : "subtle"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Stories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "hero" : "subtle"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
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
            <p className="text-muted-foreground mb-4">No stories yet. Check back soon!</p>
            <Button variant="subtle" asChild>
              <Link to="/">
                Back to Home
                <ArrowRight size={16} />
              </Link>
            </Button>
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

function CTASection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-narrow text-center">
        <ScrollReveal variant="fade-up">
          <SectionHeading 
            title="Stay Connected" 
            subtitle="Want to be the first to know about our stories and updates?"
            centered 
          />
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Get In Touch
              <ArrowRight size={20} />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

const Stories = () => {
  return (
    <Layout>
      <HeroSection />
      <SectionDivider />
      <StoriesSection />
      <SectionDivider />
      <CTASection />
    </Layout>
  );
};

export default Stories;
