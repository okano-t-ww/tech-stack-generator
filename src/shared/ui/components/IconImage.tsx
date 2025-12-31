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
        className="flex items-center justify-center bg-muted rounded transition-transform hover:scale-110"
        style={{ width: size, height: size }}
        title={`Failed to load: ${alt}`}
      >
        <ImageOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-muted rounded"
          style={{ width: size, height: size }}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className={`transition-all duration-200 hover:scale-110 ${
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
