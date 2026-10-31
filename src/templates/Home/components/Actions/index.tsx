'use client';

import styled from 'styled-components';

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing('base')};
  width: 100%;
  max-width: 440px;
`;
