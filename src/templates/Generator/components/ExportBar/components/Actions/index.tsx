'use client';

import styled from 'styled-components';

/** Paper size and the primary action: they wrap as one, always far right. */
export const Actions = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: 14px;
  margin-left: auto;

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    grid-area: export;
    position: sticky;
    bottom: 0;
    z-index: ${theme.zIndex('sticky')};
    margin: 0;
    padding: 10px ${theme.spacing('base')};
    border-top: ${theme.borderWidth('base')} solid ${theme.color('quaternary')};
    background: ${theme.color('background', 'emphasis')};

    & > :last-child {
      flex: 1;
    }
  `}
`;
