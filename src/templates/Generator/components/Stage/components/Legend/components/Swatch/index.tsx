'use client';

import styled, { css } from 'styled-components';

type Kind = 'cut' | 'guide' | 'notch' | 'lit' | 'grid' | 'pages';

/** A sample of each line, drawn the way the pattern draws it. */
export const Swatch = styled.i<{ $kind: Kind }>`
  display: inline-block;
  flex: none;
  width: 22px;
  height: 0;
  border-top: 1px solid ${({ theme }) => theme.color('quaternary')};

  ${({ $kind, theme }) => {
    switch ($kind) {
      case 'guide':
        return css`
          border-top: 1px dashed ${theme.color('primary')};
        `;
      case 'notch':
        return css`
          width: 2px;
          height: 10px;
          border: 0;
          background: ${theme.color('quaternary')};
        `;
      case 'lit':
        return css`
          border-top: 3px solid ${theme.color('secondary')};
        `;
      case 'grid':
        // Four cells of the grid itself, so it can't pass for a checkbox.
        return css`
          width: 14px;
          height: 14px;
          border: 1px solid ${theme.color('quaternary', 'emphasis')};
          background:
            linear-gradient(${theme.color('quaternary', 'emphasis')} 0 0)
              center / 1px 100% no-repeat,
            linear-gradient(${theme.color('quaternary', 'emphasis')} 0 0)
              center / 100% 1px no-repeat;
          opacity: 0.55;
        `;
      case 'pages':
        return css`
          border-top: 2px dotted ${theme.color('quaternary', 'emphasis')};
        `;
      default:
        return css``;
    }
  }}
`;
