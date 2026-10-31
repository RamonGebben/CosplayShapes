'use client';

import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing('base')};
  margin-bottom: 2px;

  & + * {
    border-top: ${({ theme }) => theme.borderWidth('base')} solid
      ${({ theme }) => theme.color('quaternary')};
  }
`;
