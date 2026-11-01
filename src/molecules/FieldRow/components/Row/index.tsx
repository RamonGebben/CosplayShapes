'use client';

import styled from 'styled-components';

export const Row = styled.div<{ $wide: boolean; $joined: boolean }>`
  display: grid;
  grid-template-columns: ${({ $wide }) =>
    $wide ? '1fr minmax(0, 156px)' : '1fr 112px 34px'};
  align-items: center;
  column-gap: 10px;
  padding: ${({ $joined }) => ($joined ? '9px 0 0' : '9px 0')};
  border-bottom: ${({ $joined, theme }) =>
    $joined
      ? 'none'
      : `1px solid ${theme.color('formBackground', 'emphasis')}`};

  /* Toggles have no rule of their own, so give the one above some air. */
  & + label {
    margin-top: 9px;
  }
`;
