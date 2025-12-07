/**
 * Component-level theme configuration
 * Centralizes all styling values for easy theming
 */

import { theme } from './theme';

export const productCardTheme = {
  // Card styling
  card: {
    maxWidth: 345,
    borderRadius: theme.borderRadius.small,
    border: {
      default: `1px solid ${theme.colors.border}`,
      selected: `3px solid ${theme.colors.primary}`,
    },
    boxShadow: {
      default: 1,
      selected: theme.shadows.primary,
    },
    transition: theme.transitions.normal,
  },

  // Media (image) styling
  media: {
    height: 200,
    objectFit: 'cover' as const,
  },

  // Typography
  typography: {
    title: {
      variant: 'h6' as const,
      fontWeight: theme.typography.fontWeights.semibold,
    },
    price: {
      fontSize: theme.typography.fontSizes.medium,
    },
  },

  // Colors (inherited from shared theme)
  colors: {
    primary: theme.colors.primary,
    primaryHover: theme.colors.primaryHover,
    border: theme.colors.border,
    background: theme.colors.background,
    primaryLight: theme.colors.primaryLight,
    primaryShadow: theme.colors.primaryShadow,
  },

  // Buttons
  buttons: {
    addItem: {
      borderRadius: theme.borderRadius.large,
      textTransform: 'none' as const,
      fontSize: theme.typography.fontSizes.medium,
      paddingY: theme.spacing.sm,
    },
    choose: {
      borderRadius: theme.borderRadius.large,
      textTransform: 'none' as const,
      fontSize: theme.typography.fontSizes.medium,
      paddingY: theme.spacing.sm,
      paddingX: theme.spacing.lg,
    },
  },

  // Quantity control
  quantityControl: {
    container: {
      gap: theme.spacing.sm,
      borderRadius: theme.borderRadius.large,
      paddingX: theme.spacing.sm,
    },
    text: {
      minWidth: 30,
      fontWeight: theme.typography.fontWeights.semibold,
      fontSize: theme.typography.fontSizes.large,
    },
  },

  // Spacing
  spacing: {
    cardContent: {
      paddingBottom: theme.spacing.sm,
    },
    cardActions: {
      paddingX: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      paddingTop: 0,
    },
  },
};

export type ProductCardTheme = typeof productCardTheme;

export const productDialogTheme = {
  // Dialog styling
  dialog: {
    borderRadius: theme.borderRadius.xlarge,
    maxHeight: '90vh',
  },

  // Header image
  headerImage: {
    height: 192,
    objectFit: 'cover' as const,
  },

  // Close button
  closeButton: {
    top: theme.spacing.md,
    right: theme.spacing.md,
    boxShadow: theme.shadows.md,
  },

  // Typography
  typography: {
    title: {
      variant: 'h5' as const,
      fontWeight: theme.typography.fontWeights.bold,
    },
    price: {
      variant: 'h6' as const,
    },
    sectionHeader: {
      variant: 'caption' as const,
      fontWeight: theme.typography.fontWeights.bold,
    },
  },

  // Card styling for options
  optionCard: {
    borderRadius: theme.borderRadius.medium,
    padding: 1.5,
    borderWidth: 1,
    borderColor: {
      default: 'grey.300',
      selected: 'success.main',
    },
    backgroundColor: {
      default: 'transparent',
      selected: 'success.light',
    },
    transition: theme.transitions.normal,
  },

  // Buttons
  buttons: {
    dropdown: {
      textTransform: 'none' as const,
    },
    addToCart: {
      borderRadius: '50px',
      fontSize: '1.125rem',
      textTransform: 'none' as const,
      fontWeight: theme.typography.fontWeights.bold,
      paddingY: 1.5,
      paddingX: theme.spacing.lg,
    },
  },

  // Quantity control
  quantityControl: {
    container: {
      borderRadius: '50px',
    },
    text: {
      paddingX: theme.spacing.md,
      fontWeight: theme.typography.fontWeights.bold,
      fontSize: '1.125rem',
    },
  },

  // Footer
  footer: {
    backgroundColor: 'success.main',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },

  // Spacing
  spacing: {
    section: theme.spacing.lg,
    sectionHeaderBottom: 1.5,
    contentBottom: 0,
  },

  // Colors
  colors: {
    white: 'white',
    success: 'success.main',
    error: 'error.main',
    textSecondary: 'text.secondary',
    textPrimary: 'text.primary',
  },
};

export type ProductDialogTheme = typeof productDialogTheme;
