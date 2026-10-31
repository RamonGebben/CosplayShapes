'use client';

import styled from 'styled-components';

export const Summary = styled.div`
  display: flex;
  flex: 1 1 300px;
  align-items: center;
  gap: 14px;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    grid-area: info;
    padding: 14px ${theme.spacing('base')};
    border-top: ${theme.borderWidth('base')} solid ${theme.color('quaternary')};
    background: ${theme.color('background', 'emphasis')};
  `}
`;
