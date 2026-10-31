'use client';

import { createGlobalStyle } from 'styled-components';

// The CSS comment keeps this template's static text distinct from
// BreakpointStyle's: createGlobalStyle derives its id from that text, and two
// global styles with the same id overwrite each other.
export const ColorModeStyle = createGlobalStyle`
  /* color modes */
  ${({ theme }) => theme.colorModeCss()}
`;
