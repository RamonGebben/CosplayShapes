'use client';

import styled, { keyframes } from 'styled-components';

const enter = keyframes`
  from { transform: translateX(-24px); opacity: 0; }
  to { transform: none; opacity: 1; }
`;

/**
 * Display caps run about half an em per letter. Sizing the title from its
 * longest word keeps every word left of the diagonal, whose top sits at 44%
 * of the stage and leans in to about 40% by the second line.
 */
const EM_PER_LETTER = 0.5;

export const TitleBlock = styled.div<{ $longestWord: number }>`
  position: absolute;
  top: 30px;
  left: 36px;
  z-index: 2;
  max-width: 40%;
  color: ${({ theme }) => theme.color('primary', 'text')};
  animation: ${enter} 520ms cubic-bezier(0.16, 1, 0.3, 1) 140ms both;

  & h1 {
    font-size: min(
      ${({ theme }) => theme.fontSize('xl')},
      8.6cqi,
      calc(
        (40cqi - 52px) / ${({ $longestWord }) => EM_PER_LETTER * $longestWord}
      )
    );
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  ${({ theme, $longestWord }) => theme.mq.lessThan('tabletLandscape')`
    top: 20px;
    left: ${theme.spacing('base')};
    max-width: 54%;

    & h1 {
      font-size: min(
        ${theme.fontSize('xl')},
        13cqi,
        calc((52cqi - 16px) / ${EM_PER_LETTER * $longestWord})
      );
    }
  `}
`;
