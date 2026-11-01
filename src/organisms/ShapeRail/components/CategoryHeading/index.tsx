'use client';

import styled from 'styled-components';

/** Holds a category's toggle; gone in the phone strip, where every shape shows and nothing folds. */
export const CategoryHeading = styled.h3`
  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    display: none;
  `}
`;
