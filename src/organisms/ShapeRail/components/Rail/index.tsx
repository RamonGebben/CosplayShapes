'use client';

import styled from 'styled-components';

export const Rail = styled.nav`
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing('base')};
  padding: 28px 16px 24px;
  background: ${({ theme }) => theme.color('primary')};
  color: ${({ theme }) => theme.color('primary', 'text')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing('base')};
    padding: 10px 16px;
    overflow-x: auto;
    scrollbar-width: none;
  `}
`;
