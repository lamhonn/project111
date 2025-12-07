/**
 * Shared theme constants used across multiple components
 * Import these when you need common values
 */

export const theme = {
  /**
   * Color palette - extend with brand colors from constants/colors.ts if needed
   */
  colors: {
    // Primary colors
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: 'rgba(37, 99, 235, 0.04)',
    primaryShadow: 'rgba(37, 99, 235, 0.2)',
    
    // Neutral colors
    border: '#e0e0e0',
    background: '#f5f5f5',
    
    // You can integrate with existing brand colors:
    // import { brandColors } from '../constants/colors';
    // brandWhite: brandColors.white,
    // brandGrey: brandColors.grey,
    // brandBlue: brandColors.blue,
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
    primary: '0 4px 12px rgba(37, 99, 235, 0.2)',
  },
};

export type SharedTheme = typeof theme;
