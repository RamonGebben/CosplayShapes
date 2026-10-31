'use client';

import styled from 'styled-components';

export const Status = styled.span<{
  $tone: 'idle' | 'working' | 'done' | 'failed';
}>`
  display: block;
  min-height: 1.4em;
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  color: ${({ $tone, theme }) =>
    $tone === 'failed'
      ? theme.color('error')
      : theme.color('background', 'text')};
`;
