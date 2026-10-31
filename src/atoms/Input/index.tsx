'use client';

import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: 7px 9px;
  border: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  border-radius: ${({ theme }) => theme.borderRadius('base')};
  background: ${({ theme }) => theme.color('formBackground')};
  color: ${({ theme }) => theme.color('formBackground', 'text')};
  font-variant-numeric: tabular-nums;
  text-align: right;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color('secondary')};
    outline-offset: 0;
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.color('error')};
    background: ${({ theme }) => theme.color('error', 'emphasis')};
  }

  &:disabled {
    border-color: ${({ theme }) => theme.color('formBackground', 'emphasis')};
    color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  }
`;
