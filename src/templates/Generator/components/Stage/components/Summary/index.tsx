'use client';

import styled from 'styled-components';

export const Summary = styled.p`
  max-width: 30cqi;
  margin-top: 10px;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color('primary', 'emphasis')};

  & span span {
    white-space: nowrap;
  }
`;
