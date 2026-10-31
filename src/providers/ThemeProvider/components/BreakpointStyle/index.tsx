'use client';

import { createGlobalStyle } from 'styled-components';

// The CSS comment keeps this template's static text distinct from
// ColorModeStyle's: createGlobalStyle derives its id from that text, and two
// global styles with the same id overwrite each other.
export const BreakpointStyle = createGlobalStyle`
  /* breakpoints */
  ${({ theme }) => theme.breakpointCss()}
`;
