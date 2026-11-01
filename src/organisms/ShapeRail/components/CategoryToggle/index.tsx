'use client';

import styled from 'styled-components';

/** The category name in the rail, which folds its shapes away. */
export const CategoryToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: 0;
  background: none;
  font-size: ${({ theme }) => theme.fontSize('xs')};
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  text-align: left;
  color: ${({ theme }) => theme.color('primary', 'emphasis')};
  cursor: pointer;
  transition: color 0.15s ease-out;

  & > svg {
    margin-left: auto;
  }

  &[aria-expanded='true'] {
    color: ${({ theme }) => theme.color('primary', 'text')};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${({ theme }) => theme.color('tertiary')};
    }
  }

  &:focus-visible {
    outline-color: ${({ theme }) => theme.color('tertiary')};
    outline-offset: -3px;
  }
`;
