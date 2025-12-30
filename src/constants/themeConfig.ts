/**
 * Theme color configuration
 */

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  /** Background color */
  background: string;
  /** Default icon color (used when theme is light) */
  defaultIconColor: string;
}

/**
 * Theme color palette
 */
export const THEME_CONFIG: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: "#0d1117",
    defaultIconColor: "#ffffff",
  },
  light: {
    background: "#ffffff",
    defaultIconColor: "#000000",
  },
} as const;

/**
 * Get theme colors for a given mode
 */
export function getThemeColors(theme: ThemeMode): ThemeColors {
  return THEME_CONFIG[theme];
}

/**
 * Get icon color based on theme and hex value
 */
export function getIconColor(theme: ThemeMode, hex?: string): string {
  if (theme === "dark" && hex) {
    return `#${hex}`;
  }
  return THEME_CONFIG[theme].defaultIconColor;
}
