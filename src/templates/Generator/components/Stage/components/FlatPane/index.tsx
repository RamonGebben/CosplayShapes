'use client';

import styled from 'styled-components';

/** The paper side of the diagonal, below the pane's heading. */
export const FlatPane = styled.div<{ $alone: boolean }>`
  position: absolute;
  top: 128px;
  right: 12px;
  bottom: 52px;
  left: ${({ $alone }) => ($alone ? '36%' : '44%')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    top: 48%;
    right: 0;
    bottom: 56px;
    left: 0;
  `}
`;
