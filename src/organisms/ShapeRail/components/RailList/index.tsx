'use client';

import styled from 'styled-components';

export const RailList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    flex-direction: row;
  `}
`;
