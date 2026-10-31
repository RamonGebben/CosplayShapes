'use client';

import styled from 'styled-components';

export const Details = styled.p`
  flex: 1 1 auto;
  min-width: 0;
  font-size: ${({ theme }) => theme.fontSize('s')};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color('quaternary', 'emphasis')};

  & b {
    color: ${({ theme }) => theme.color('background', 'text')};
  }
`;
