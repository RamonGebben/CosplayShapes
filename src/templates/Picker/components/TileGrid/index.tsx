'use client';

import styled from 'styled-components';

export const TileGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
  list-style: none;
`;
