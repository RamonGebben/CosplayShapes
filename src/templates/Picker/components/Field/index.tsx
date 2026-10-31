'use client';

import styled from 'styled-components';

/** The intro's ultramarine field, cut off by the same hard diagonal. */
export const Field = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: ${({ theme }) => theme.color('primary')};
  clip-path: polygon(0 0, 100% 0, 84% 100%, 0 100%);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.color('secondary')};
    clip-path: polygon(98.4% 0, 100% 0, 84% 100%, 82.4% 100%);
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    clip-path: polygon(0 0, 100% 0, 100% 86%, 0 100%);

    &::after {
      clip-path: polygon(0 98%, 100% 84%, 100% 86%, 0 100%);
    }
  `}
`;
