import { parseAsArrayOf, parseAsInteger, parseAsBoolean, parseAsString } from "nuqs";
import type { TabPrefix } from "@/lib/tech-stack/tab-config";

export type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

// Type-safe URL state for each tab
export interface TabUrlState {
  selected: string[];
  perLine: PerLine;
  includeTitle: boolean;
}

// Create parsers for a specific tab with type safety
export function createTabParsers(tabPrefix: TabPrefix) {
  return {
    [`${tabPrefix}_selected`]: parseAsArrayOf(parseAsString).withDefault([]),
    [`${tabPrefix}_perLine`]: parseAsInteger.withDefault(10),
    [`${tabPrefix}_includeTitle`]: parseAsBoolean.withDefault(true),
  } as const;
}

// Type guard for PerLine
export function isValidPerLine(value: number): value is PerLine {
  return Number.isInteger(value) && value >= 5 && value <= 10;
}

// Clamp value to valid PerLine range
export function clampPerLine(value: number): PerLine {
  return Math.max(5, Math.min(10, value)) as PerLine;
}

// Extract typed values from URL state
export function extractTabUrlState(
  urlState: Record<string, unknown>,
  tabPrefix: TabPrefix
): TabUrlState {
  return {
    selected: (urlState[`${tabPrefix}_selected`] as string[]) ?? [],
    perLine: (urlState[`${tabPrefix}_perLine`] as PerLine) ?? 10,
    includeTitle: (urlState[`${tabPrefix}_includeTitle`] as boolean) ?? true,
  };
}
