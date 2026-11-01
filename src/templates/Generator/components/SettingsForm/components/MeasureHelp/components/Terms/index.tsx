'use client';

import styled from 'styled-components';

/** A two-column list of terms and what they mean. */
export const Terms = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  margin-top: 12px;
  font-size: ${({ theme }) => theme.fontSize('xs')};

  dt {
    font-weight: ${({ theme }) => theme.fontWeight('bold')};
  }

  dd {
    color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  }
`;
