import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Heart, Play, ExternalLink, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MediaItem {
  id: string;
  media_type: string;
  url: string;
  title: string | null;
  description: string | null;
}

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

interface BlogDetailModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Get or create a session ID for anonymous likes
const getSessionId = () => {
  let sessionId = localStorage.getItem('blog_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('blog_session_id', sessionId);
  }
  return sessionId;
};

export function BlogDetailModal({ post, open, onOpenChange }: BlogDetailModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (post && open) {
      fetchMedia();
      fetchLikes();
    }
  }, [post, open]);

  const fetchMedia = async () => {
    if (!post) return;
    
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('entity_type', 'blog_post')
      .eq('entity_id', post.id)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setMedia(data);
    }
  };

  const fetchLikes = async () => {
    if (!post) return;
    
    const sessionId = getSessionId();
    
    // Get total likes count
    const { count } = await supabase
      .from('blog_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id);

    setLikesCount(count || 0);

    // Check if current session has liked
    const { data } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('session_id', sessionId)
      .maybeSingle();

    setHasLiked(!!data);
  };

  const handleLike = async () => {
    if (!post || isLiking) return;
    
    setIsLiking(true);
    const sessionId = getSessionId();

    try {
      if (hasLiked) {
        // Unlike
        await supabase
          .from('blog_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('session_id', sessionId);
        
        setLikesCount(prev => Math.max(0, prev - 1));
        setHasLiked(false);
      } else {
        // Like
        await supabase
          .from('blog_likes')
          .insert({ post_id: post.id, session_id: sessionId });
        
        setLikesCount(prev => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={16} />;
      case 'link': return <ExternalLink size={16} />;
      default: return <Image size={16} />;
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              {post.category && (
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {post.category}
                </span>
              )}
              <DialogTitle className="text-2xl font-heading mt-1">
                {post.title}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                {post.author_name && <span>By {post.author_name}</span>}
                <span>
                  {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Content */}
          <div className="prose prose-sm max-w-none text-foreground">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Media Gallery */}
          {media.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground">Media</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.map((item) => (
                  <div key={item.id} className="space-y-2">
                    {item.media_type === 'image' && (
                      <img
                        src={item.url}
                        alt={item.title || 'Blog media'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    {item.media_type === 'video' && (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    {item.media_type === 'link' && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <ExternalLink size={16} className="text-primary" />
                        <span className="text-sm truncate">
                          {item.title || item.url}
                        </span>
                      </a>
                    )}
                    {item.title && item.media_type !== 'link' && (
                      <p className="text-xs text-muted-foreground truncate">{item.title}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Like Button */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className="gap-2"
            >
              <Heart size={16} className={hasLiked ? "fill-current" : ""} />
              {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
