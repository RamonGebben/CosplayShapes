'use client';

import styled from 'styled-components';

export const Wrapper = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: ${({ theme }) => theme.fontSize('s')};
  cursor: pointer;
`;
