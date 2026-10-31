'use client';

import styled from 'styled-components';

export const Lead = styled.p`
  max-width: 34ch;
  font-size: ${({ theme }) => theme.fontSize('m')};
  line-height: 1.35;
`;
