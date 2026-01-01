import { useMemo } from 'react';
import * as TechStackService from "@/lib/tech-stack/service";
import * as IconifyService from "@/lib/tech-stack/iconify";
import type { TechId, IconSize } from "@/types/tech";
import { isSome, toNullable } from "@/lib/fp-types";

/**
 * Techアイコン表示用のカスタムフック
 *
 * Tech IDからアイコン情報を取得
 */
export function useTechIcon(techId: TechId, size: IconSize = 48 as IconSize) {
  const techOption = useMemo(
    () => TechStackService.getById(techId),
    [techId]
  );

  const iconUrl = useMemo(() => {
    if (isSome(techOption)) {
      return IconifyService.getIconUrl(techOption.value.iconify, size);
    }
    // Techが見つからない場合はフォールバック
    return IconifyService.getIconUrl(`logos:${techId}` as any, size);
  }, [techOption, techId, size]);

  const tech = toNullable(techOption);

  return {
    tech,
    iconUrl,
    name: tech?.name || techId,
    iconifyId: tech?.iconify || `logos:${techId}`,
  };
}
