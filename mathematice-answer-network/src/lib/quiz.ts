const answerMap: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
};

export function normalizeAnswer(value: unknown): Array<number | string> {
  let source = value;
  if (typeof value === "string") {
    try {
      source = JSON.parse(value);
    } catch {
      source = value.includes(",") ? value.split(",") : [value];
    }
  }

  const values = Array.isArray(source) ? source : [source];
  return values
    .map((item) => {
      const text = String(item).trim().toUpperCase();
      if (answerMap[text]) return answerMap[text];
      const number = Number(text);
      return Number.isFinite(number) ? number : text;
    })
    .filter((item) => item !== "");
}

export function answersEqual(left: unknown, right: unknown): boolean {
  const normalize = (value: unknown) =>
    normalizeAnswer(value)
      .map(String)
      .sort()
      .join(",");
  return normalize(left) === normalize(right);
}

export function parseJsonArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
