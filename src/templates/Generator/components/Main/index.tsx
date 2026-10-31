'use client';

import styled from 'styled-components';

export const Main = styled.main`
  grid-area: main;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) auto;
  min-width: 0;
  min-height: 0;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    display: contents;
  `}
`;
