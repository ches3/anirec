const RECORD_ERROR_CODES = [
  "search_params_extract_failed",
  "annict_search_failed",
  "wait_failed",
  "annict_record_failed",
  "unexpected_error",
] as const;

type RecordErrorCode = (typeof RECORD_ERROR_CODES)[number];

const RECORD_ERROR_MESSAGE_BY_CODE: Record<RecordErrorCode, string> = {
  search_params_extract_failed: "作品情報の抽出に失敗しました。",
  annict_search_failed: "Annictでの作品検索に失敗しました。",
  wait_failed: "記録タイミングの待機に失敗しました。",
  annict_record_failed: "Annictへの記録に失敗しました。",
  unexpected_error: "記録に失敗しました。",
};

export class RecordError extends Error {
  readonly code: RecordErrorCode;

  constructor(code: RecordErrorCode, options?: ErrorOptions) {
    super(`record_error:${code}`, options);
    this.name = "RecordError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  get userMessage(): string {
    return RECORD_ERROR_MESSAGE_BY_CODE[this.code];
  }
}

export function createRecordError(
  code: RecordErrorCode,
  cause: unknown,
): RecordError {
  return new RecordError(code, { cause });
}

export function getRecordErrorMessage(error: unknown): string {
  if (error instanceof RecordError) {
    return error.userMessage;
  }
  return RECORD_ERROR_MESSAGE_BY_CODE.unexpected_error;
}
