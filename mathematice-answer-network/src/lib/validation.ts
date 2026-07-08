export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

export function cleanText(
  value: unknown,
  options: { min?: number; max: number },
): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  const min = options.min ?? 1;
  return text.length >= min && text.length <= options.max ? text : null;
}

export function validPassword(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 8 &&
    value.length <= 128 &&
    /[A-Za-z]/.test(value) &&
    /\d/.test(value)
  );
}

export function positiveInteger(
  value: unknown,
  maximum = Number.MAX_SAFE_INTEGER,
): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= maximum
    ? number
    : null;
}

export function integerArray(value: unknown, maximumLength = 100): number[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > maximumLength) {
    return null;
  }
  const result = value.map(Number);
  return result.every((item) => Number.isInteger(item) && item > 0)
    ? [...new Set(result)]
    : null;
}
