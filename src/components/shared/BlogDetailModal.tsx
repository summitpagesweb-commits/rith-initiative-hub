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
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {post.category && (
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {post.category}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <DialogTitle className="text-xl font-heading leading-tight">
                {post.title}
              </DialogTitle>
              {post.author_name && (
                <p className="text-sm text-muted-foreground">By {post.author_name}</p>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Content - Compact excerpt style */}
        <div className="px-6 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {post.excerpt || post.content.substring(0, 200)}
          </p>
        </div>

        {/* Media Gallery - Clean masonry-style grid */}
        {media.length > 0 && (
          <div className="px-6 pb-4">
            <div className={`grid gap-2 ${
              media.length === 1 ? 'grid-cols-1' : 
              media.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2 md:grid-cols-3'
            }`}>
              {media.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`relative rounded-xl overflow-hidden bg-secondary/30 ${
                    media.length === 1 ? 'aspect-video' :
                    media.length === 2 ? 'aspect-square' :
                    index === 0 && media.length > 2 ? 'col-span-2 aspect-video' : 'aspect-square'
                  }`}
                >
                  {item.media_type === 'image' && (
                    <img
                      src={item.url}
                      alt={item.title || 'Blog media'}
                      className="w-full h-full object-contain bg-secondary/20"
                    />
                  )}
                  {item.media_type === 'video' && (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-contain bg-black"
                    />
                  )}
                  {item.media_type === 'link' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center h-full gap-2 p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ExternalLink size={18} className="text-primary" />
                      </div>
                      <span className="text-xs text-center text-muted-foreground line-clamp-2">
                        {item.title || 'View Link'}
                      </span>
                    </a>
                  )}
                  {item.title && item.media_type !== 'link' && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-xs text-white truncate">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer with Like */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/20">
          <Button
            variant={hasLiked ? "default" : "ghost"}
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={`gap-2 ${hasLiked ? '' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Heart size={16} className={hasLiked ? "fill-current" : ""} />
            <span className="text-sm">{likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
