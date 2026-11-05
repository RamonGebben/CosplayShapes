'use client';

import styled from 'styled-components';

/**
 * The other actions, ruled in ink on white paper. Opens upwards: the button
 * sits at the foot of the stage, or pinned to the bottom of a phone screen.
 */
export const Menu = styled.ul`
  position: absolute;
  right: 0;
  bottom: calc(100% + 6px);
  z-index: ${({ theme }) => theme.zIndex('dropdown')};
  min-width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  border: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  background: ${({ theme }) => theme.color('background', 'emphasis')};

  & > li + li {
    border-top: ${({ theme }) => theme.borderWidth('s')} solid
      ${({ theme }) => theme.color('formBackground', 'emphasis')};
  }
`;
