'use client';

import styled from 'styled-components';

/**
 * The export strip under the stage. On phones it dissolves so its summary
 * sits in the page flow and only the print actions stay pinned.
 */
export const Bar = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 14px;
  min-height: 84px;
  padding: 14px 32px;
  border-top: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  background: ${({ theme }) => theme.color('background', 'emphasis')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    display: contents;
  `}
`;
