'use client';

import styled from 'styled-components';
import { ActionButton } from '~/atoms/ActionButton';

/** The caret half, beside the main action. */
export const Toggle = styled(ActionButton)`
  flex: none;
  padding-inline: 14px;

  &[aria-expanded='true'] {
    background: ${({ theme }) => theme.color('primary')};
    border-color: ${({ theme }) => theme.color('primary')};
  }
`;
