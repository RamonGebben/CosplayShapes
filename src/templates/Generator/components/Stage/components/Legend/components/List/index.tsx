'use client';

import styled from 'styled-components';

export const List = styled.ul`
  position: absolute;
  right: 40px;
  bottom: 20px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px 18px;
  max-width: 54%;
  list-style: none;
  font-size: ${({ theme }) => theme.fontSize('xs')};
  color: ${({ theme }) => theme.color('quaternary', 'emphasis')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    display: none;
  `}
`;
