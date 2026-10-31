'use client';

import styled from 'styled-components';

export const InlineLink = styled.a`
  color: ${({ theme }) => theme.color('primary')};
  font-weight: ${({ theme }) => theme.fontWeight('medium')};
`;
