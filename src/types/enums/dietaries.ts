export enum Dietaries {
  GlutenFree = 0,
  LactoseFree = 1,
  LowLactose = 2,
  Vegetarian = 3,
  Vegan = 4,
}

// Short codes for each dietary option
export const DietaryCode: Record<Dietaries, string> = {
  [Dietaries.GlutenFree]: 'G',
  [Dietaries.LactoseFree]: 'L',
  [Dietaries.LowLactose]: 'VL',
  [Dietaries.Vegetarian]: 'V',
  [Dietaries.Vegan]: 'VEG',
};

// English names for each dietary option (used as translation keys)
export const DietaryName: Record<Dietaries, string> = {
  [Dietaries.GlutenFree]: 'glutenFree',
  [Dietaries.LactoseFree]: 'lactoseFree',
  [Dietaries.LowLactose]: 'lowLactose',
  [Dietaries.Vegetarian]: 'vegetarian',
  [Dietaries.Vegan]: 'vegan',
};
