export enum Dietary {
  GlutenFree = 0,
  LactoseFree = 1,
  LowLactose = 2,
  Vegetarian = 3,
  Vegan = 4,
}

// Short codes for each dietary option
export const DietaryCode: Record<Dietary, string> = {
  [Dietary.GlutenFree]: 'G',
  [Dietary.LactoseFree]: 'L',
  [Dietary.LowLactose]: 'VL',
  [Dietary.Vegetarian]: 'V',
  [Dietary.Vegan]: 'VEG',
};

// English names for each dietary option (used as translation keys)
export const DietaryName: Record<Dietary, string> = {
  [Dietary.GlutenFree]: 'glutenFree',
  [Dietary.LactoseFree]: 'lactoseFree',
  [Dietary.LowLactose]: 'lowLactose',
  [Dietary.Vegetarian]: 'vegetarian',
  [Dietary.Vegan]: 'vegan',
};
