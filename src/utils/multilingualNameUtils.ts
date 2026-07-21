export function getTranslation(json: string, language: string): string {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Expected an object.");
  }

  const translations = parsed as Record<string, unknown>;
  const value = translations[language];

  if (typeof value !== "string") {
    throw new Error(`Translation for language "${language}" not found.`);
  }

  return value;
}