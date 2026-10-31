'use client';

import styled from 'styled-components';

export const Groups = styled.main`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 56px 48px 64px 32px;

  & h2 {
    margin-bottom: 18px;
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    padding: ${theme.spacing('l')} ${theme.spacing('base')} 48px;
  `}
`;
