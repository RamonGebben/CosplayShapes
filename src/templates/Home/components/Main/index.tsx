'use client';

import styled from 'styled-components';

export const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  padding: ${({ theme }) => `${theme.spacing('xl')} ${theme.spacing('l')}`};
  background-color: ${({ theme }) => theme.color('background')};
`;
