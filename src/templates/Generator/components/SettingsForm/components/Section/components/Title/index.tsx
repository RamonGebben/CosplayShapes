'use client';

import styled from 'styled-components';

export const Title = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily('heading')};
  font-size: ${({ theme }) => theme.fontSize('m')};
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
`;
