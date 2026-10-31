'use client';

import styled from 'styled-components';

export const Name = styled.span`
  font-family: ${({ theme }) => theme.fontFamily('heading')};
  font-size: ${({ theme }) => theme.fontSize('m')};
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
`;
