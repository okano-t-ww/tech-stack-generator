/**
 * Icon configuration constants
 */
export const ICON_CONFIG = {
  /** Default icon size in pixels */
  ICON_SIZE: 48,

  /** Padding around each icon in pixels */
  ICON_PADDING: 4,

  /** Minimum number of icons per line in grid layout */
  MIN_PER_LINE: 5,

  /** Maximum number of icons per line in grid layout */
  MAX_PER_LINE: 10,

  /** Default number of icons per line */
  DEFAULT_PER_LINE: 10,

  /** Maximum number of icons allowed in a single request */
  MAX_ICONS_PER_REQUEST: 50,

  /** Minimum icon size in pixels */
  MIN_ICON_SIZE: 16,

  /** Maximum icon size in pixels */
  MAX_ICON_SIZE: 256,
} as const;

/**
 * Calculate total icon size including padding
 */
export function getTotalIconSize(iconSize: number = ICON_CONFIG.ICON_SIZE, padding: number = ICON_CONFIG.ICON_PADDING): number {
  return iconSize + padding * 2;
}
