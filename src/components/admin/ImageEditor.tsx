import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Crop as CropIcon, Maximize2, RotateCcw, Check, X } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (croppedImageUrl: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function ImageEditor({ imageUrl, open, onOpenChange, onSave }: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Start with a centered crop
    const crop = centerAspectCrop(width, height, 16 / 9);
    setCrop(crop);
  }, []);

  const handleReset = () => {
    setScale(1);
    setAspect(undefined);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const getCroppedImg = async (): Promise<string> => {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      return imageUrl;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(imageUrl);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, 'image/jpeg', 0.9);
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const croppedUrl = await getCroppedImg();
      onSave(croppedUrl);
      onOpenChange(false);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const setAspectRatio = (ratio: number | undefined) => {
    setAspect(ratio);
    if (ratio && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, ratio));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon size={20} />
            Edit Image
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* Crop Area */}
          <div className="flex justify-center bg-secondary/30 rounded-lg p-4 min-h-[300px]">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-h-[50vh]"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Edit"
                style={{ transform: `scale(${scale})` }}
                onLoad={onImageLoad}
                className="max-h-[50vh] object-contain"
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>

          {/* Controls */}
          <div className="space-y-4 mt-4">
            {/* Aspect Ratio Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Aspect Ratio</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={aspect === undefined ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio(undefined)}
                >
                  Free
                </Button>
                <Button
                  type="button"
                  variant={aspect === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio(1)}
                >
                  1:1
                </Button>
                <Button
                  type="button"
                  variant={aspect === 4 / 3 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio(4 / 3)}
                >
                  4:3
                </Button>
                <Button
                  type="button"
                  variant={aspect === 16 / 9 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio(16 / 9)}
                >
                  16:9
                </Button>
                <Button
                  type="button"
                  variant={aspect === 3 / 4 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio(3 / 4)}
                >
                  3:4
                </Button>
                <Button
                  type="button"
                  variant={aspect === 9 / 16 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio(9 / 16)}
                >
                  9:16
                </Button>
              </div>
            </div>

            {/* Scale/Zoom */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Maximize2 size={16} />
                Zoom: {Math.round(scale * 100)}%
              </Label>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full max-w-xs"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              type="button"
              variant="hero"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Check size={16} />
              {isSaving ? 'Saving...' : 'Apply Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}