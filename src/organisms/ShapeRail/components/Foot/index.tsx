'use client';

import styled from 'styled-components';

export const Foot = styled.p`
  margin: auto 4px 0;
  font-size: ${({ theme }) => theme.fontSize('xs')};
  color: ${({ theme }) => theme.color('primary', 'emphasis')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    display: none;
  `}
`;
