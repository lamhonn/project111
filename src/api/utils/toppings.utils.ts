/**
 * Utility functions for handling product toppings
 */

export type Topping = {
  Name: string;
  PriceIncrement: number;
};

/**
 * Parses a toppings string which can be either:
 * - An empty/null string (no toppings)
 * - A JSON string representing an array of topping objects
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
          typeof item.Name === 'string' &&
          typeof item.PriceIncrement === 'number'
      );
    }
  } catch (error) {
    console.warn('Failed to parse toppings JSON:', error);
  }

  return [];
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
