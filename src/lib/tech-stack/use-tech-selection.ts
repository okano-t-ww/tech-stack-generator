import { useState, useCallback, useMemo } from 'react';
import type { TechItem } from "@/types/tech";

/**
 * Tech選択状態を管理するカスタムフック
 *
 * Tech一覧から選択・選択解除・全選択などの操作を提供
 */
export function useTechSelection(initialItems: TechItem[] = []) {
  const [selected, setSelected] = useState<TechItem[]>(initialItems);

  /**
   * Techの選択/選択解除をトグル
   */
  const toggle = useCallback((tech: TechItem) => {
    setSelected((prev) =>
      prev.some((item) => item.id === tech.id)
        ? prev.filter((item) => item.id !== tech.id)
        : [...prev, tech]
    );
  }, []);

  /**
   * 指定したTech配列を全選択
   */
  const selectAll = useCallback((items: TechItem[]) => {
    setSelected(items);
  }, []);

  /**
   * 選択を全てクリア
   */
  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  /**
   * 指定したTechが選択されているか確認
   */
  const isSelected = useCallback(
    (tech: TechItem) => selected.some((item) => item.id === tech.id),
    [selected]
  );

  /**
   * 選択中のTech IDリストを取得
   */
  const getSelectedIds = useCallback(
    () => selected.map((tech) => tech.id),
    [selected]
  );

  /**
   * 選択状態の統計情報
   */
  const stats = useMemo(
    () => ({
      count: selected.length,
      isEmpty: selected.length === 0,
      ids: selected.map((tech) => tech.id),
    }),
    [selected]
  );

  return {
    selected,
    toggle,
    selectAll,
    clear,
    isSelected,
    getSelectedIds,
    stats,
  };
}
