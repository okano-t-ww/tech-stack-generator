import type { IconifyId, IconUrl, IconSize } from '../model/types';
import { validateIconSize } from '../model/types';

/**
 * Iconify API連携サービス
 *
 * Iconifyアイコンの取得・検証機能を提供
 */
export class IconifyService {
  private static readonly BASE_URL = 'https://api.iconify.design' as const;
  private static readonly DEFAULT_SIZE: IconSize = 48 as IconSize;

  /**
   * アイコンURLを生成
   *
   * @param iconifyId - Iconify ID (例: "logos:react")
   * @param size - アイコンサイズ (デフォルト: 48, 範囲: 16-512)
   * @returns アイコンのSVG URL
   */
  static getIconUrl(iconifyId: IconifyId, size: IconSize = this.DEFAULT_SIZE): IconUrl {
    // サイズのバリデーション（安全性のため）
    const validatedSize = validateIconSize(size);
    const url = `${this.BASE_URL}/${iconifyId}.svg?width=${validatedSize}&height=${validatedSize}`;
    return url as IconUrl;
  }

  /**
   * 複数アイコンのURLを一括生成
   *
   * @param iconifyIds - Iconify ID配列
   * @param size - アイコンサイズ
   * @returns アイコンURL配列
   */
  static getIconUrls(iconifyIds: IconifyId[], size?: IconSize): IconUrl[] {
    return iconifyIds.map((id) => this.getIconUrl(id, size));
  }

  /**
   * アイコンの存在確認（バリデーション用）
   *
   * @param iconifyId - Iconify ID
   * @returns アイコンが存在する場合true
   */
  static async validateIcon(iconifyId: IconifyId): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/${iconifyId}.svg`, {
        method: 'HEAD',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 複数アイコンの存在確認
   *
   * @param iconifyIds - Iconify ID配列
   * @returns 各アイコンの存在確認結果
   */
  static async validateIcons(
    iconifyIds: readonly IconifyId[]
  ): Promise<ReadonlyArray<{ readonly id: IconifyId; readonly isValid: boolean }>> {
    const results = await Promise.all(
      iconifyIds.map(async (id) => ({
        id,
        isValid: await this.validateIcon(id),
      } as const))
    );
    return results;
  }
}
