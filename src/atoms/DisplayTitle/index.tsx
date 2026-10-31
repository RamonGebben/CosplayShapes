'use client';

import styled from 'styled-components';

/** The title-card voice: condensed heavy caps. */
export const DisplayTitle = styled.h1<{ $size: 'xl' | 'l' | 'm' }>`
  font-family: ${({ theme }) => theme.fontFamily('heading')};
  font-size: ${({ $size, theme }) => theme.fontSize($size)};
  font-weight: 900;
  line-height: ${({ theme }) => theme.lineHeight('tight')};
  letter-spacing: 0.01em;
  text-transform: uppercase;
  text-wrap: balance;
`;
