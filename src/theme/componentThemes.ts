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
    primaryShadow: theme.colors.primaryDark,
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
      selected: theme.colors.primary,
    },
    backgroundColor: {
      default: 'transparent',
      selected: theme.colors.primaryLight,
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
    backgroundColor: theme.colors.primary,
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
    white: theme.colors.brandWhite,
    primary: theme.colors.primary,
    error: 'error.main',
    textSecondary: theme.colors.text,
    textPrimary: theme.colors.text,
  },
};

export type ProductDialogTheme = typeof productDialogTheme;

export const actionBarTheme = {
  // Action bar container
  container: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    boxShadow: theme.shadows.lg,
    zIndex: 50,
  },

  // Buttons
  buttons: {
    service: {
      backgroundColor: theme.colors.brandWhite,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeights.semibold,
      fontSize: theme.typography.fontSizes.medium,
      paddingX: theme.spacing.lg,
      paddingY: 1.5,
      borderRadius: theme.borderRadius.xlarge,
      textTransform: 'none' as const,
      boxShadow: theme.shadows.sm,
      gap: theme.spacing.sm,
    },
    order: {
      backgroundColor: theme.colors.brandWhite,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeights.semibold,
      fontSize: theme.typography.fontSizes.medium,
      paddingX: theme.spacing.lg,
      paddingY: 1.5,
      borderRadius: theme.borderRadius.xlarge,
      textTransform: 'none' as const,
      boxShadow: theme.shadows.sm,
      gap: theme.spacing.sm,
    },
  },

  // Badge
  badge: {
    backgroundColor: 'error.main',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: theme.typography.fontWeights.bold,
    minWidth: 20,
    height: 20,
  },

  // Dialog
  dialog: {
    borderRadius: theme.borderRadius.xlarge,
    padding: theme.spacing.lg,
    maxWidth: 'md' as const,
  },

  // Typography
  typography: {
    dialogTitle: {
      variant: 'h6' as const,
      fontWeight: theme.typography.fontWeights.semibold,
    },
    dialogContent: {
      variant: 'body1' as const,
    },
  },

  // Dialog buttons
  dialogButtons: {
    cancel: {
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeights.medium,
      textTransform: 'none' as const,
      paddingX: theme.spacing.lg,
      paddingY: 1,
      borderRadius: theme.borderRadius.medium,
    },
    confirm: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.brandWhite,
      fontWeight: theme.typography.fontWeights.semibold,
      textTransform: 'none' as const,
      paddingX: theme.spacing.lg,
      paddingY: 1,
      borderRadius: theme.borderRadius.medium,
    },
  },

  // Colors
  colors: {
    white: theme.colors.brandWhite,
    primary: theme.colors.primary,
    primaryHover: theme.colors.primaryHover,
  },
};

export type ActionBarTheme = typeof actionBarTheme;
export const orderSummaryDialogTheme = {
  // Dialog styling
  dialog: {
    borderRadius: theme.borderRadius.xlarge,
    maxHeight: '90vh',
    border: `1px solid ${theme.colors.border}`,
    borderLight: '1px solid #f3f4f6',
  },

  // Item image
  itemImage: {
    size: 64,
    borderRadius: theme.borderRadius.medium,
  },

  // Typography
  typography: {
    title: {
      variant: 'h6' as const,
      fontWeight: theme.typography.fontWeights.bold,
    },
    orderNumber: {
      variant: 'body2' as const,
    },
    sectionHeader: {
      variant: 'body1' as const,
      fontWeight: theme.typography.fontWeights.semibold,
    },
    itemName: {
      variant: 'body1' as const,
      fontWeight: theme.typography.fontWeights.semibold,
    },
    itemPrice: {
      variant: 'body2' as const,
    },
    summaryLabel: {
      variant: 'body2' as const,
    },
    summaryValue: {
      variant: 'body2' as const,
      fontWeight: theme.typography.fontWeights.medium,
    },
    total: {
      variant: 'body1' as const,
      fontWeight: theme.typography.fontWeights.semibold,
    },
    totalValue: {
      variant: 'h6' as const,
      fontWeight: theme.typography.fontWeights.bold,
    },
  },

  // Spacing
  spacing: {
    header: {
      padding: theme.spacing.lg,
    },
    content: {
      padding: theme.spacing.lg,
    },
    footer: {
      padding: theme.spacing.lg,
    },
    orderNumber: {
      marginTop: 0.5,
    },
    sectionHeader: {
      marginBottom: theme.spacing.md,
    },
    items: {
      gap: theme.spacing.md,
    },
    item: {
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },
    itemPrice: {
      marginTop: 0.5,
    },
    paymentSummary: {
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    summary: {
      gap: theme.spacing.sm,
    },
    divider: {
      marginY: theme.spacing.sm,
    },
  },

  // Buttons
  buttons: {
    placeOrder: {
      backgroundColor: theme.colors.primary,
      backgroundColorHover: theme.colors.primaryHover,
      color: 'white',
      fontWeight: theme.typography.fontWeights.semibold,
      textTransform: 'none' as const,
      paddingY: theme.spacing.md,
      borderRadius: theme.borderRadius.xlarge,
    },
  },

  // Colors
  colors: {
    closeButton: theme.colors.text,
    closeButtonHover: theme.colors.brandGrey,
    deleteButton: 'error.main',
    deleteButtonHover: 'error.dark',
  },
};

export type OrderSummaryDialogTheme = typeof orderSummaryDialogTheme;