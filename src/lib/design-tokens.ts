/**
 * Design Tokens
 *
 * TypeScript constants for the DeepLearn design system.
 * These mirror the CSS custom properties defined in globals.css so that
 * components can reference tokens programmatically (e.g., for Framer Motion
 * animations, canvas rendering, or dynamic style calculations).
 *
 * "Less, but better." -- Dieter Rams
 */

/* ==========================================================================
   Colors
   ========================================================================== */

export const colors = {
  light: {
    bg: {
      primary: "#FAFAF8",
      secondary: "#F0EFEB",
      tertiary: "#E8E6E1",
      elevated: "#FFFFFF",
    },
    text: {
      primary: "#1A1A18",
      secondary: "#6B6B63",
      tertiary: "#8A8A86",
      disabled: "#B8B8B4",
      inverse: "#FAFAF8",
    },
    accent: {
      DEFAULT: "#E07014",
      hover: "#C46012",
      active: "#A84D0A",
      subtle: "#FDF0E4",
    },
    border: {
      primary: "#D4D3CF",
      secondary: "#E8E6E1",
      focus: "#E07014",
    },
    success: {
      DEFAULT: "#4A7C59",
      subtle: "#EDF5EE",
    },
    error: {
      DEFAULT: "#C4463A",
      subtle: "#FCEEED",
    },
    warning: {
      DEFAULT: "#B8860B",
      subtle: "#FEF8E7",
    },
    info: {
      DEFAULT: "#3B6E8F",
      subtle: "#EDF3F7",
    },
  },
  dark: {
    bg: {
      primary: "#1A1A18",
      secondary: "#2A2A26",
      tertiary: "#333330",
      elevated: "#242422",
    },
    text: {
      primary: "#EDECEA",
      secondary: "#9B9B93",
      tertiary: "#6E6E6A",
      disabled: "#4A4A48",
      inverse: "#1A1A18",
    },
    accent: {
      DEFAULT: "#F0882E",
      hover: "#F49A4A",
      active: "#E07014",
      subtle: "#2A2018",
    },
    border: {
      primary: "#3A3A36",
      secondary: "#2A2A28",
      focus: "#F0882E",
    },
    success: {
      DEFAULT: "#5AAF66",
      subtle: "#1A2E1C",
    },
    error: {
      DEFAULT: "#E05A44",
      subtle: "#2E1A18",
    },
    warning: {
      DEFAULT: "#D4A024",
      subtle: "#2E2818",
    },
    info: {
      DEFAULT: "#5A9ABF",
      subtle: "#1A2430",
    },
  },
} as const;

/* ==========================================================================
   Typography
   ========================================================================== */

export const fontFamily = {
  /** UI elements, headings, navigation */
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  /** Long-form reading content, lesson text */
  reading:
    "'IBM Plex Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  /** Code blocks, inline code, terminal output */
  mono: "'IBM Plex Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace",
} as const;

/** Type scale in rem units (base 16px) */
export const fontSize = {
  xs: "0.75rem",     // 12px
  sm: "0.875rem",    // 14px
  base: "1rem",      // 16px
  lg: "1.125rem",    // 18px
  xl: "1.25rem",     // 20px
  "2xl": "1.5rem",   // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem",  // 36px
  "5xl": "3rem",     // 48px
} as const;

/** Line height values */
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 1.75,
} as const;

/** Letter spacing in em units */
export const letterSpacing = {
  tight: "-0.025em",
  snug: "-0.015em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
} as const;

/** Font weight values */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/* ==========================================================================
   Spacing

   Built on a 4px base grid. All values in rem (base 16px).
   ========================================================================== */

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",   // 2px
  1: "0.25rem",      // 4px
  1.5: "0.375rem",   // 6px
  2: "0.5rem",       // 8px
  3: "0.75rem",      // 12px
  4: "1rem",         // 16px
  5: "1.25rem",      // 20px
  6: "1.5rem",       // 24px
  8: "2rem",         // 32px
  10: "2.5rem",      // 40px
  12: "3rem",        // 48px
  16: "4rem",        // 64px
  20: "5rem",        // 80px
  24: "6rem",        // 96px
} as const;

/** Spacing values as pixel numbers for programmatic use */
export const spacingPx = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/* ==========================================================================
   Layout
   ========================================================================== */

export const layout = {
  /** Maximum reading content width (~65 characters) */
  widthReading: "65ch",
  /** Standard content area (768px) */
  widthContent: "48rem",
  /** Dashboard/multi-column views (1024px) */
  widthWide: "64rem",
  /** Maximum page width (1280px) */
  widthMax: "80rem",
  /** Default grid gutter (24px) */
  gridGutter: "1.5rem",
  /** Default page edge margin (24px) */
  gridMargin: "1.5rem",
} as const;

/** Responsive breakpoints in pixels */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/* ==========================================================================
   Animation
   ========================================================================== */

/** Duration values in milliseconds */
export const duration = {
  instant: 75,
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

/** Duration values as CSS strings */
export const durationCSS = {
  instant: "75ms",
  fast: "150ms",
  normal: "250ms",
  slow: "400ms",
} as const;

/** Easing functions as CSS cubic-bezier values */
export const easing = {
  default: "cubic-bezier(0.2, 0, 0.38, 0.9)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.38, 0.9)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

/** Easing as arrays for Framer Motion's cubic bezier format: [x1, y1, x2, y2] */
export const easingArray = {
  default: [0.2, 0, 0.38, 0.9] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.38, 0.9] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
} as const;

/* ==========================================================================
   Z-Index
   ========================================================================== */

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
} as const;

/* ==========================================================================
   Border Radius
   ========================================================================== */

export const radius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "9999px",
} as const;

/* ==========================================================================
   Shadows
   ========================================================================== */

export const shadow = {
  sm: "0 1px 2px rgba(26, 26, 24, 0.05)",
  md: "0 2px 8px rgba(26, 26, 24, 0.08)",
  lg: "0 4px 16px rgba(26, 26, 24, 0.10)",
} as const;

/* ==========================================================================
   Composite Typographic Styles

   Pre-composed typography tokens matching the specification table in
   design-system-specification.md Section 3.6.
   ========================================================================== */

export const typography = {
  display: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize["5xl"],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.tight,
  },
  h1: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize["4xl"],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.snug,
  },
  h2: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.snug,
  },
  h3: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  bodyReading: {
    fontFamily: fontFamily.reading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodyUI: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: "uppercase" as const,
  },
  codeBlock: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  codeInline: {
    fontFamily: fontFamily.mono,
    fontSize: "0.9em",
    fontWeight: fontWeight.regular,
    lineHeight: "inherit",
    letterSpacing: letterSpacing.normal,
  },
} as const;

/* ==========================================================================
   Convenience Exports
   ========================================================================== */

/** All design tokens in a single object */
export const tokens = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight,
  spacing,
  spacingPx,
  layout,
  breakpoints,
  duration,
  durationCSS,
  easing,
  easingArray,
  zIndex,
  radius,
  shadow,
  typography,
} as const;

export default tokens;
