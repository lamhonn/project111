/**
 * Theme System - Central Export
 * 
 * Import from this file to access all theme configurations
 */

// Shared theme constants used across all components
export { theme as sharedTheme, type SharedTheme } from './theme';

// Individual component themes
export { productCardTheme, type ProductCardTheme, productDialogTheme, type ProductDialogTheme } from './componentThemes';

// Add more component themes here as they are created:
// export { headerTheme, type HeaderTheme } from './componentThemes';
// export { footerTheme, type FooterTheme } from './componentThemes';

/**
 * Usage examples:
 * 
 * 1. Import specific component theme:
 *    import { productCardTheme } from '@/theme';
 * 
 * 2. Import shared theme:
 *    import { sharedTheme } from '@/theme';
 * 
 * 3. Import multiple themes:
 *    import { productCardTheme, sharedTheme } from '@/theme';
 */
