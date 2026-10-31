'use client';

import styled from 'styled-components';

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  accent-color: ${({ theme }) => theme.color('secondary', 'emphasis')};
  cursor: pointer;
`;
