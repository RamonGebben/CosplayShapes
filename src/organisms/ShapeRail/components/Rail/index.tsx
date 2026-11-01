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
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color('primary', 'emphasis')}
    ${({ theme }) => theme.color('primary')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing('base')};
    padding: 10px 16px;
    overflow-x: auto;
    overflow-y: hidden;

    /* Fingers swipe the strip; a mouse needs the scrollbar to reach its end. */
    @media (pointer: coarse) {
      scrollbar-width: none;
    }
  `}
`;
