/**
 * Error classification system for the application
 */

export enum ErrorCode {
  // Validation errors (400)
  MISSING_PARAMETER = "MISSING_PARAMETER",
  INVALID_PARAMETER = "INVALID_PARAMETER",
  INVALID_ICON_ID = "INVALID_ICON_ID",
  TOO_MANY_ICONS = "TOO_MANY_ICONS",
  REQUEST_TOO_LARGE = "REQUEST_TOO_LARGE",

  // Not found errors (404)
  ICON_NOT_FOUND = "ICON_NOT_FOUND",

  // Server errors (500)
  SVG_GENERATION_FAILED = "SVG_GENERATION_FAILED",
  INTERNAL_ERROR = "INTERNAL_ERROR",

  // Rate limiting (429)
  RATE_LIMITED = "RATE_LIMITED",
}

/**
 * Base error class for icon-related errors
 */
export class IconError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "IconError";
    Object.setPrototypeOf(this, IconError.prototype);
  }

  /**
   * Get HTTP status code for this error
   */
  getStatusCode(): number {
    switch (this.code) {
      case ErrorCode.MISSING_PARAMETER:
      case ErrorCode.INVALID_PARAMETER:
      case ErrorCode.INVALID_ICON_ID:
      case ErrorCode.TOO_MANY_ICONS:
      case ErrorCode.REQUEST_TOO_LARGE:
        return 400;

      case ErrorCode.ICON_NOT_FOUND:
        return 404;

      case ErrorCode.RATE_LIMITED:
        return 429;

      case ErrorCode.SVG_GENERATION_FAILED:
      case ErrorCode.INTERNAL_ERROR:
      default:
        return 500;
    }
  }

  /**
   * Convert error to JSON response format
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    };
  }
}

/**
 * Create a validation error
 */
export function createValidationError(
  field: string,
  value: unknown,
  constraint: string
): IconError {
  return new IconError(
    ErrorCode.INVALID_PARAMETER,
    `Invalid value for parameter '${field}'`,
    { field, value, constraint }
  );
}

/**
 * Create a missing parameter error
 */
export function createMissingParameterError(field: string, usage: string): IconError {
  return new IconError(
    ErrorCode.MISSING_PARAMETER,
    `Missing required parameter '${field}'. ${usage}`,
    { field, usage }
  );
}

/**
 * Create an icon not found error
 */
export function createIconNotFoundError(iconId: string): IconError {
  return new IconError(
    ErrorCode.ICON_NOT_FOUND,
    `Icon '${iconId}' not found`,
    { iconId }
  );
}

/**
 * Create a too many icons error
 */
export function createTooManyIconsError(count: number, max: number): IconError {
  return new IconError(
    ErrorCode.TOO_MANY_ICONS,
    `Too many icons requested. Maximum is ${max}.`,
    { count, max }
  );
}

/**
 * Create an SVG generation error
 */
export function createSvgGenerationError(reason?: string): IconError {
  return new IconError(
    ErrorCode.SVG_GENERATION_FAILED,
    reason ? `Failed to generate SVG: ${reason}` : "Failed to generate SVG"
  );
}

/**
 * Check if error is an IconError
 */
export function isIconError(error: unknown): error is IconError {
  return error instanceof IconError;
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : "";

  if (isIconError(error)) {
    console.error(`${prefix} IconError [${error.code}]:`, error.message, error.details);
  } else if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message, error.stack);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}
