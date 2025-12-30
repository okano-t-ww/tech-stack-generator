import * as simpleIcons from "simple-icons";

/**
 * Simple Icons data structure
 */
export interface SimpleIconData {
  /** SVG path data */
  path: string;
  /** Hex color code (without #) */
  hex: string;
  /** Icon title */
  title?: string;
}

/**
 * Transform iconify ID to Simple Icons key format
 * @param iconifyId - Iconify format ID (e.g., "simple-icons:react")
 * @returns Simple Icons key (e.g., "siReact")
 */
export function getSimpleIconKey(iconifyId: string): string {
  const name = iconifyId.replace("simple-icons:", "");
  return `si${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`;
}

/**
 * Safely retrieve icon data from simple-icons library
 * @param iconKey - Simple Icons key (e.g., "siReact")
 * @returns Icon data or null if not found
 */
export function getSimpleIconByKey(iconKey: string): SimpleIconData | null {
  try {
    // Type-safe access to simple-icons object
    const iconsRecord = simpleIcons as Record<string, unknown>;
    const icon = iconsRecord[iconKey];

    // Validate icon structure
    if (
      icon &&
      typeof icon === "object" &&
      "path" in icon &&
      "hex" in icon &&
      typeof icon.path === "string" &&
      typeof icon.hex === "string"
    ) {
      return {
        path: icon.path,
        hex: icon.hex,
        title: "title" in icon && typeof icon.title === "string" ? icon.title : undefined,
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to retrieve icon: ${iconKey}`, error);
    return null;
  }
}

/**
 * Get icon data from iconify ID
 * @param iconifyId - Iconify format ID (e.g., "simple-icons:react")
 * @returns Icon data or null if not found
 */
export function getSimpleIcon(iconifyId: string): SimpleIconData | null {
  const key = getSimpleIconKey(iconifyId);
  return getSimpleIconByKey(key);
}

/**
 * Create a fallback icon when the requested icon is not found
 * @returns Fallback icon data
 */
export function getFallbackIcon(): SimpleIconData {
  return {
    path: "M0 0h24v24H0z",
    hex: "808080",
    title: "Unknown",
  };
}

/**
 * Get icon data with fallback
 * @param iconifyId - Iconify format ID
 * @returns Icon data (never null, returns fallback if not found)
 */
export function getSimpleIconOrFallback(iconifyId: string): SimpleIconData {
  return getSimpleIcon(iconifyId) ?? getFallbackIcon();
}
