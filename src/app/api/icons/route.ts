import { NextRequest, NextResponse } from "next/server";
import { generateIconGridSvg } from "@/lib/svgGenerator";
import { validateMultipleIconsRequest, isValidationError, extractValidationErrors } from "@/lib/validation";
import { isIconError, logError, createSvgGenerationError } from "@/lib/errors";

export const runtime = "edge";

/**
 * GET /api/icons
 * Generate a combined SVG grid with multiple technology icons
 *
 * Query Parameters:
 * - i (required): Comma-separated icon IDs (e.g., 'react,nodejs,typescript')
 * - theme (optional): 'light' or 'dark' (default: 'dark')
 * - perline (optional): Icons per line, 5-10 (default: 10)
 *
 * @example
 * /api/icons?i=react,nodejs,typescript&theme=dark&perline=10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const validated = validateMultipleIconsRequest(searchParams);
    const { i: iconIds, theme, perline } = validated;

    const svg = generateIconGridSvg({
      iconIds,
      theme,
      perLine: perline,
    });

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
      logError(error, "GET /api/icons");
      return NextResponse.json(error.toJSON(), { status: error.getStatusCode() });
    }

    logError(error, "GET /api/icons");
    const svgError = createSvgGenerationError(
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(svgError.toJSON(), { status: 500 });
  }
}
