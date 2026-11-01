'use client';

import styled from 'styled-components';

export const Panel = styled.div`
  padding: 4px 0 ${({ theme }) => theme.spacing('m')};

  &[hidden] {
    display: none;
  }
`;
