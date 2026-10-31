'use client';

import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color('background', 'emphasis')};
  font-family: ${({ theme }) => theme.fontFamily('base')};
`;
