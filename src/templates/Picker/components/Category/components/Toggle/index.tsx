'use client';

import styled from 'styled-components';

/** A category's heading row on the picker, which folds its tiles away. */
export const Toggle = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('base')};
  width: calc(100% + 24px);
  margin: 0 -12px;
  padding: 14px 12px;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease-out;

  & > span {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: ${({ theme }) => theme.spacing('base')};
    row-gap: 4px;
  }

  & strong {
    font-family: ${({ theme }) => theme.fontFamily('heading')};
    font-size: ${({ theme }) => theme.fontSize('m')};
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  & strong + span {
    font-size: ${({ theme }) => theme.fontSize('xs')};
    font-weight: ${({ theme }) => theme.fontWeight('regular')};
    color: ${({ theme }) => theme.color('quaternary', 'emphasis')};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.color('tertiary')};
    }
  }

  &:focus-visible {
    outline-offset: -3px;
  }
`;
