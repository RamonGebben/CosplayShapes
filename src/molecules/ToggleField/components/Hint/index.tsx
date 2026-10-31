'use client';

import styled from 'styled-components';

export const Hint = styled.span`
  font-size: ${({ theme }) => theme.fontSize('xs')};
  color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
`;
