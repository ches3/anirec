export function toError(message: string, cause: unknown): Error {
  if (cause instanceof Error) {
    return new Error(message, { cause });
  }
  return new Error(message);
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "不明なエラー";
}
