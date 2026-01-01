"use client";

import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";

interface IconImageProps {
  src: string;
  srcDark?: string;
  alt: string;
  size: number;
}

export const IconImage = React.memo(
  function IconImage({ src, srcDark, alt, size }: IconImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isDark, setIsDark] = useState(() => {
      // Initialize with current dark mode state (client-side only)
      if (typeof window !== "undefined") {
        return document.documentElement.classList.contains("dark");
      }
      return false;
    });

    useEffect(() => {
      // Check if dark mode is enabled
      const checkDarkMode = () => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
      };

      checkDarkMode();

      // Watch for theme changes
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    // Calculate current src based on dark mode
    const currentSrc = isDark && srcDark ? srcDark : src;

    // Reset loading/error state when currentSrc changes
    useEffect(() => {
      setIsLoading(true);
      setHasError(false);
    }, [currentSrc]);

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
        src={currentSrc}
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
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    // Re-render if any prop changes
    return (
      prevProps.src === nextProps.src &&
      prevProps.srcDark === nextProps.srcDark &&
      prevProps.alt === nextProps.alt &&
      prevProps.size === nextProps.size
    );
  }
);
