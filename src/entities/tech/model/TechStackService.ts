import { TECH_STACK, TECH_STACK_LIST } from './techStackData';
import type { TechItem, TechCategory, TechId } from './types';
import { fromNullable, type Option } from '@/shared/lib';

/**
 * Tech Stack管理サービス
 *
 * データアクセス・検索・フィルタリングロジックを提供
 * すべてのTech Stack関連の操作はこのサービスを通じて行う
 */
export class TechStackService {
  /**
   * IDからTech情報を取得
   *
   * @param id - Tech ID
   * @returns Tech情報のOption型（存在しない場合はNone）
   */
  static getById(id: TechId): Option<TechItem> {
    const tech = TECH_STACK[id as keyof typeof TECH_STACK];
    return fromNullable(tech);
  }

  /**
   * カテゴリでフィルタリング
   *
   * @param categories - フィルタリングするカテゴリ配列
   * @returns フィルタリングされたTech配列（不変）
   */
  static filterByCategories(categories: readonly TechCategory[]): readonly TechItem[] {
    return TECH_STACK_LIST.filter((tech) => categories.includes(tech.category));
  }

  /**
   * キーワード検索
   *
   * @param keyword - 検索キーワード
   * @returns 検索結果のTech配列（不変）
   */
  static search(keyword: string): readonly TechItem[] {
    const query = keyword.toLowerCase();
    return TECH_STACK_LIST.filter((tech) =>
      tech.name.toLowerCase().includes(query)
    );
  }

  /**
   * Tech のリンクURLを取得
   * リンクが定義されていない場合はフォールバックURLを返す
   *
   * @param tech - Tech情報
   * @returns リンクURL
   */
  static getLink(tech: TechItem): string {
    if ('link' in tech && tech.link) {
      return tech.link;
    }
    // フォールバック: Simple Icons検索
    return `https://simpleicons.org/?q=${encodeURIComponent(tech.name)}`;
  }

  /**
   * 全Tech一覧を取得
   *
   * @returns 全Tech配列
   */
  static getAll(): TechItem[] {
    return TECH_STACK_LIST;
  }

  /**
   * Tech IDのリストを取得
   *
   * @returns 全Tech IDの配列
   */
  static getAllIds(): TechId[] {
    return TECH_STACK_LIST.map((tech) => tech.id);
  }

  /**
   * カテゴリごとにグループ化
   *
   * @returns カテゴリをキーとしたTech配列のマップ
   */
  static groupByCategory(): Record<TechCategory, TechItem[]> {
    return TECH_STACK_LIST.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    }, {} as Record<TechCategory, TechItem[]>);
  }
}
