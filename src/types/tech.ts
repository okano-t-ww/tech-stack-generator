import { z } from "zod";

// ============================================
// Type-Safe Schemas
// ============================================

const TechIdSchema = z.string().min(1);
export type TechId = z.infer<typeof TechIdSchema>;

const IconifyIdSchema = z
  .string()
  .regex(/^(logos|simple-icons|devicon):[a-z0-9-]+$/, {
    message: "Iconify ID must be in format 'prefix:icon-name'",
  });
export type IconifyId = z.infer<typeof IconifyIdSchema>;

const TechLinkSchema = z.string().url();
export type TechLink = z.infer<typeof TechLinkSchema>;

const IconUrlSchema = z.string().url().startsWith("https://api.iconify.design/");
export type IconUrl = z.infer<typeof IconUrlSchema>;

const IconSizeSchema = z.number().int().min(16).max(512);
export type IconSize = z.infer<typeof IconSizeSchema>;

// ============================================
// Enums
// ============================================

export enum TechCategory {
  Language = "language",
  Framework = "framework",
  Library = "library",
  Platform = "platform",
  Cloud = "cloud",
  Database = "database",
  CICD = "cicd",
  BuildTool = "buildtool",
  Testing = "testing", // NEW
  MessageQueue = "messagequeue", // NEW
  Monitoring = "monitoring", // NEW
  Editor = "editor", // NEW
  Design = "design", // NEW
  Other = "other",
}

// ============================================
// Schemas
// ============================================

export const TechItemSchema = z.object({
  id: TechIdSchema,
  name: z.string().min(1),
  category: z.nativeEnum(TechCategory),
  iconify: IconifyIdSchema,
  iconifyDark: IconifyIdSchema.optional(),
  link: TechLinkSchema.optional(),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type TechItem = z.infer<typeof TechItemSchema>;

export type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

// ============================================
// Validation Functions
// ============================================

export const validateTechId = (id: string): TechId => TechIdSchema.parse(id);
export const validateIconifyId = (id: string): IconifyId =>
  IconifyIdSchema.parse(id);
export const validateTechLink = (url: string): TechLink =>
  TechLinkSchema.parse(url);
export const validateIconUrl = (url: string): IconUrl =>
  IconUrlSchema.parse(url);
export const validateIconSize = (size: number): IconSize =>
  IconSizeSchema.parse(size);
export const validateTechItem = (item: unknown): TechItem =>
  TechItemSchema.parse(item);
