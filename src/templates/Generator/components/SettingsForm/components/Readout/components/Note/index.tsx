'use client';

import styled from 'styled-components';

export const Note = styled.p`
  font-size: ${({ theme }) => theme.fontSize('xs')};
  color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  max-width: 60ch;
`;
