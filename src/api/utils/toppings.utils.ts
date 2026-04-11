/**
 * Utility functions for handling product toppings
 */

export type MultilingualName = {
  en?: string;
  fi?: string;
  sv?: string;
};

export type Topping = {
  Name: MultilingualName;
  PriceIncrement: number;
};

const normalizeMultilingualName = (value: unknown): MultilingualName | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        const obj = parsed as Record<string, unknown>;
        const name: MultilingualName = {
          en: typeof obj.en === 'string' ? obj.en : undefined,
          fi: typeof obj.fi === 'string' ? obj.fi : undefined,
          sv: typeof obj.sv === 'string' ? obj.sv : undefined,
        };

        if (name.en || name.fi || name.sv) {
          return name;
        }
      }
    } catch {
      return { en: trimmed };
    }

    return { en: trimmed };
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    const name: MultilingualName = {
      en: typeof obj.en === 'string' ? obj.en : undefined,
      fi: typeof obj.fi === 'string' ? obj.fi : undefined,
      sv: typeof obj.sv === 'string' ? obj.sv : undefined,
    };

    if (name.en || name.fi || name.sv) {
      return name;
    }
  }

  return null;
};

/**
 * Parses a toppings string which can be either:
 * - An empty/null string (no toppings)
 * - A JSON string representing an array of topping objects with multilingual names
 * 
 * @param toppingsString - The toppings string from the product
 * @returns An array of topping objects
 */
export const parseToppings = (toppingsString?: string): Topping[] => {
  if (!toppingsString || toppingsString.trim() === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(toppingsString);
    
    // Validate it's an array
    if (Array.isArray(parsed)) {
      return parsed
        .map((item): Topping | null => {
          if (!item || typeof item !== 'object') {
            return null;
          }

          const candidate = item as Record<string, unknown>;
          const rawName = candidate.Name ?? candidate.name;
          const rawPriceIncrement = candidate.PriceIncrement ?? candidate.priceIncrement;

          const normalizedName = normalizeMultilingualName(rawName);
          const normalizedPriceIncrement =
            typeof rawPriceIncrement === 'number'
              ? rawPriceIncrement
              : typeof rawPriceIncrement === 'string'
                ? Number(rawPriceIncrement)
                : NaN;

          if (!normalizedName || !Number.isFinite(normalizedPriceIncrement)) {
            return null;
          }

          return {
            Name: normalizedName,
            PriceIncrement: normalizedPriceIncrement,
          };
        })
        .filter((item): item is Topping => item !== null);
    }
  } catch (error) {
    console.warn('Failed to parse toppings JSON:', error);
  }

  return [];
};

/**
 * Gets a localized name for a topping with smart fallback logic:
 * 1. Try to get the requested language
 * 2. Fall back to English if available
 * 3. Fall back to any available language
 * 4. Return empty string if nothing is available
 * 
 * @param toppingName - The multilingual topping name object
 * @param language - The desired language code (en, fi, sv)
 * @returns The topping name in the appropriate language
 */
export const getLocalizedTopping = (
  toppingName: MultilingualName,
  language: string = 'en'
): string => {
  // Try requested language
  if (toppingName[language as keyof MultilingualName]) {
    return toppingName[language as keyof MultilingualName]!;
  }

  // Fall back to English
  if (toppingName.en) {
    return toppingName.en;
  }

  // Fall back to any available language
  const availableLanguages = ['fi', 'sv', 'en'];
  for (const lang of availableLanguages) {
    const name = toppingName[lang as keyof MultilingualName];
    if (name) {
      return name;
    }
  }

  // No translation available
  return '';
};

/**
 * Converts an array of topping objects to a JSON string
 * Useful for creating/updating products
 * 
 * @param toppings - Array of topping objects
 * @returns JSON string representation
 */
export const stringifyToppings = (toppings: Topping[]): string => {
  if (!toppings || toppings.length === 0) {
    return '';
  }
  
  return JSON.stringify(toppings);
};
