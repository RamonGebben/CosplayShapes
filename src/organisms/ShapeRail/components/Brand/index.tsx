'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const Brand = styled(Link)`
  display: block;
  margin: 0 4px 12px;
  font-family: ${({ theme }) => theme.fontFamily('heading')};
  font-size: 28px;
  font-weight: 900;
  line-height: ${({ theme }) => theme.lineHeight('tight')};
  text-transform: uppercase;

  & span {
    color: ${({ theme }) => theme.color('tertiary')};
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    flex: none;
    margin: 0;
    font-size: 20px;
  `}
`;
