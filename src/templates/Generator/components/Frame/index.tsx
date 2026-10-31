'use client';

import styled from 'styled-components';

export const Frame = styled.div`
  display: grid;
  grid-template-columns: 232px minmax(320px, 360px) minmax(0, 1fr);
  grid-template-areas: 'rail form main';
  height: 100svh;
  min-height: 640px;

  & > nav {
    grid-area: rail;
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'rail' 'stage' 'info' 'form' 'export';
    height: auto;
  `}
`;
