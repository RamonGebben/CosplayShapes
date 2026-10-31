'use client';

import styled from 'styled-components';

export const Message = styled.p<{ $tone: 'hint' | 'error' }>`
  grid-column: 1 / -1;
  margin-top: 6px;
  font-size: ${({ theme }) => theme.fontSize('xs')};
  font-weight: ${({ $tone, theme }) =>
    theme.fontWeight($tone === 'error' ? 'bold' : 'regular')};
  color: ${({ $tone, theme }) =>
    $tone === 'error'
      ? theme.color('error')
      : theme.color('quaternary', 'emphasis')};
`;
