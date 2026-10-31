'use client';

import styled from 'styled-components';

export const Viewport = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }

  & canvas {
    display: block;
  }

  &:focus-visible {
    outline-color: ${({ theme }) => theme.color('tertiary')};
    outline-offset: -3px;
  }
`;
