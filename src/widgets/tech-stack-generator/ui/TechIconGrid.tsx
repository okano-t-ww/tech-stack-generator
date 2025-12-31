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
      <div className="flex flex-col items-center justify-center h-20 text-muted-foreground gap-2">
        <p>No icons selected</p>
        <p className="text-xs">
          Click any technology below to add it to the preview
        </p>
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
