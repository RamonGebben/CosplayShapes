'use client';

import styled from 'styled-components';

export const GroupHeading = styled.h2`
  margin: 0 4px 6px;
  font-size: ${({ theme }) => theme.fontSize('xxs')};
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color('primary', 'emphasis')};

  ${({ theme }) => theme.mq.lessThan('tabletLandscape')`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  `}
`;
