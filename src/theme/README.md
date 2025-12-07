# Component Theming Guide

This directory contains theme configurations for components, making it easy to maintain consistent styling across the application and apply theme changes globally.

## Structure

### `componentThemes.ts`
Contains individual component theme configurations. Each component's theme is exported as a separate object.

## How to Use

### In Components

Import the theme configuration at the top of your component file:

```typescript
import { productCardTheme } from '../../theme/componentThemes';
```

Reference theme values instead of hardcoded values:

```typescript
// Instead of:
sx={{ borderRadius: 10, fontSize: '1rem' }}

// Use:
sx={{ 
  borderRadius: theme.buttons.addItem.borderRadius,
  fontSize: theme.buttons.addItem.fontSize 
}}
```

### Adding New Component Themes

1. Add a new theme object to `componentThemes.ts`:

```typescript
export const myComponentTheme = {
  colors: {
    primary: '#2563eb',
    // ... more colors
  },
  spacing: {
    // ... spacing values
  },
  // ... other styling properties
};
```

2. Export the type for TypeScript support:

```typescript
export type MyComponentTheme = typeof myComponentTheme;
```

3. Import and use in your component:

```typescript
import { myComponentTheme } from '../../theme/componentThemes';

const MyComponent = () => {
  const theme = myComponentTheme;
  // ... use theme values
};
```

## Future Enhancements

### Global Theme Integration

To integrate with Material-UI's theme system in the future:

1. **Create a global theme provider** (`src/theme/index.ts`):

```typescript
import { createTheme } from '@mui/material/styles';
import { productCardTheme } from './componentThemes';

export const globalTheme = createTheme({
  palette: {
    primary: {
      main: productCardTheme.colors.primary,
    },
    // ... other palette values
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: productCardTheme.card.borderRadius,
        },
      },
    },
    // ... other component overrides
  },
});
```

2. **Wrap your app** in `App.tsx`:

```typescript
import { ThemeProvider } from '@mui/material/styles';
import { globalTheme } from './theme';

function App() {
  return (
    <ThemeProvider theme={globalTheme}>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

3. **Use theme hook in components**:

```typescript
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  // Access theme values via theme object
};
```

### Theme Variants

To support multiple themes (light/dark, different brands):

```typescript
// src/theme/variants.ts
export const lightTheme = {
  colors: {
    primary: '#2563eb',
    background: '#f5f5f5',
  },
};

export const darkTheme = {
  colors: {
    primary: '#60a5fa',
    background: '#1f2937',
  },
};
```

## Benefits

- **Centralized styling**: All styling values in one place
- **Easy maintenance**: Update theme values without touching component logic
- **Consistency**: Ensures consistent styling across components
- **Type safety**: TypeScript support for theme values
- **Scalability**: Easy to extend with new themes or variants
- **Reusability**: Theme values can be shared across components

## Best Practices

1. **Use semantic naming**: Name theme properties based on their purpose, not their value
   - Good: `colors.primary`, `spacing.cardPadding`
   - Bad: `colors.blue`, `spacing.value2`

2. **Group related properties**: Organize theme properties logically
   - `colors`, `spacing`, `typography`, `buttons`, etc.

3. **Avoid hardcoded values**: Always reference theme values instead of hardcoding
   - Exception: MUI system values like `'text.primary'` can remain

4. **Document your theme**: Add comments explaining non-obvious theme properties

5. **Keep it DRY**: If multiple components use the same values, consider creating shared theme constants
