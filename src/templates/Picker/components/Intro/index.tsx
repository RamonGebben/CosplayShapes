'use client';

import styled from 'styled-components';

export const Intro = styled.header`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing('m')};
  padding: 56px 18% 48px 48px;
  color: ${({ theme }) => theme.color('primary', 'text')};
  isolation: isolate;

  & h1 {
    font-size: min(${({ theme }) => theme.fontSize('xl')}, 7.4vw);
  }

  & h1 span {
    color: ${({ theme }) => theme.color('tertiary')};
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    padding: 40px ${theme.spacing('base')} 72px;

    & h1 {
      font-size: min(${theme.fontSize('xl')}, 15vw);
    }
  `}
`;
