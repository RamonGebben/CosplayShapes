'use client';

import styled from 'styled-components';

export const Row = styled.div<{ $wide: boolean }>`
  display: grid;
  grid-template-columns: ${({ $wide }) =>
    $wide ? '1fr minmax(0, 156px)' : '1fr 112px 34px'};
  align-items: center;
  column-gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid
    ${({ theme }) => theme.color('formBackground', 'emphasis')};
`;
