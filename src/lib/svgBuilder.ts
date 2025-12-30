import type { SimpleIconData } from "./simpleIconsAdapter";

/**
 * SVG element builder utilities
 */

export interface SvgDimensions {
  width: number;
  height: number;
}

export interface IconPosition {
  x: number;
  y: number;
}

/**
 * Create SVG opening tag with dimensions
 */
export function createSvgOpenTag(dimensions: SvgDimensions, viewBox?: string): string {
  const vb = viewBox ?? `0 0 ${dimensions.width} ${dimensions.height}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" viewBox="${vb}">`;
}

/**
 * Create SVG closing tag
 */
export function createSvgCloseTag(): string {
  return "</svg>";
}

/**
 * Create background rectangle
 */
export function createBackgroundRect(dimensions: SvgDimensions, color: string, borderRadius: number = 0): string {
  return `  <rect width="${dimensions.width}" height="${dimensions.height}" fill="${color}"${borderRadius > 0 ? ` rx="${borderRadius}"` : ""}/>`;
}

/**
 * Create icon SVG element with transform
 */
export function createIconElement(
  iconData: SimpleIconData,
  color: string,
  position: IconPosition,
  iconSize: number = 24
): string {
  return `  <g transform="translate(${position.x}, ${position.y})">
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24">
      <path fill="${color}" d="${iconData.path}"/>
    </svg>
  </g>`;
}

/**
 * Create a complete single icon SVG
 */
export function createSingleIconSvg(
  iconData: SimpleIconData,
  color: string,
  backgroundColor: string,
  size: number,
  borderRadius: number = 4
): string {
  const iconSize = 24;
  const padding = (size - iconSize) / 2;

  const parts = [
    createSvgOpenTag({ width: size, height: size }),
    createBackgroundRect({ width: size, height: size }, backgroundColor, borderRadius),
    createIconElement(iconData, color, { x: padding, y: padding }, iconSize),
    createSvgCloseTag(),
  ];

  return parts.join("\n");
}

/**
 * Create grid layout SVG with multiple icons
 */
export interface GridIconConfig {
  iconData: SimpleIconData;
  color: string;
  position: IconPosition;
}

export function createIconGridSvg(
  icons: GridIconConfig[],
  dimensions: SvgDimensions,
  backgroundColor: string,
  iconSize: number = 24,
  borderRadius: number = 8
): string {
  const parts = [
    createSvgOpenTag(dimensions),
    createBackgroundRect(dimensions, backgroundColor, borderRadius),
  ];

  // Build icon elements using array map for better performance
  const iconElements = icons.map((icon) =>
    createIconElement(icon.iconData, icon.color, icon.position, iconSize)
  );

  parts.push(...iconElements);
  parts.push(createSvgCloseTag());

  // Use array join instead of string concatenation
  return parts.join("\n");
}
