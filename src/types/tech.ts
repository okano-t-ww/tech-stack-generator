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

export interface TechItem {
  id: string;
  name: string;
  category: TechCategory;
}

export type PerLine = 5 | 6 | 7 | 8 | 9 | 10;
