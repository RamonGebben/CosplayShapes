'use client';

import styled from 'styled-components';

export const Facts = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing('l')};
  list-style: none;
  color: ${({ theme }) => theme.color('primary', 'emphasis')};

  & li::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    background: ${({ theme }) => theme.color('tertiary')};
  }
`;
