// Professional Spacing Scale (8px grid system for consistency)
export const spacing = {
  // Base scale (8px grid)
  0: 0,
  1: 4,    // 0.25rem
  2: 8,    // 0.5rem
  3: 12,   // 0.75rem
  4: 16,   // 1rem
  5: 20,   // 1.25rem
  6: 24,   // 1.5rem
  8: 32,   // 2rem
  10: 40,  // 2.5rem
  12: 48,  // 3rem
  16: 64,  // 4rem
  20: 80,  // 5rem
  24: 96,  // 6rem
  32: 128, // 8rem
  40: 160, // 10rem
  48: 192, // 12rem
  56: 224, // 14rem
  64: 256, // 16rem
};

// Semantic spacing for common use cases
export const semanticSpacing = {
  // Layout spacing
  pageMargin: spacing[6],      // 24px
  sectionGap: spacing[10],     // 40px
  componentGap: spacing[6],    // 24px
  elementGap: spacing[4],      // 16px
  
  // Card and container spacing
  cardPadding: spacing[6],     // 24px
  cardGap: spacing[4],         // 16px
  containerPadding: spacing[8], // 32px
  
  // Form spacing
  formFieldGap: spacing[4],    // 16px
  formSectionGap: spacing[8],  // 32px
  formGroupGap: spacing[6],    // 24px
  
  // Header and navigation
  headerPadding: spacing[6],   // 24px
  navItemGap: spacing[4],      // 16px
  breadcrumbGap: spacing[2],   // 8px
  
  // Table and list spacing
  tableRowPadding: spacing[3], // 12px
  tableCellPadding: spacing[4], // 16px
  listItemGap: spacing[2],     // 8px
  
  // Button and interactive elements
  buttonPadding: spacing[3],   // 12px (vertical) 
  buttonGap: spacing[3],       // 12px
  iconGap: spacing[2],         // 8px
  
  // Professional document spacing
  paragraphGap: spacing[4],    // 16px
  headingGap: spacing[6],      // 24px
  sectionGapLarge: spacing[12], // 48px
};

// Responsive spacing modifiers
export const responsiveSpacing = {
  mobile: {
    pageMargin: spacing[4],    // 16px on mobile
    containerPadding: spacing[4], // 16px on mobile
  },
  tablet: {
    pageMargin: spacing[6],    // 24px on tablet
    containerPadding: spacing[6], // 24px on tablet
  },
  desktop: {
    pageMargin: spacing[8],    // 32px on desktop
    containerPadding: spacing[8], // 32px on desktop
  }
};

// Legacy array export for backward compatibility
export const spacingArray = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64];

// Helper functions
export const getSpacing = (scale) => spacing[scale] || scale;
export const px = (value) => `${value}px`;
export const rem = (value) => `${value / 16}rem`;
