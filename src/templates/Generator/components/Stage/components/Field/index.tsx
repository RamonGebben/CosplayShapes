'use client';

import styled, { css, keyframes } from 'styled-components';

/**
 * The ultramarine field and its magenta edge. On a new shape it wipes in
 * along the diagonal, once, like a title card cutting in.
 */
const SHAPE = 'polygon(0 0, 44% 0, 30% 100%, 0 100%)';
const EDGE = 'polygon(43.3% 0, 44% 0, 30% 100%, 29.3% 100%)';
const NARROW_SHAPE = 'polygon(0 0, 100% 0, 100% 34%, 0 48%)';
const NARROW_EDGE = 'polygon(0 47.2%, 100% 33.2%, 100% 34%, 0 48%)';

const wipe = (to: string, from: string) => keyframes`
  from { clip-path: ${from}; }
  to { clip-path: ${to}; }
`;

const motion = (to: string, from: string, delay: string) => css`
  animation: ${wipe(to, from)} 620ms cubic-bezier(0.16, 1, 0.3, 1) ${delay} both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Field = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.color('primary')};
  clip-path: ${SHAPE};
  ${motion(SHAPE, 'polygon(0 0, 0 0, -14% 100%, -14% 100%)', '0ms')}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.color('secondary')};
    clip-path: ${EDGE};
    ${motion(EDGE, 'polygon(-0.7% 0, 0 0, -14% 100%, -14.7% 100%)', '0ms')}
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    clip-path: ${NARROW_SHAPE};
    animation: none;

    &::after {
      clip-path: ${NARROW_EDGE};
      animation: none;
    }
  `}
`;
