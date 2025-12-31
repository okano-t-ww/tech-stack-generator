import * as TechStackService from '@/entities/tech/model/TechStackService';
import * as IconifyService from '@/entities/tech/api/iconify';
import type { TechItem, IconSize } from '@/entities/tech/model/types';

export type OutputFormat = 'single' | 'individual';

/**
 * Markdown生成サービス
 *
 * Tech StackからMarkdownを生成するロジックを提供
 */

const DEFAULT_ICON_SIZE: IconSize = 48 as IconSize;
const ALIGNMENT = 'center' as const;

/**
 * リンクなしアイコンHTML生成
 */
const generateSingleIcon = (tech: TechItem, size: IconSize): string => {
  const iconUrl = IconifyService.getIconUrl(tech.iconify, size);
  return `<img src="${iconUrl}" alt="${tech.name}" width="${size}" height="${size}" />`;
};

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
 * @param format - 出力形式
 * @param iconSize - アイコンサイズ
 * @returns 生成されたMarkdown文字列
 */
export const generate = (
  selectedTechs: readonly TechItem[],
  format: OutputFormat = 'single',
  iconSize: IconSize = DEFAULT_ICON_SIZE
): string => {
  if (selectedTechs.length === 0) {
    return '';
  }

  const icons = selectedTechs
    .map((tech) => {
      if (format === 'single') {
        return generateSingleIcon(tech, iconSize);
      } else {
        return generateLinkedIcon(tech, iconSize);
      }
    })
    .join(' ');

  return `<p align="${ALIGNMENT}">\n  ${icons}\n</p>`;
};

/**
 * Markdownのプレビュー用HTML生成
 *
 * @param markdown - Markdown文字列
 * @returns プレビュー用HTML
 */
export const generatePreviewHtml = (markdown: string): string => {
  return markdown;
};
