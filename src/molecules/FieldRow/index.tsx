import type { ReactNode } from 'react';
import { VisuallyHidden } from '~/atoms/VisuallyHidden';
import { Label } from './components/Label';
import { Message } from './components/Message';
import { Row } from './components/Row';
import { Unit } from './components/Unit';

export interface FieldRowProps {
  id: string;
  label: string;
  unit?: string;
  /** Spoken unit name, when the visible one is an abbreviation. */
  unitName?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** The ids a field's control points aria-describedby at. */
export const describedBy = (id: string, error?: string, hint?: string) =>
  [error ? `${id}-error` : '', hint ? `${id}-hint` : '']
    .filter(Boolean)
    .join(' ') || undefined;

/** One measurement per line: label, value, unit, and its message below. */
export const FieldRow = ({
  id,
  label,
  unit,
  unitName,
  error,
  hint,
  children,
}: FieldRowProps) => (
  <Row $wide={unit === undefined}>
    <Label htmlFor={id}>
      {label}
      {unitName && <VisuallyHidden> in {unitName}</VisuallyHidden>}
    </Label>
    {children}
    {unit !== undefined && <Unit aria-hidden="true">{unit}</Unit>}
    {hint && !error && (
      <Message id={`${id}-hint`} $tone="hint">
        {hint}
      </Message>
    )}
    {error && (
      <Message id={`${id}-error`} $tone="error">
        {error}
      </Message>
    )}
  </Row>
);
