'use client';

import styled from 'styled-components';

export const TierSummary = styled.p`
  font-size: ${({ theme }) => theme.fontSize('xs')};
  color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
`;
