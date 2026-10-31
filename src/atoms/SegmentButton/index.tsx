'use client';

import styled from 'styled-components';

/** One choice in a segmented control; aria-pressed marks the chosen one. */
export const SegmentButton = styled.button.attrs({ type: 'button' })`
  padding: 8px 10px;
  border: 0;
  background: ${({ theme }) => theme.color('formBackground')};
  color: ${({ theme }) => theme.color('formBackground', 'text')};
  white-space: nowrap;
  cursor: pointer;

  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.color('quaternary')};
    color: ${({ theme }) => theme.color('quaternary', 'text')};
    font-weight: ${({ theme }) => theme.fontWeight('bold')};
  }

  @media (hover: hover) and (pointer: fine) {
    &[aria-pressed='false']:hover {
      background: ${({ theme }) => theme.color('tertiary')};
    }
  }

  &:focus-visible {
    position: relative;
    outline-offset: -3px;
  }
`;
