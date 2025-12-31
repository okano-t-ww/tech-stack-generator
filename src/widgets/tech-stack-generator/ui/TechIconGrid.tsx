"use client";

import { TECH_STACK } from "@/entities/tech";

type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

interface TechIconGridProps {
  iconIds: string[];
  size?: number;
  perLine?: PerLine;
}

export default function TechIconGrid({
  iconIds,
  size = 48,
  perLine = 10,
}: TechIconGridProps) {
  if (iconIds.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-muted-foreground">
        Please select icons
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
          <div
            key={iconId}
            className="flex items-center justify-center transition-transform hover:scale-110"
            style={{ width: size, height: size }}
          >
            <img
              src={iconUrl}
              alt={tech?.name || iconId}
              width={size}
              height={size}
            />
          </div>
        );
      })}
    </div>
  );
}
