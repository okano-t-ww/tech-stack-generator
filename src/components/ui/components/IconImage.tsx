"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";

interface IconImageProps {
  src: string;
  alt: string;
  size: number;
}

export const IconImage = React.memo(function IconImage({
  src,
  alt,
  size,
}: IconImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted rounded-lg border border-border/30 transition-all hover:scale-105 hover:shadow-sm"
        style={{ width: size, height: size }}
        title={`Failed to load: ${alt}`}
      >
        <ImageOff className="h-4 w-4 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className="relative group" style={{ width: size, height: size }}>
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg"
          style={{ width: size, height: size }}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className={`rounded-sm transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-lg ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
});
