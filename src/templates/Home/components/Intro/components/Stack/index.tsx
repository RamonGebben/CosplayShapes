'use client';

import styled from 'styled-components';

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing('m')};
  text-align: left;
`;
