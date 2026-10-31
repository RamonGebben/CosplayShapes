'use client';

import styled from 'styled-components';

export const StageFrame = styled.section`
  position: relative;
  min-height: 0;
  overflow: hidden;
  container-type: size;
  background: ${({ theme }) => theme.color('background')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    grid-area: stage;
    height: min(78svh, 720px);
    min-height: 520px;
  `}
`;
