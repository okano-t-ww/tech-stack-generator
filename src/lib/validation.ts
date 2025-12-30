import { z } from "zod";
import { ICON_CONFIG } from "@/constants/iconConfig";

/**
 * Request validation schemas
 */

/**
 * Theme validation schema
 */
export const ThemeSchema = z.enum(["light", "dark"]).default("dark");

/**
 * Per-line validation schema
 */
export const PerLineSchema = z
  .number()
  .int()
  .min(ICON_CONFIG.MIN_PER_LINE)
  .max(ICON_CONFIG.MAX_PER_LINE)
  .default(ICON_CONFIG.DEFAULT_PER_LINE);

/**
 * Icon size validation schema
 */
export const IconSizeSchema = z
  .number()
  .int()
  .min(ICON_CONFIG.MIN_ICON_SIZE)
  .max(ICON_CONFIG.MAX_ICON_SIZE)
  .default(ICON_CONFIG.ICON_SIZE);

/**
 * Icon ID validation schema
 */
export const IconIdSchema = z
  .string()
  .min(1, "Icon ID must not be empty")
  .max(50, "Icon ID too long")
  .regex(/^[a-z0-9-]+$/i, "Icon ID must contain only letters, numbers, and hyphens");

/**
 * Icon IDs list validation schema
 */
export const IconIdsSchema = z
  .array(IconIdSchema)
  .min(1, "At least one icon ID is required")
  .max(ICON_CONFIG.MAX_ICONS_PER_REQUEST, `Maximum ${ICON_CONFIG.MAX_ICONS_PER_REQUEST} icons allowed`);

/**
 * Single icon request schema
 */
export const SingleIconRequestSchema = z.object({
  i: IconIdSchema,
  theme: ThemeSchema,
  size: IconSizeSchema,
});

/**
 * Multiple icons request schema
 */
export const MultipleIconsRequestSchema = z.object({
  i: IconIdsSchema,
  theme: ThemeSchema,
  perline: PerLineSchema,
});

/**
 * Parse and validate single icon request parameters
 */
export function validateSingleIconRequest(searchParams: URLSearchParams) {
  const iconId = searchParams.get("i");
  const theme = searchParams.get("theme") || "dark";
  const size = searchParams.get("size");

  return SingleIconRequestSchema.parse({
    i: iconId,
    theme,
    size: size ? parseInt(size, 10) : ICON_CONFIG.ICON_SIZE,
  });
}

/**
 * Parse and validate multiple icons request parameters
 */
export function validateMultipleIconsRequest(searchParams: URLSearchParams) {
  const iconsParam = searchParams.get("i");
  const theme = searchParams.get("theme") || "dark";
  const perLineParam = searchParams.get("perline");

  if (!iconsParam) {
    throw new Error("Missing 'i' parameter");
  }

  const iconIds = iconsParam
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  return MultipleIconsRequestSchema.parse({
    i: iconIds,
    theme,
    perline: perLineParam ? parseInt(perLineParam, 10) : ICON_CONFIG.DEFAULT_PER_LINE,
  });
}

/**
 * Validation error details type
 */
export interface ValidationErrorDetails {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Extract validation error details from Zod error
 */
export function extractValidationErrors(error: z.ZodError): ValidationErrorDetails[] {
  return error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    value: "expected" in err ? err.expected : undefined,
  }));
}

/**
 * Check if error is a Zod validation error
 */
export function isValidationError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}
