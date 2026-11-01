'use client';

import styled from 'styled-components';

export const Tier = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    flex-direction: row;
    flex: none;
  `}
`;
