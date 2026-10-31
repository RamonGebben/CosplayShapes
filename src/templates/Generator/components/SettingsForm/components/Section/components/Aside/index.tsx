'use client';

import styled from 'styled-components';

export const Aside = styled.span`
  font-size: ${({ theme }) => theme.fontSize('xs')};
  color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  text-align: right;
`;
