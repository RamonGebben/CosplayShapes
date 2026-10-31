import DesignSystem, { type SystemTokens } from '@pindakaasman/design-system';

const tokens: SystemTokens = {
  breakpoints: {
    mobile: '600px',
    tablet: '768px',
    tabletLandscape: '1024px',
    desktop: '1440px',
  },
  type: {
    baseFontSize: '16px',
    fontFamily: {
      base: 'var(--font-atkinson), system-ui, sans-serif',
      heading: 'var(--font-big-shoulders), Impact, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 0.88,
      base: 1.5,
      loose: 1.78,
    },
    // xl is the title-card heading, l the flat-pattern heading; the rest is UI.
    sizes: {
      mobile: {
        xxs: '12px',
        xs: '13px',
        s: '14px',
        base: '16px',
        m: '20px',
        l: '30px',
        xl: '52px',
      },
      tablet: {
        xxs: '12px',
        xs: '13px',
        s: '14px',
        base: '16px',
        m: '22px',
        l: '34px',
        xl: '64px',
      },
      tabletLandscape: {
        xxs: '12px',
        xs: '13px',
        s: '14px',
        base: '15px',
        m: '22px',
        l: '36px',
        xl: '72px',
      },
      desktop: {
        xxs: '12px',
        xs: '13px',
        s: '14px',
        base: '15px',
        m: '24px',
        l: '40px',
        xl: '88px',
      },
    },
  },
  // Light only: patterns are checked against white paper on a cutting table,
  // usually in daylight or under workshop lamps.
  modes: {
    light: {
      colorPalette: {
        error: { base: '#c0122f', text: '#ffffff', emphasis: '#fde8ec' },
        formBackground: {
          base: '#ffffff',
          text: '#121212',
          emphasis: '#d9d9cf',
        },
        // Ground, ink, and the white of the printed page.
        background: { base: '#f7f7f2', text: '#121212', emphasis: '#ffffff' },
        // Ultramarine: the shape rail and the title-card field.
        primary: { base: '#1d2bd6', text: '#ffffff', emphasis: '#dfe2ff' },
        // Magenta: the selected shape and the lit seam.
        secondary: { base: '#ff3d7f', text: '#121212', emphasis: '#c2185b' },
        // Yellow: highlights and the cel-shaded model.
        tertiary: { base: '#ffd23f', text: '#121212', emphasis: '#c99a0c' },
        // Ink: primary actions and pattern lines; emphasis is the muted ink.
        quaternary: { base: '#121212', text: '#ffffff', emphasis: '#4a4a52' },
      },
      gradient: {
        menu: 'linear-gradient(180deg, #1d2bd6 0%, #1d2bd6 100%)',
        hero: 'linear-gradient(90deg, #1d2bd6 0%, #1d2bd6 100%)',
      },
      boxShadow: {
        base: '0 1px 2px rgba(18, 18, 18, 0.12)',
        card: '0 6px 18px rgba(18, 18, 18, 0.14)',
        modal: '0 12px 32px rgba(18, 18, 18, 0.22)',
      },
    },
  },
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    toast: 400,
  },
  spacing: {
    scale: {
      mobile: {
        xxs: '2px',
        xs: '4px',
        s: '8px',
        base: '16px',
        m: '16px',
        l: '24px',
        xl: '48px',
      },
      tablet: {
        xxs: '2px',
        xs: '4px',
        s: '8px',
        base: '16px',
        m: '24px',
        l: '60px',
        xl: '120px',
      },
      tabletLandscape: {
        xxs: '4px',
        xs: '8px',
        s: '8px',
        base: '16px',
        m: '24px',
        l: '60px',
        xl: '120px',
      },
      desktop: {
        xxs: '4px',
        xs: '8px',
        s: '8px',
        base: '16px',
        m: '24px',
        l: '60px',
        xl: '120px',
      },
    },
  },
  border: {
    radius: { s: '0', base: '0', full: '9999px' },
    width: { s: '1px', base: '1.5px' },
  },
};

/** The theme instance passed to styled-components' ThemeProvider. */
const theme = new DesignSystem(tokens);

export default theme;
