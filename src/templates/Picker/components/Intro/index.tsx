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

  /* Pinned at full height while the shapes scroll past, when the window is tall enough to show all
     of it; a shorter window lets it scroll with the page instead of cutting off the facts. */
  @media (min-height: 680px) {
    position: sticky;
    top: 0;
    align-self: start;
    height: 100svh;
  }

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    position: relative;
    align-self: auto;
    height: auto;
    padding: 40px ${theme.spacing('base')} 72px;

    & h1 {
      font-size: min(${theme.fontSize('xl')}, 15vw);
    }
  `}
`;
