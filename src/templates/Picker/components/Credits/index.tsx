'use client';

import styled, { css } from 'styled-components';

/**
 * The maker's credit and support link, set small. In the intro it sits under the facts on the blue
 * field; below tablet landscape it moves to the foot of the page, after the shapes.
 */
export const Credits = styled.footer<{ $placement: 'intro' | 'footer' }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSize('s')};

  & a {
    font-weight: ${({ theme }) => theme.fontWeight('bold')};
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    & a:hover {
      color: ${({ theme }) => theme.color('tertiary')};
    }
  }

  ${({ $placement, theme }) =>
    $placement === 'intro'
      ? css`
          color: ${theme.color('primary', 'emphasis')};

          & a {
            color: ${theme.color('primary', 'text')};
          }

          ${theme.mq.lessThan('tabletLandscape')`
            display: none;
          `}
        `
      : css`
          display: none;
          padding: 0 ${theme.spacing('base')} 40px;
          color: ${theme.color('quaternary', 'emphasis')};

          & a {
            color: ${theme.color('primary')};
          }

          ${theme.mq.lessThan('tabletLandscape')`
            display: flex;
          `}
        `}
`;
