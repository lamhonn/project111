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
      // Validate each item has the required fields
      return parsed.filter(
        (item): item is Topping =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.Name === 'object' &&
          item.Name !== null &&
          (item.Name.en !== undefined || item.Name.fi !== undefined || item.Name.sv !== undefined) &&
          typeof item.PriceIncrement === 'number'
      );
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
