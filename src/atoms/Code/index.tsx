'use client';

import styled from 'styled-components';

export const Code = styled.code`
  padding: 0.1em 0.4em;
  border-radius: ${({ theme }) => theme.borderRadius('s')};
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-family: ${({ theme }) => theme.fontFamily('mono')};
  font-size: 0.9em;
`;
