/**
 * Shared theme constants used across multiple components
 * Import these when you need common values
 */

const brandColors = {
    white: "#F8FBF8",
    grey: "#47585C",
    blue: "#4D80E6",
}

export const theme = {
  /**
   * Color palette - using brand colors
   */
  colors: {
    // Primary colors - Indigo flower
    primary: brandColors.blue,
    primaryHover: '#3D70D6',
    primaryLight: 'rgba(77, 128, 230, 0.04)',
    primaryDark: 'rgba(77, 128, 230, 0.2)',
    
    // Neutral colors
    border: '#d0d0d0',
    background: brandColors.white,
    text: brandColors.grey,
    
    // Brand colors
    brandWhite: brandColors.white,
    brandGrey: brandColors.grey,
    brandBlue: brandColors.blue,
  },

  /**
   * Common border radius values
   */
  borderRadius: {
    small: 3,
    medium: 8,
    large: 10,
    xlarge: 12,
  },

  /**
   * Common spacing values (compatible with MUI spacing system)
   */
  spacing: {
    xs: 0.5,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },

  /**
   * Common typography settings
   */
  typography: {
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSizes: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.1rem',
      xlarge: '1.25rem',
    },
  },

  /**
   * Common transitions
   */
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },

  /**
   * Common shadows
   */
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    primary: '0 4px 12px rgba(77, 128, 230, 0.2)',
  },

  height: {
    xsmall: 14,
    small: 18,
    medium: 24,
    large: 32,
    xlarge: 40,
    xxlarge: 48,
  },
};

export type SharedTheme = typeof theme;
