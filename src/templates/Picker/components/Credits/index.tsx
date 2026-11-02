'use client';

import styled from 'styled-components';

/** The maker's credit and support link, set small under the facts. */
export const Credits = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: ${({ theme }) => theme.fontSize('s')};
  color: ${({ theme }) => theme.color('primary', 'emphasis')};

  & a {
    font-weight: ${({ theme }) => theme.fontWeight('bold')};
    color: ${({ theme }) => theme.color('primary', 'text')};
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    & a:hover {
      color: ${({ theme }) => theme.color('tertiary')};
    }
  }
`;
