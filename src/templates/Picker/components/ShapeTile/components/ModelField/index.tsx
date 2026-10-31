'use client';

import styled from 'styled-components';

/**
 * The finished form on the ultramarine field, cut by the title card's
 * diagonal with its magenta edge.
 */
export const ModelField = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  min-height: 0;
  padding: 10px 18% 10px 10px;
  color: ${({ theme }) => theme.color('primary', 'text')};
  background: ${({ theme }) => theme.color('primary')};
  clip-path: polygon(0 0, 100% 0, 78% 100%, 0 100%);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.color('secondary')};
    clip-path: polygon(96% 0, 100% 0, 78% 100%, 74% 100%);
  }
`;
