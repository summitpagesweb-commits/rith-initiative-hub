import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Video, Image, Upload, X, Save, Loader2 } from "lucide-react";
import { SimpleMediaUpload } from "@/components/admin/SimpleMediaUpload";

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
}

export default function AdminSiteContent() {
  const [eventHighlights, setEventHighlights] = useState<SiteContent | null>(null);
  const [homeGallery, setHomeGallery] = useState<SiteContent | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

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

      // Fetch gallery images
      const { data: images, error: imagesError } = await supabase
        .from('site_gallery')
        .select('*')
        .eq('section_key', 'home_gallery')
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;
      setGalleryImages(images || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load site content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVideo = async () => {
    if (!eventHighlights) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ video_url: videoUrl || null })
        .eq('section_key', 'event_highlights');

      if (error) throw error;
      toast.success('Event highlights video saved!');
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    } finally {
      setIsSaving(false);
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

        <TabsContent value="highlights">
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
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Moments From Our Events Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload images to display in the "Moments From Our Events" gallery on the Home page.
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
                  {uploadingImages ? 'Uploading...' : 'Upload Images'}
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
                  {galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} uploaded
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
                <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No gallery images uploaded yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload images to showcase moments from your events
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
