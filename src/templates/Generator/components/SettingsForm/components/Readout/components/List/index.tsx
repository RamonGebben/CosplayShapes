'use client';

import styled from 'styled-components';

export const List = styled.dl`
  display: grid;
  row-gap: 4px;
  padding: 12px 14px;
  border: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  background: ${({ theme }) => theme.color('background', 'emphasis')};
  font-size: ${({ theme }) => theme.fontSize('s')};
  font-variant-numeric: tabular-nums;

  & > div {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: ${({ theme }) => theme.spacing('base')};
  }

  & dt {
    color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  }

  & dd {
    font-weight: ${({ theme }) => theme.fontWeight('bold')};
    text-align: right;
  }
`;
