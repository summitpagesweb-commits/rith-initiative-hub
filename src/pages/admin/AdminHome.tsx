import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Plus, ArrowRight } from 'lucide-react';

export default function AdminHome() {
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    pastEvents: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date().toISOString();

        // Fetch events stats
        const { data: upcomingEvents } = await supabase
          .from('events')
          .select('id', { count: 'exact' })
          .gte('start_date', now)
          .eq('is_archived', false);

        const { data: pastEvents } = await supabase
          .from('events')
          .select('id', { count: 'exact' })
          .lt('start_date', now)
          .eq('is_archived', false);

        // Fetch posts stats
        const { data: publishedPosts } = await supabase
          .from('blog_posts')
          .select('id', { count: 'exact' })
          .eq('is_published', true)
          .eq('is_archived', false);

        const { data: draftPosts } = await supabase
          .from('blog_posts')
          .select('id', { count: 'exact' })
          .eq('is_published', false)
          .eq('is_archived', false);

        setStats({
          upcomingEvents: upcomingEvents?.length || 0,
          pastEvents: pastEvents?.length || 0,
          publishedPosts: publishedPosts?.length || 0,
          draftPosts: draftPosts?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your events and blog posts from here.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.upcomingEvents}</p>
                <p className="text-sm text-muted-foreground">Upcoming events</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pastEvents}</p>
                <p className="text-sm text-muted-foreground">Past events</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="hero" size="sm" asChild className="flex-1">
                <Link to="/admin/events/new">
                  <Plus size={16} />
                  Add Event
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to="/admin/events">
                  View All
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.publishedPosts}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.draftPosts}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="hero" size="sm" asChild className="flex-1">
                <Link to="/admin/posts/new">
                  <Plus size={16} />
                  Add Post
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to="/admin/posts">
                  View All
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
