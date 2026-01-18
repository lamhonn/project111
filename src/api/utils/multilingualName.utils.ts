/**
 * Utility functions for handling multilingual product names
 */

export type MultilingualName = {
  en?: string;
  fi?: string;
  sv?: string;
};

/**
 * Parses a product name which can be either:
 * - A plain string (legacy format)
 * - A JSON string representing multilingual names
 * 
 * @param nameString - The name string from the product
 * @returns A multilingual name object
 */
export const parseProductName = (nameString: string): MultilingualName => {
  if (!nameString) {
    return {};
  }

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(nameString);
    // Validate it's an object with at least one language key
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as MultilingualName;
    }
  } catch {
    // Not JSON, treat as plain string in English
    return { en: nameString };
  }

  // Fallback if parsing didn't work as expected
  return { en: nameString };
};

/**
 * Gets the product name in the specified language with smart fallback logic:
 * 1. Try to get the requested language
 * 2. Fall back to English if available
 * 3. Fall back to any available language
 * 4. Return empty string if nothing is available
 * 
 * @param nameString - The name string from the product
 * @param language - The desired language code (en, fi, sv)
 * @returns The product name in the appropriate language
 */
export const getLocalizedProductName = (
  nameString: string,
  language: string = 'en'
): string => {
  const multilingualName = parseProductName(nameString);

  // Try requested language
  if (multilingualName[language as keyof MultilingualName]) {
    return multilingualName[language as keyof MultilingualName]!;
  }

  // Fall back to English
  if (multilingualName.en) {
    return multilingualName.en;
  }

  // Fall back to any available language
  const availableLanguages = ['fi', 'sv', 'en'];
  for (const lang of availableLanguages) {
    const name = multilingualName[lang as keyof MultilingualName];
    if (name) {
      return name;
    }
  }

  // No translation available
  return '';
};

/**
 * Gets the category name in the specified language with smart fallback logic:
 * 1. Try to get the requested language
 * 2. Fall back to English if available
 * 3. Fall back to any available language
 * 4. Return empty string if nothing is available
 * 
 * @param categoryString - The category string (can be JSON or plain string)
 * @param language - The desired language code (en, fi, sv)
 * @returns The category name in the appropriate language
 */
export const getLocalizedCategoryName = (
  categoryString: string,
  language: string = 'en'
): string => {
  // Use the same logic as product names
  return getLocalizedProductName(categoryString, language);
};

/**
 * Parses ingredients string which can be either:
 * - A plain string (legacy format)
 * - A JSON string representing multilingual ingredients
 * 
 * @param ingredientsString - The ingredients string from the product
 * @returns A multilingual ingredients object
 */
export const parseIngredients = (ingredientsString?: string): MultilingualName => {
  if (!ingredientsString) {
    return {};
  }

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(ingredientsString);
    // Validate it's an object with at least one language key
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as MultilingualName;
    }
  } catch {
    // Not JSON, treat as plain string in English
    return { en: ingredientsString };
  }

  // Fallback if parsing didn't work as expected
  return { en: ingredientsString };
};

/**
 * Gets the ingredients in the specified language with smart fallback logic:
 * 1. Try to get the requested language
 * 2. Fall back to English if available
 * 3. Fall back to any available language
 * 4. Return empty string if nothing is available
 * 
 * @param ingredientsString - The ingredients string from the product
 * @param language - The desired language code (en, fi, sv)
 * @returns The ingredients in the appropriate language
 */
export const getLocalizedIngredients = (
  ingredientsString?: string,
  language: string = 'en'
): string => {
  if (!ingredientsString) {
    return '';
  }

  const multilingualIngredients = parseIngredients(ingredientsString);

  // Try requested language
  if (multilingualIngredients[language as keyof MultilingualName]) {
    return multilingualIngredients[language as keyof MultilingualName]!;
  }

  // Fall back to English
  if (multilingualIngredients.en) {
    return multilingualIngredients.en;
  }

  // Fall back to any available language
  const availableLanguages = ['fi', 'sv', 'en'];
  for (const lang of availableLanguages) {
    const ingredients = multilingualIngredients[lang as keyof MultilingualName];
    if (ingredients) {
      return ingredients;
    }
  }

  // No translation available
  return '';
};

/**
 * Parses description string which can be either:
 * - A plain string (legacy format)
 * - A JSON string representing multilingual descriptions
 * 
 * @param descriptionString - The description string from the product
 * @returns A multilingual description object
 */
export const parseDescription = (descriptionString?: string): MultilingualName => {
  if (!descriptionString) {
    return {};
  }

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(descriptionString);
    // Validate it's an object with at least one language key
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as MultilingualName;
    }
  } catch {
    // Not JSON, treat as plain string in English
    return { en: descriptionString };
  }

  // Fallback if parsing didn't work as expected
  return { en: descriptionString };
};

/**
 * Gets the description in the specified language with smart fallback logic:
 * 1. Try to get the requested language
 * 2. Fall back to English if available
 * 3. Fall back to any available language
 * 4. Return empty string if nothing is available
 * 
 * @param descriptionString - The description string from the product
 * @param language - The desired language code (en, fi, sv)
 * @returns The description in the appropriate language
 */
export const getLocalizedDescription = (
  descriptionString?: string,
  language: string = 'en'
): string => {
  if (!descriptionString) {
    return '';
  }

  const multilingualDescription = parseDescription(descriptionString);

  // Try requested language
  if (multilingualDescription[language as keyof MultilingualName]) {
    return multilingualDescription[language as keyof MultilingualName]!;
  }

  // Fall back to English
  if (multilingualDescription.en) {
    return multilingualDescription.en;
  }

  // Fall back to any available language
  const availableLanguages = ['fi', 'sv', 'en'];
  for (const lang of availableLanguages) {
    const description = multilingualDescription[lang as keyof MultilingualName];
    if (description) {
      return description;
    }
  }

  // No translation available
  return '';
};
