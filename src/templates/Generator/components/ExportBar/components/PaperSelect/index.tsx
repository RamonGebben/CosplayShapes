'use client';

import styled from 'styled-components';
import { Select } from '~/atoms/Select';
import { PAPERS, PAPER_FAMILIES, type PaperId } from '~/utils/layout';

/** Sized and weighted like the action buttons it sits between. */
const Field = styled(Select)`
  align-self: stretch;
  width: auto;
  flex: none;
  padding: 11px 42px 11px 18px;
  background-color: ${({ theme }) => theme.color('background', 'emphasis')};
  background-position: right 16px center;
  color: ${({ theme }) => theme.color('background', 'text')};
  font-weight: ${({ theme }) => theme.fontWeight('bold')};
  transition: background-color 0.15s ease-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.color('tertiary')};
    }
  }
`;

export interface PaperSelectProps {
  value: PaperId;
  onChange: (paper: PaperId) => void;
}

/** Every sheet size, grouped ISO then US. */
export const PaperSelect = ({ value, onChange }: PaperSelectProps) => (
  <Field
    aria-label="Paper size"
    value={value}
    onChange={event => onChange(event.target.value as PaperId)}
  >
    {PAPER_FAMILIES.map(family => (
      <optgroup key={family} label={family}>
        {Object.values(PAPERS)
          .filter(paper => paper.family === family)
          .map(paper => (
            <option key={paper.id} value={paper.id}>
              {paper.name}
            </option>
          ))}
      </optgroup>
    ))}
  </Field>
);
