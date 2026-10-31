'use client';

import styled from 'styled-components';

export const Unit = styled.span`
  color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  font-variant-numeric: tabular-nums;
`;
