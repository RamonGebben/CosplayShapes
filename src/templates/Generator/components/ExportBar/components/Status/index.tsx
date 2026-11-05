'use client';

import styled from 'styled-components';

export const Status = styled.span<{ $error: boolean }>`
  display: block;
  min-height: 1.4em;
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  color: ${({ $error, theme }) =>
    $error ? theme.color('error') : theme.color('background', 'text')};
`;
