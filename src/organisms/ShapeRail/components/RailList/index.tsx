'use client';

import styled from 'styled-components';

export const RailList = styled.ul<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 2px;
  margin-bottom: ${({ theme }) => theme.spacing('xs')};
  list-style: none;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    display: flex;
    flex-direction: row;
    margin-bottom: 0;
  `}
`;
