'use client';

import styled from 'styled-components';

export const Column = styled.form`
  grid-area: form;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
  padding: 28px;
  border-right: 1px solid
    ${({ theme }) => theme.color('formBackground', 'emphasis')};
  overflow-y: auto;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    padding: ${theme.spacing('l')} ${theme.spacing('base')};
    border-right: 0;
    overflow: visible;
  `}
`;
