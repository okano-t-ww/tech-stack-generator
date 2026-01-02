import type { IconifyId, IconUrl, IconSize, TechItem } from "@/types/tech";
import { validateIconSize } from "@/types/tech";

/**
 * Iconify API連携サービス
 *
 * Iconifyアイコンの取得・検証機能を提供
 */

const BASE_URL = "https://api.iconify.design" as const;
const DEFAULT_SIZE: IconSize = 48 as IconSize;

/**
 * アイコンURLを生成
 *
 * @param iconifyId - Iconify ID (例: "logos:react")
 * @param size - アイコンサイズ (デフォルト: 48, 範囲: 16-512)
 * @returns アイコンのSVG URL
 */
export const getIconUrl = (iconifyId: IconifyId, size: IconSize = DEFAULT_SIZE): IconUrl => {
  // サイズのバリデーション（安全性のため）
  const validatedSize = validateIconSize(size);
  const url = `${BASE_URL}/${iconifyId}.svg?width=${validatedSize}&height=${validatedSize}`;
  return url as IconUrl;
};

/**
 * ダークモード対応のアイコンURLを生成
 *
 * @param tech - TechItemオブジェクト
 * @param size - アイコンサイズ (デフォルト: 48, 範囲: 16-512)
 * @param isDark - ダークモードかどうか (デフォルト: false)
 * @returns アイコンのSVG URL
 */
export const getIconUrlWithTheme = (
  tech: TechItem,
  size: IconSize = DEFAULT_SIZE,
  isDark: boolean = false
): IconUrl => {
  const iconifyId = isDark && tech.iconifyDark ? tech.iconifyDark : tech.iconify;
  return getIconUrl(iconifyId, size);
};

/**
 * 複数アイコンのURLを一括生成
 *
 * @param iconifyIds - Iconify ID配列
 * @param size - アイコンサイズ
 * @returns アイコンURL配列
 */
export const getIconUrls = (
  iconifyIds: readonly IconifyId[],
  size?: IconSize
): readonly IconUrl[] => {
  return iconifyIds.map((id) => getIconUrl(id, size));
};

/**
 * アイコンの存在確認（バリデーション用）
 *
 * @param iconifyId - Iconify ID
 * @returns アイコンが存在する場合true
 */
export const validateIcon = async (iconifyId: IconifyId): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/${iconifyId}.svg`, {
      method: "HEAD",
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * 複数アイコンの存在確認
 *
 * @param iconifyIds - Iconify ID配列
 * @returns 各アイコンの存在確認結果
 */
export const validateIcons = async (
  iconifyIds: readonly IconifyId[]
): Promise<ReadonlyArray<{ readonly id: IconifyId; readonly isValid: boolean }>> => {
  const results = await Promise.all(
    iconifyIds.map(
      async (id) =>
        ({
          id,
          isValid: await validateIcon(id),
        }) as const
    )
  );
  return results;
};
