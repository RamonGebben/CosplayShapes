'use client';

import styled, { css } from 'styled-components';

/**
 * Buttons and button-styled links. The primary one is ink; its accent span
 * picks up the yellow highlight.
 */
export const ActionButton = styled.button<{
  $variant: 'primary' | 'secondary';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing('xs')};
  padding: 11px 18px;
  border: ${({ theme }) => theme.borderWidth('base')} solid
    ${({ theme }) => theme.color('quaternary')};
  border-radius: ${({ theme }) => theme.borderRadius('base')};
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease-out,
    color 0.15s ease-out;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? css`
          background: ${theme.color('quaternary')};
          color: ${theme.color('quaternary', 'text')};

          & span {
            color: ${theme.color('tertiary')};
          }
        `
      : css`
          background: ${theme.color('background', 'emphasis')};
          color: ${theme.color('background', 'text')};
        `}

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      background: ${({ $variant, theme }) =>
        $variant === 'primary'
          ? theme.color('primary')
          : theme.color('tertiary')};
      border-color: ${({ $variant, theme }) =>
        $variant === 'primary'
          ? theme.color('primary')
          : theme.color('quaternary')};
    }
  }

  &:disabled {
    cursor: progress;
    opacity: 0.6;
  }
`;
