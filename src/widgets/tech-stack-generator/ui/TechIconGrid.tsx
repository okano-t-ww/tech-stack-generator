"use client";

import React from "react";
import { TECH_STACK } from "@/entities/tech";
import { IconImage } from "@/shared/ui/components/IconImage";

type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

interface TechIconGridProps {
  iconIds: string[];
  size?: number;
  perLine?: PerLine;
}

const TechIconGrid = React.memo(function TechIconGrid({
  iconIds,
  size = 48,
  perLine = 10,
}: TechIconGridProps) {
  if (iconIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-24 py-6 text-muted-foreground gap-3">
        <div className="w-12 h-12 rounded-lg bg-muted/40 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground/70">No technologies selected</p>
          <p className="text-xs text-muted-foreground mt-1">
            Select items below to preview them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-2 justify-center"
      style={{
        maxWidth: `${perLine * (size + 8)}px`,
      }}
    >
      {iconIds.map((iconId) => {
        const tech = TECH_STACK[iconId as keyof typeof TECH_STACK];
        const iconifyIcon = tech?.iconify || `logos:${iconId}`;
        const iconUrl = `https://api.iconify.design/${iconifyIcon}.svg?width=${size}&height=${size}`;
        return (
          <IconImage
            key={iconId}
            src={iconUrl}
            alt={tech?.name || iconId}
            size={size}
          />
        );
      })}
    </div>
  );
});

export default TechIconGrid;
