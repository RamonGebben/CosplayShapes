'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const TileLink = styled(Link)`
  display: grid;
  gap: 4px;
  height: 100%;
  padding: 14px 16px 16px;
  border: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  background: ${({ theme }) => theme.color('background', 'emphasis')};
  transition: background-color 0.15s ease-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.color('tertiary')};
    }
  }
`;
