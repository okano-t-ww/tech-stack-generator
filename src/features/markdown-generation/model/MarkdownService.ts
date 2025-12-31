import { TechStackService } from '@/entities/tech/model/TechStackService';
import { IconifyService } from '@/entities/tech/api/iconify';
import type { TechItem } from '@/entities/tech/model/types';

export type OutputFormat = 'single' | 'individual';

/**
 * Markdown生成サービス
 *
 * Tech StackからMarkdownを生成するロジックを提供
 */
export class MarkdownService {
  private static readonly DEFAULT_ICON_SIZE = 48;
  private static readonly ALIGNMENT = 'center';

  /**
   * 選択されたTechからMarkdownを生成
   *
   * @param selectedTechs - 選択されたTech配列
   * @param format - 出力形式
   * @param iconSize - アイコンサイズ
   * @returns 生成されたMarkdown文字列
   */
  static generate(
    selectedTechs: TechItem[],
    format: OutputFormat = 'single',
    iconSize: number = this.DEFAULT_ICON_SIZE
  ): string {
    if (selectedTechs.length === 0) {
      return '';
    }

    const icons = selectedTechs
      .map((tech) => {
        if (format === 'single') {
          return this.generateSingleIcon(tech, iconSize);
        } else {
          return this.generateLinkedIcon(tech, iconSize);
        }
      })
      .join(' ');

    return `<p align="${this.ALIGNMENT}">\n  ${icons}\n</p>`;
  }

  /**
   * リンクなしアイコンHTML生成
   */
  private static generateSingleIcon(tech: TechItem, size: number): string {
    const iconUrl = this.getIconUrl(tech, size);
    return `<img src="${iconUrl}" alt="${tech.name}" width="${size}" height="${size}" />`;
  }

  /**
   * リンク付きアイコンHTML生成
   */
  private static generateLinkedIcon(tech: TechItem, size: number): string {
    const iconUrl = this.getIconUrl(tech, size);
    const link = TechStackService.getLink(tech);
    return `<a href="${link}" target="_blank" rel="noopener noreferrer"><img src="${iconUrl}" alt="${tech.name}" width="${size}" height="${size}" /></a>`;
  }

  /**
   * TechからアイコンURLを取得
   */
  private static getIconUrl(tech: TechItem, size: number): string {
    return IconifyService.getIconUrl(tech.iconify, size);
  }

  /**
   * Markdownのプレビュー用HTML生成
   *
   * @param markdown - Markdown文字列
   * @returns プレビュー用HTML
   */
  static generatePreviewHtml(markdown: string): string {
    return markdown;
  }
}
