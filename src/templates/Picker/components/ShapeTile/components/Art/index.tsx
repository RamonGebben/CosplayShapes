'use client';

import styled from 'styled-components';

/** A small title card: the finished form beside the flat pieces it becomes. */
export const Art = styled.div`
  display: grid;
  grid-template-columns: 48% 1fr;
  grid-template-rows: 100%;
  height: 132px;
  margin: -14px -16px 12px;
  border-bottom: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
`;
