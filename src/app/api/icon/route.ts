import { NextRequest, NextResponse } from "next/server";
import { getIconifyIcon } from "@/lib/iconMapping";
import { getSimpleIcon, getFallbackIcon } from "@/lib/simpleIconsAdapter";
import { getThemeColors, getIconColor } from "@/constants/themeConfig";
import { createSingleIconSvg } from "@/lib/svgBuilder";
import { validateSingleIconRequest, isValidationError, extractValidationErrors } from "@/lib/validation";
import { isIconError, logError, createSvgGenerationError } from "@/lib/errors";

export const runtime = "edge";

/**
 * GET /api/icon
 * Generate a single technology icon SVG
 *
 * Query Parameters:
 * - i (required): Icon ID (e.g., 'react')
 * - theme (optional): 'light' or 'dark' (default: 'dark')
 * - size (optional): Icon size in pixels, 16-256 (default: 48)
 *
 * @example
 * /api/icon?i=react&theme=dark&size=48
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const validated = validateSingleIconRequest(searchParams);
    const { i: iconId, theme, size } = validated;

    const iconifyId = getIconifyIcon(iconId);
    const iconData = getSimpleIcon(iconifyId) ?? getFallbackIcon();
    const themeColors = getThemeColors(theme);
    const color = getIconColor(theme, iconData.hex);

    const svg = createSingleIconSvg(iconData, color, themeColors.background, size, 4);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    if (isValidationError(error)) {
      const errors = extractValidationErrors(error);
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request parameters",
            details: errors,
          },
        },
        { status: 400 }
      );
    }

    if (isIconError(error)) {
      logError(error, "GET /api/icon");
      return NextResponse.json(error.toJSON(), { status: error.getStatusCode() });
    }

    logError(error, "GET /api/icon");
    const svgError = createSvgGenerationError(
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(svgError.toJSON(), { status: 500 });
  }
}
