const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

type ErrorCode = keyof typeof errorCodes;

export class LumpickError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message ?? code.toString());
    this.name = "LumpickError";
    this.code = code;

    /**
     * Set the prototype explicitly to maintain the correct prototype chain
     * More: https://medium.com/@Nelsonalfonso/understanding-custom-errors-in-typescript-a-complete-guide-f47a1df9354c
     */
    Object.setPrototypeOf(this, LumpickError.prototype);
  }
}
