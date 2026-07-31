import { TFunction } from 'i18next';
import { DietaryCode, DietaryName, Dietary } from '../types/enums';

/**
 * Get the short code for a dietary option (e.g., 'G', 'L', 'VL', 'V', 'VEG')
 */
export const getDietaryCode = (dietary: Dietary): string => {
  return DietaryCode[dietary];
};

/**
 * Get the translated full name for a dietary option
 */
export const getDietaryName = (dietary: Dietary, t: TFunction): string => {
  return t(`dietary.${DietaryName[dietary]}`);
};

/**
 * Get translated names for an array of dietary options
 */
export const getDietaryNames = (dietaries: Dietary[], t: TFunction): string[] => {
  return dietaries.map((dietary) => getDietaryName(dietary, t));
};

/**
 * Get short codes for an array of dietary options
 */
export const getDietaryCodes = (dietaries: Dietary[]): string[] => {
  return dietaries.map((dietary) => getDietaryCode(dietary));
};
