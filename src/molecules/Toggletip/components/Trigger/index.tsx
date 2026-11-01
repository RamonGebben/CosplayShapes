'use client';

import styled from 'styled-components';

/** A small text button, underlined like a link, that opens extra help. */
export const Trigger = styled.button`
  flex-shrink: 0;
  padding: 2px 0;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.color('primary')};
  font-size: ${({ theme }) => theme.fontSize('xs')};
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
  cursor: pointer;
  transition: background-color 0.15s ease-out;

  &[aria-expanded='true'] {
    background: ${({ theme }) => theme.color('tertiary')};
    color: ${({ theme }) => theme.color('tertiary', 'text')};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color('secondary')};
    outline-offset: 0;
  }
`;
