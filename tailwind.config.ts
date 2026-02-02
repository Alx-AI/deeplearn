import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 Configuration
 *
 * Note: Tailwind v4 primarily uses CSS-based configuration via @theme blocks
 * in globals.css. This file provides a compatibility layer for plugins and
 * any config that benefits from being in TypeScript (editor tooling, etc.).
 *
 * The design tokens (colors, spacing, typography) are defined as CSS custom
 * properties in globals.css and mapped to Tailwind via @theme inline blocks.
 * This config extends Tailwind with plugin support and any additional
 * customizations that require JS-based configuration.
 */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* -------------------------------------------------------------------
         Colors

         These reference CSS custom properties defined in globals.css.
         This allows Tailwind IntelliSense in editors to recognize them,
         and lets plugins (like @tailwindcss/typography) access the palette.
         ------------------------------------------------------------------- */
      colors: {
        background: "var(--color-bg-primary)",
        foreground: "var(--color-text-primary)",
        surface: {
          DEFAULT: "var(--color-bg-secondary)",
          tertiary: "var(--color-bg-tertiary)",
        },
        elevated: "var(--color-bg-elevated)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
        disabled: "var(--color-text-disabled)",
        inverse: "var(--color-text-inverse)",
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          active: "var(--color-accent-active)",
          subtle: "var(--color-accent-subtle)",
        },
        border: {
          DEFAULT: "var(--color-border-primary)",
          secondary: "var(--color-border-secondary)",
          focus: "var(--color-border-focus)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          subtle: "var(--color-success-subtle)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          subtle: "var(--color-error-subtle)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          subtle: "var(--color-warning-subtle)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          subtle: "var(--color-info-subtle)",
        },
      },

      /* -------------------------------------------------------------------
         Font Families
         ------------------------------------------------------------------- */
      fontFamily: {
        sans: "var(--font-sans)",
        reading: "var(--font-reading)",
        mono: "var(--font-mono)",
      },

      /* -------------------------------------------------------------------
         Font Size Scale (matching CSS custom properties)
         ------------------------------------------------------------------- */
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "var(--leading-normal)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--leading-normal)" }],
        base: ["var(--text-base)", { lineHeight: "var(--leading-normal)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--leading-relaxed)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--leading-snug)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-snug)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-tight)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-tight)" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "var(--leading-none)" }],
      },

      /* -------------------------------------------------------------------
         Border Radius
         ------------------------------------------------------------------- */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },

      /* -------------------------------------------------------------------
         Box Shadow
         ------------------------------------------------------------------- */
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },

      /* -------------------------------------------------------------------
         Layout Widths
         ------------------------------------------------------------------- */
      maxWidth: {
        reading: "var(--width-reading)",
        content: "var(--width-content)",
        wide: "var(--width-wide)",
        page: "var(--width-max)",
      },

      /* -------------------------------------------------------------------
         Z-Index
         ------------------------------------------------------------------- */
      zIndex: {
        dropdown: "10",
        sticky: "20",
        overlay: "30",
        modal: "40",
        toast: "50",
      },

      /* -------------------------------------------------------------------
         Transition Timing Functions
         ------------------------------------------------------------------- */
      transitionTimingFunction: {
        default: "var(--ease-default)",
        "ease-in": "var(--ease-in)",
        "ease-out": "var(--ease-out)",
        spring: "var(--ease-spring)",
      },

      /* -------------------------------------------------------------------
         Transition Duration
         ------------------------------------------------------------------- */
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },

      /* -------------------------------------------------------------------
         Typography Plugin Configuration

         Customizes @tailwindcss/typography prose classes to match
         the design system palette and typographic decisions.
         ------------------------------------------------------------------- */
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-text-primary)",
            "--tw-prose-headings": "var(--color-text-primary)",
            "--tw-prose-lead": "var(--color-text-secondary)",
            "--tw-prose-links": "var(--color-accent)",
            "--tw-prose-bold": "var(--color-text-primary)",
            "--tw-prose-counters": "var(--color-text-tertiary)",
            "--tw-prose-bullets": "var(--color-text-tertiary)",
            "--tw-prose-hr": "var(--color-border-primary)",
            "--tw-prose-quotes": "var(--color-text-secondary)",
            "--tw-prose-quote-borders": "var(--color-accent)",
            "--tw-prose-captions": "var(--color-text-tertiary)",
            "--tw-prose-code": "var(--color-text-primary)",
            "--tw-prose-pre-code": "var(--color-text-primary)",
            "--tw-prose-pre-bg": "var(--color-bg-tertiary)",
            "--tw-prose-th-borders": "var(--color-border-primary)",
            "--tw-prose-td-borders": "var(--color-border-secondary)",
            fontFamily: "var(--font-reading)",
            fontSize: "var(--text-lg)",
            lineHeight: "var(--leading-relaxed)",
            maxWidth: "65ch",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;
