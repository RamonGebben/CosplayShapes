'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    height: 100%;
    scrollbar-color: ${({ theme }) => theme.color('quaternary', 'emphasis')}
      ${({ theme }) => theme.color('background')};
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: clip;
  }

  body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.color('background', 'text')};
    background: ${({ theme }) => theme.color('background')};
    font-family: ${({ theme }) => theme.fontFamily('base')};
    font-size: ${({ theme }) => theme.fontSize('base')};
    line-height: 1.4;
    caret-color: ${({ theme }) => theme.color('secondary')};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background: ${({ theme }) => theme.color('tertiary')};
    color: ${({ theme }) => theme.color('tertiary', 'text')};
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.color('secondary')};
    outline-offset: 2px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select {
    font: inherit;
    color: inherit;
  }
`;
