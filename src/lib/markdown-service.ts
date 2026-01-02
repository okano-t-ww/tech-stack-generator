import * as TechStackService from "@/lib/tech-stack/service";
import * as IconifyService from "@/lib/tech-stack/iconify";
import type { TechItem, IconSize } from "@/types/tech";

/**
 * Markdown生成サービス
 *
 * Tech StackからMarkdownを生成するロジックを提供
 */

const DEFAULT_ICON_SIZE: IconSize = 48 as IconSize;
const ALIGNMENT = "center" as const;

/**
 * リンク付きアイコンHTML生成
 */
const generateLinkedIcon = (tech: TechItem, size: IconSize): string => {
  const iconUrl = IconifyService.getIconUrl(tech.iconify, size);
  const link = TechStackService.getLink(tech);
  return `<a href="${link}" target="_blank" rel="noopener noreferrer"><img src="${iconUrl}" alt="${tech.name}" width="${size}" height="${size}" /></a>`;
};

/**
 * 選択されたTechからMarkdownを生成
 *
 * @param selectedTechs - 選択されたTech配列
 * @param iconSize - アイコンサイズ
 * @returns 生成されたMarkdown文字列
 */
export const generate = (
  selectedTechs: readonly TechItem[],
  iconSize: IconSize = DEFAULT_ICON_SIZE
): string => {
  if (selectedTechs.length === 0) {
    return "";
  }

  const icons = selectedTechs.map((tech) => generateLinkedIcon(tech, iconSize)).join(" ");

  return `<p align="${ALIGNMENT}">\n  ${icons}\n</p>`;
};
