'use client';

import styled from 'styled-components';

/**
 * Holds the two halves as one control and anchors the menu above them. The
 * gap between them is the paper-white rule that splits the caret off.
 */
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-self: stretch;
  gap: ${({ theme }) => theme.borderWidth('base')};

  /* A focused half's ring draws over its neighbour's edge. */
  & > :focus-visible {
    position: relative;
    z-index: 1;
  }
`;
