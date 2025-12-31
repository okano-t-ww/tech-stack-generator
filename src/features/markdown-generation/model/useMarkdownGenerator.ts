import { useState, useCallback } from 'react';
import * as MarkdownService from './MarkdownService';
import type { TechItem, IconSize } from '@/entities/tech/model/types';

/**
 * Markdown生成を管理するカスタムフック
 *
 * 選択されたTechからMarkdownを生成し、コピー機能を提供
 */
export function useMarkdownGenerator() {
  const [markdown, setMarkdown] = useState<string>('');

  /**
   * Markdownを生成
   */
  const generate = useCallback(
    (selectedTechs: readonly TechItem[], iconSize: IconSize = 48 as IconSize) => {
      const result = MarkdownService.generate(selectedTechs, iconSize);
      setMarkdown(result);
      return result;
    },
    []
  );

  /**
   * Markdownをクリア
   */
  const clear = useCallback(() => {
    setMarkdown('');
  }, []);

  /**
   * クリップボードにコピー
   */
  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!markdown) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(markdown);
      return true;
    } catch {
      return false;
    }
  }, [markdown]);

  return {
    markdown,
    generate,
    clear,
    copyToClipboard,
    hasMarkdown: markdown.length > 0,
  };
}
