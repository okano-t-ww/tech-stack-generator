import { getIconifyIcon } from "./iconMapping";
import { getSimpleIcon, getFallbackIcon, type SimpleIconData } from "./simpleIconsAdapter";
import { ICON_CONFIG, getTotalIconSize } from "@/constants/iconConfig";
import { getThemeColors, getIconColor, type ThemeMode } from "@/constants/themeConfig";
import { createIconGridSvg, type GridIconConfig } from "./svgBuilder";

export interface GenerateSvgOptions {
  iconIds: string[];
  theme?: ThemeMode;
  perLine?: number;
}

function getIconSvgData(iconId: string): SimpleIconData {
  const iconifyId = getIconifyIcon(iconId);
  return getSimpleIcon(iconifyId) ?? getFallbackIcon();
}

export function generateIconGridSvg({
  iconIds,
  theme = "dark",
  perLine = ICON_CONFIG.DEFAULT_PER_LINE,
}: GenerateSvgOptions): string {
  if (iconIds.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <text x="50" y="50" text-anchor="middle" fill="#888" font-size="12">No icons</text>
    </svg>`;
  }

  const totalIconSize = getTotalIconSize(ICON_CONFIG.ICON_SIZE, ICON_CONFIG.ICON_PADDING);
  const rows = Math.ceil(iconIds.length / perLine);
  const cols = Math.min(iconIds.length, perLine);
  const width = cols * totalIconSize;
  const height = rows * totalIconSize;
  const themeColors = getThemeColors(theme);

  const icons: GridIconConfig[] = iconIds.map((iconId, index) => {
    const row = Math.floor(index / perLine);
    const col = index % perLine;
    const x = col * totalIconSize + ICON_CONFIG.ICON_PADDING;
    const y = row * totalIconSize + ICON_CONFIG.ICON_PADDING;
    const iconData = getIconSvgData(iconId);
    const color = getIconColor(theme, iconData.hex);

    return { iconData, color, position: { x, y } };
  });

  return createIconGridSvg(icons, { width, height }, themeColors.background, ICON_CONFIG.ICON_SIZE, 8);
}
