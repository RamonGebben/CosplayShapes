'use client';

import styled from 'styled-components';

export const Frame = styled.div`
  display: grid;
  grid-template-columns: minmax(360px, 40%) minmax(0, 1fr);
  min-height: 100svh;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    grid-template-columns: minmax(0, 1fr);
  `}
`;
