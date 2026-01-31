import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Video, Image, Upload, X, Save, Loader2, Plus, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SiteContent {
  id: string;
  section_key: string;
  title: string | null;
  description: string | null;
  content_type: string;
  video_url: string | null;
  is_active: boolean;
}

interface GalleryImage {
  id: string;
  section_key: string;
  url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  source?: 'gallery' | 'event_media';
}

interface HighlightMedia {
  id: string;
  url: string;
  media_type: string;
  title: string | null;
}

export default function AdminSiteContent() {
  const [eventHighlights, setEventHighlights] = useState<SiteContent | null>(null);
  const [homeGallery, setHomeGallery] = useState<SiteContent | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [highlightMedia, setHighlightMedia] = useState<HighlightMedia[]>([]);
  const [eventMediaImages, setEventMediaImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingHighlightMedia, setUploadingHighlightMedia] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch site content
      const { data: content, error: contentError } = await supabase
        .from('site_content')
        .select('*');

      if (contentError) throw contentError;

      const highlights = content?.find(c => c.section_key === 'event_highlights');
      const gallery = content?.find(c => c.section_key === 'home_gallery');

      setEventHighlights(highlights || null);
      setHomeGallery(gallery || null);
      setVideoUrl(highlights?.video_url || "");

      // Fetch dedicated gallery images from site_gallery
      const { data: siteGalleryImages, error: imagesError } = await supabase
        .from('site_gallery')
        .select('*')
        .eq('section_key', 'home_gallery')
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;
      
      const galleryWithSource = (siteGalleryImages || []).map(img => ({
        ...img,
        source: 'gallery' as const
      }));
      setGalleryImages(galleryWithSource);

      // Fetch event media images (fallback source shown on homepage if gallery is empty)
      const { data: eventMedia, error: eventMediaError } = await supabase
        .from('media')
        .select('*')
        .eq('media_type', 'image')
        .order('created_at', { ascending: false })
        .limit(12);

      if (!eventMediaError && eventMedia) {
        setEventMediaImages(eventMedia.map((img, idx) => ({
          id: img.id,
          section_key: 'event_media',
          url: img.url,
          title: img.title,
          description: img.description,
          display_order: idx,
          source: 'event_media' as const
        })));
      }

      // Fetch highlight media
      const { data: highlightMediaData, error: highlightError } = await supabase
        .from('media')
        .select('*')
        .eq('entity_type', 'event_highlights')
        .order('display_order', { ascending: true });

      if (!highlightError) {
        setHighlightMedia(highlightMediaData || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load site content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVideo = async () => {
    setIsSaving(true);
    try {
      // Upsert the video URL
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section_key: 'event_highlights',
          video_url: videoUrl || null,
          content_type: 'video',
          is_active: true
        }, { onConflict: 'section_key' });

      if (error) throw error;
      toast.success('Event highlights video saved!');
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHighlightMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingHighlightMedia(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `highlights/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const isVideo = file.type.startsWith('video/');

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        // Insert into media table for highlights
        const { error: insertError } = await supabase
          .from('media')
          .insert({
            entity_type: 'event_highlights',
            entity_id: 'global',
            url: urlData.publicUrl,
            media_type: isVideo ? 'video' : 'image',
            display_order: highlightMedia.length
          });

        if (insertError) throw insertError;
      }

      toast.success('Media uploaded successfully!');
      fetchContent();
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploadingHighlightMedia(false);
      e.target.value = '';
    }
  };

  const handleDeleteHighlightMedia = async (id: string, url: string) => {
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Try to delete from storage
      const path = url.split('/images/')[1];
      if (path) {
        await supabase.storage.from('images').remove([path]);
      }

      setHighlightMedia(prev => prev.filter(item => item.id !== id));
      toast.success('Media removed');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  const handleAddEventMediaToGallery = async (image: GalleryImage) => {
    try {
      const { error } = await supabase
        .from('site_gallery')
        .insert({
          section_key: 'home_gallery',
          url: image.url,
          title: image.title,
          description: image.description,
          display_order: galleryImages.length
        });

      if (error) throw error;
      toast.success('Image added to gallery!');
      fetchContent();
    } catch (error) {
      console.error('Error adding to gallery:', error);
      toast.error('Failed to add image to gallery');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        // Insert into gallery
        const { error: insertError } = await supabase
          .from('site_gallery')
          .insert({
            section_key: 'home_gallery',
            url: urlData.publicUrl,
            display_order: galleryImages.length
          });

        if (insertError) throw insertError;
      }

      toast.success('Images uploaded successfully!');
      fetchContent();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (id: string, url: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('site_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Try to delete from storage
      const path = url.split('/images/')[1];
      if (path) {
        await supabase.storage.from('images').remove([path]);
      }

      setGalleryImages(prev => prev.filter(img => img.id !== id));
      toast.success('Image removed');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Site Content</h1>
        <p className="text-muted-foreground">Manage content sections across the website</p>
      </div>

      <Tabs defaultValue="highlights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="highlights" className="gap-2">
            <Video size={16} />
            Event Highlights
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <Image size={16} />
            Home Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="highlights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Event Highlights Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add a YouTube or Vimeo video URL to display in the "Event Highlights" section on the Events page.
              </p>
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  type="url"
                  placeholder="https://www.youtube.com/embed/... or https://player.vimeo.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use the embed URL format. For YouTube: youtube.com/embed/VIDEO_ID. For Vimeo: player.vimeo.com/video/VIDEO_ID
                </p>
              </div>
              <Button onClick={handleSaveVideo} disabled={isSaving} variant="hero">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Video
                  </>
                )}
              </Button>

              {videoUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="aspect-video max-w-2xl rounded-lg overflow-hidden border border-border">
                    <iframe
                      src={videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Event Highlights Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload images or videos to display alongside the main video in the Event Highlights section.
              </p>

              <div className="flex items-center gap-4">
                <Label
                  htmlFor="highlight-media-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  {uploadingHighlightMedia ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploadingHighlightMedia ? 'Uploading...' : 'Upload Media'}
                </Label>
                <input
                  id="highlight-media-upload"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleHighlightMediaUpload}
                  disabled={uploadingHighlightMedia}
                />
                <span className="text-sm text-muted-foreground">
                  {highlightMedia.length} item{highlightMedia.length !== 1 ? 's' : ''} uploaded
                </span>
              </div>

              {highlightMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {highlightMedia.map((item) => (
                    <div key={item.id} className="relative group">
                      {item.media_type === 'video' ? (
                        <video
                          src={item.url}
                          className="w-full aspect-square object-cover rounded-lg border border-border"
                          controls
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title || 'Highlight media'}
                          className="w-full aspect-square object-cover rounded-lg border border-border"
                        />
                      )}
                      <button
                        onClick={() => handleDeleteHighlightMedia(item.id, item.url)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <Image className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No highlight media uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Moments From Our Events Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage images displayed in the "Moments From Our Events" gallery on the Home page.
              </p>

              <div className="flex items-center gap-4">
                <Label
                  htmlFor="gallery-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  {uploadingImages ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploadingImages ? 'Uploading...' : 'Upload New Images'}
                </Label>
                <input
                  id="gallery-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
                <span className="text-sm text-muted-foreground">
                  {galleryImages.length} curated image{galleryImages.length !== 1 ? 's' : ''}
                </span>
              </div>

              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.title || 'Gallery image'}
                        className="w-full aspect-square object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => handleDeleteImage(image.id, image.url)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <Image className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No curated gallery images yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload images or add from event media below
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Media Section - Shows images from events that can be added to gallery */}
          {eventMediaImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Image className="h-5 w-5 text-muted-foreground" />
                  Available Event Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    These images are from your events. Click the + button to add them to the curated gallery above.
                    {galleryImages.length === 0 && (
                      <span className="block mt-1 font-medium">
                        Currently, the homepage is showing these event images as a fallback since no curated gallery exists.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {eventMediaImages.map((image) => {
                    const isAlreadyInGallery = galleryImages.some(g => g.url === image.url);
                    return (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.title || 'Event media'}
                          className={`w-full aspect-square object-cover rounded-lg border ${
                            isAlreadyInGallery ? 'border-primary/50 opacity-60' : 'border-border'
                          }`}
                        />
                        {!isAlreadyInGallery && (
                          <button
                            onClick={() => handleAddEventMediaToGallery(image)}
                            className="absolute top-2 right-2 p-1.5 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Add to gallery"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                        {isAlreadyInGallery && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                              In Gallery
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
