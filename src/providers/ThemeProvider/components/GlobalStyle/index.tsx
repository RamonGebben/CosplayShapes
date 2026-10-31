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
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.color('background', 'text')};
    background: ${({ theme }) => theme.color('background')};
    font-family: ${({ theme }) => theme.fontFamily('base')};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
