'use client';

import styled from 'styled-components';

export const Title = styled.h1`
  max-width: 320px;
  color: ${({ theme }) => theme.color('primary')};
  font-family: ${({ theme }) => theme.fontFamily('heading')};
  font-size: ${({ theme }) => theme.fontSize('xl')};
  font-weight: ${({ theme }) => theme.fontWeight('semibold')};
  /* A length, not a ratio, so inline children like Code inherit the same
     line box instead of recomputing it from their own font size. */
  line-height: ${({ theme }) =>
    `calc(${theme.fontSize('xl')} * ${theme.lineHeight('tight')})`};
  letter-spacing: -0.06em;
  text-wrap: balance;
`;
