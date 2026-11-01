'use client';

import styled from 'styled-components';

/** A tier's title and its one-line summary, ruled off from its categories. */
export const TierHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: ${({ theme }) => theme.spacing('m')};
  row-gap: 6px;
  padding-bottom: 14px;
  border-bottom: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('background', 'text')};
`;
