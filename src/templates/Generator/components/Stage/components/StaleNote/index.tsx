'use client';

import styled from 'styled-components';

export const StaleNote = styled.p`
  position: absolute;
  top: 0;
  left: 28px;
  right: 28px;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.color('tertiary')};
  color: ${({ theme }) => theme.color('tertiary', 'text')};
  font-size: ${({ theme }) => theme.fontSize('s')};
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
`;
