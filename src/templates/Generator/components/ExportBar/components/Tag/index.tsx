'use client';

import styled from 'styled-components';

/**
 * The "true scale" promise after Download PDF, left off on a phone: there's
 * no room for it beside the paper size.
 */
export const Tag = styled.span`
  ${({ theme }) => theme.mq.lessThan('mobile')`
    display: none;
  `}
`;
