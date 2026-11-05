'use client';

import styled from 'styled-components';

/** One menu entry: a bold action over a small muted line on what it gives. */
export const Item = styled.button`
  display: grid;
  gap: 2px;
  width: 100%;
  padding: 11px 18px;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.color('background', 'text')};
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease-out;

  & small {
    font-size: ${({ theme }) => theme.fontSize('xs')};
    font-weight: ${({ theme }) => theme.fontWeight('regular')};
    color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not([aria-disabled='true']) {
      background: ${({ theme }) => theme.color('tertiary')};
    }
  }

  &:focus-visible {
    outline-offset: -3px;
  }

  &[aria-disabled='true'] {
    cursor: default;
    opacity: 0.6;
  }
`;
