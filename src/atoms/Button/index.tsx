'use client';

import styled, { css } from 'styled-components';

export const Button = styled.a<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('s')};
  width: fit-content;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing('base')};
  border-radius: ${({ theme }) => theme.borderRadius('full')};
  border: ${({ theme }) => theme.borderWidth('s')} solid transparent;
  font-size: ${({ theme }) => theme.fontSize('s')};
  font-weight: ${({ theme }) => theme.fontWeight('medium')};
  transition: 0.2s;
  cursor: pointer;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? css`
          background: ${theme.color('primary')};
          color: ${theme.color('primary', 'text')};
        `
      : css`
          border-color: ${theme.color('secondary')};
        `}

  /* Hover only on non-touch devices */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ $variant, theme }) => theme.color($variant, 'emphasis')};
      border-color: transparent;
    }
  }
`;
