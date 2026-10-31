'use client';

import styled from 'styled-components';

/**
 * The ultramarine field under the title. Its right edge stops at 28% so the
 * whole slot stays inside the field down to the diagonal's foot at 30%.
 */
export const ModelSlot = styled.div`
  position: absolute;
  left: 2%;
  bottom: 4%;
  z-index: 1;
  width: 26%;
  height: 70%;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    left: auto;
    right: 0;
    top: 0;
    bottom: auto;
    width: 44%;
    height: 42%;
  `}
`;
