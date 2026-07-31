export enum Dietary {
  LactoseFree,
  LowLactose,
  Vegan,
  Vegetarian,
  GlutenFree,
}

// Short codes for each dietary option
export const DietaryCode: Record<Dietary, string> = {
  [Dietary.LactoseFree]: 'L',
  [Dietary.LowLactose]: 'VL',
  [Dietary.Vegan]: 'VEG',
  [Dietary.Vegetarian]: 'V',
  [Dietary.GlutenFree]: 'G',
};

// English names for each dietary option (used as translation keys)
export const DietaryName: Record<Dietary, string> = {
  [Dietary.LactoseFree]: 'lactoseFree',
  [Dietary.LowLactose]: 'lowLactose',
  [Dietary.Vegan]: 'vegan',
  [Dietary.Vegetarian]: 'vegetarian',
  [Dietary.GlutenFree]: 'glutenFree',
};
