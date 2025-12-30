/**
 * 技術カテゴリー
 */
export enum TechCategory {
  Language = "language",
  Framework = "framework",
  Library = "library",
  Platform = "platform",
  Cloud = "cloud",
  Database = "database",
  CICD = "cicd",
  BuildTool = "buildtool",
  Other = "other",
}

/**
 * 技術スタック項目
 */
export interface TechItem {
  /** アイコンID（Iconify形式: "simple-icons:react" など） */
  id: string;
  /** 表示名 */
  name: string;
  /** カテゴリー */
  category: TechCategory;
}

/**
 * アイコンテーマ
 */
export type IconTheme = "light" | "dark";

/**
 * 1行あたりのアイコン数
 */
export type PerLine = 5 | 6 | 7 | 8 | 9 | 10;
