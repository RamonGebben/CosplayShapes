'use client';

import styled from 'styled-components';

export const FlatHeader = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  text-align: right;

  & h2 {
    font-size: min(${({ theme }) => theme.fontSize('l')}, 5.4cqi);
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    top: auto;
    bottom: 12px;
    right: ${theme.spacing('base')};
    flex-direction: row;
    align-items: center;

    & h2 {
      display: none;
    }
  `}
`;
