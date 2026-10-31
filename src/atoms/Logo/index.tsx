'use client';

import Image from 'next/image';
import styled from 'styled-components';

// A filter has no token to live in, so this follows the OS preference
// directly rather than the theme's color mode.
export const Logo = styled(Image)`
  @media (prefers-color-scheme: dark) {
    filter: invert();
  }
`;
