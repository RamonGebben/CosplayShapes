'use client';

import styled from 'styled-components';

/** The example's flat pieces, drawn from their real geometry. */
export const Art = styled.div`
  height: 132px;
  margin-bottom: 12px;
  border-bottom: 1px solid
    ${({ theme }) => theme.color('formBackground', 'emphasis')};
`;
