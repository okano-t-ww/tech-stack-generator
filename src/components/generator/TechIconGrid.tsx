"use client";

import { Icon } from "@iconify/react";
import { getIconifyIcon } from "@/lib/iconMapping";
import type { IconTheme, PerLine } from "@/types/tech";

interface TechIconGridProps {
  /** アイコンIDの配列 */
  iconIds: string[];
  /** アイコンサイズ (px) */
  size?: number;
  /** テーマ */
  theme?: IconTheme;
  /** 1行あたりのアイコン数 */
  perLine?: PerLine;
}

export default function TechIconGrid({
  iconIds,
  size = 48,
  theme = "dark",
  perLine = 10,
}: TechIconGridProps) {
  if (iconIds.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-muted-foreground">
        アイコンを選択してください
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
        const iconifyIcon = getIconifyIcon(iconId);
        return (
          <div
            key={iconId}
            className="flex items-center justify-center transition-transform hover:scale-110"
            style={{ width: size, height: size }}
          >
            <Icon
              icon={iconifyIcon}
              width={size}
              height={size}
              className={theme === "dark" ? "text-white" : "text-gray-900"}
            />
          </div>
        );
      })}
    </div>
  );
}
