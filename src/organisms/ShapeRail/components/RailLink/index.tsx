'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const RailLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  white-space: nowrap;
  transition: background-color 0.15s ease-out;

  &[aria-current='page'] {
    background: ${({ theme }) => theme.color('secondary')};
    color: ${({ theme }) => theme.color('secondary', 'text')};
    font-weight: ${({ theme }) => theme.fontWeight('bold')};
  }

  @media (hover: hover) and (pointer: fine) {
    &:not([aria-current='page']):hover {
      background: ${({ theme }) => theme.color('primary', 'text')};
      color: ${({ theme }) => theme.color('primary')};
    }
  }

  &:focus-visible {
    outline-color: ${({ theme }) => theme.color('tertiary')};
    outline-offset: -3px;
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    padding-block: 11px;
  `}
`;
