import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SimpleMediaUpload, SimpleMediaItem } from '@/components/admin/SimpleMediaUpload';

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  time: string;
  location: string;
  category: string;
  registration_link: string;
  capacity: string;
  featured_image_url: string;
}

export default function AdminEventForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [mediaItems, setMediaItems] = useState<SimpleMediaItem[]>([]);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    time: '',
    location: '',
    category: '',
    registration_link: '',
    capacity: '',
    featured_image_url: '',
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchEvent = async () => {
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              start_date: data.start_date ? data.start_date.split('T')[0] : '',
              end_date: data.end_date ? data.end_date.split('T')[0] : '',
              time: data.time || '',
              location: data.location || '',
              category: data.category || '',
              registration_link: data.registration_link || '',
              capacity: data.capacity?.toString() || '',
              featured_image_url: data.featured_image_url || '',
            });
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          toast({
            title: 'Error',
            description: 'Failed to load event.',
            variant: 'destructive',
          });
        } finally {
          setIsFetching(false);
        }
      };

      fetchEvent();
    }
  }, [id, isEditing, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = useCallback((media: SimpleMediaItem[]) => {
    setMediaItems(media);
  }, []);

  // Helper function to convert date string to ISO without timezone shift
  const dateToISO = (dateStr: string): string => {
    // Append T12:00:00 to avoid timezone boundary issues
    return new Date(`${dateStr}T12:00:00`).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.start_date) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in the title and start date.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        start_date: dateToISO(formData.start_date),
        end_date: formData.end_date ? dateToISO(formData.end_date) : null,
        time: formData.time || null,
        location: formData.location || null,
        category: formData.category || null,
        registration_link: formData.registration_link || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        featured_image_url: formData.featured_image_url || null,
        created_by: user?.id,
      };

      let eventId = id;

      if (isEditing && id) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select('id')
          .single();

        if (error) throw error;
        eventId = data.id;
      }

      // Save media items
      if (eventId) {
        // Get existing media to compare
        const { data: existingMedia } = await supabase
          .from('media')
          .select('id')
          .eq('entity_type', 'event')
          .eq('entity_id', eventId);

        const existingIds = new Set((existingMedia || []).map(m => m.id));
        const currentIds = new Set(mediaItems.filter(m => m.id).map(m => m.id));

        // Delete removed media
        const toDelete = [...existingIds].filter(id => !currentIds.has(id));
        if (toDelete.length > 0) {
          await supabase.from('media').delete().in('id', toDelete);
        }

        // Insert/update media items
        for (const item of mediaItems) {
          if (!item.url) continue;

          const mediaData = {
            entity_type: 'event' as const,
            entity_id: eventId,
            media_type: item.media_type,
            url: item.url,
            title: null,
            description: null,
            display_order: item.display_order,
            created_by: user?.id,
          };

          if (item.id) {
            await supabase
              .from('media')
              .update(mediaData)
              .eq('id', item.id);
          } else {
            await supabase.from('media').insert([mediaData]);
          }
        }
      }

      toast({
        title: isEditing ? 'Event updated' : 'Event created',
        description: `The event has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });

      navigate('/admin/events');
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/events">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {isEditing ? 'Edit Event' : 'Create Event'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditing ? 'Update event details' : 'Add a new event to the calendar'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event description..."
              rows={4}
            />
          </div>

          {/* Featured Image Upload */}
          <ImageUpload
            value={formData.featured_image_url}
            onChange={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
            label="Featured Image (Hero Image)"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="e.g., 10:00 AM - 2:00 PM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Event location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Festival, Workshop, Music"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration_link">Registration Link</Label>
            <Input
              id="registration_link"
              name="registration_link"
              type="url"
              value={formData.registration_link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Maximum attendees"
            />
          </div>

          {/* Additional Media Section */}
          <div className="pt-4 border-t border-border">
            <SimpleMediaUpload
              entityType="event"
              entityId={id}
              onMediaChange={handleMediaChange}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="hero" disabled={isLoading}>
            {isLoading ? (
              'Saving...'
            ) : (
              <>
                <Save size={18} />
                {isEditing ? 'Update Event' : 'Create Event'}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/events">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
