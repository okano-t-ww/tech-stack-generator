import { useState, useCallback } from 'react';
import * as MarkdownService from './MarkdownService';
import type { OutputFormat } from './MarkdownService';
import type { TechItem, IconSize } from '@/entities/tech/model/types';

/**
 * Markdown生成を管理するカスタムフック
 *
 * 選択されたTechからMarkdownを生成し、コピー機能を提供
 */
export function useMarkdownGenerator() {
  const [markdown, setMarkdown] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('single');

  /**
   * Markdownを生成
   */
  const generate = useCallback(
    (selectedTechs: readonly TechItem[], iconSize: IconSize = 48 as IconSize) => {
      const result = MarkdownService.generate(selectedTechs, outputFormat, iconSize);
      setMarkdown(result);
      return result;
    },
    [outputFormat]
  );

  /**
   * 出力形式を変更
   */
  const changeFormat = useCallback((format: OutputFormat) => {
    setOutputFormat(format);
  }, []);

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
    outputFormat,
    generate,
    changeFormat,
    clear,
    copyToClipboard,
    hasMarkdown: markdown.length > 0,
  };
}
