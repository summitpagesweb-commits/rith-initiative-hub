interface PlaceholderImageProps {
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  label?: string;
  className?: string;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export function PlaceholderImage({ 
  aspectRatio = "video", 
  label = "Image placeholder",
  className = ""
}: PlaceholderImageProps) {
  return (
    <div 
      className={`bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border ${aspectRatioClasses[aspectRatio]} ${className}`}
    >
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-border flex items-center justify-center">
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
