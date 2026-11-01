'use client';

import styled from 'styled-components';

export const Wrapper = styled.section`
  border-bottom: 1px solid
    ${({ theme }) => theme.color('formBackground', 'emphasis')};
`;
