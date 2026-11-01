'use client';

import styled from 'styled-components';

/** The help card, ruled in ink on white paper, laid over what follows. */
export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex('dropdown')};
  padding: 14px 16px 16px;
  border: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  background: ${({ theme }) => theme.color('background', 'emphasis')};
`;
