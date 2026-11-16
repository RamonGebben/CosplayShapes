'use client';

import styled from 'styled-components';

/** What the shape makes, so the page says more than its settings do. */
export const Intro = styled.p`
  font-size: ${({ theme }) => theme.fontSize('s')};
  max-width: 60ch;
`;
