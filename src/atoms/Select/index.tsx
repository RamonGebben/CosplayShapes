'use client';

import styled from 'styled-components';

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%23121212' stroke-width='1.6'/%3E%3C/svg%3E\")";

export const Select = styled.select`
  width: 100%;
  min-width: 0;
  padding: 7px 30px 7px 9px;
  border: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  border-radius: ${({ theme }) => theme.borderRadius('base')};
  background: ${({ theme }) => theme.color('formBackground')} ${CHEVRON}
    no-repeat right 10px center;
  color: ${({ theme }) => theme.color('formBackground', 'text')};
  appearance: none;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color('secondary')};
    outline-offset: 0;
  }
`;
