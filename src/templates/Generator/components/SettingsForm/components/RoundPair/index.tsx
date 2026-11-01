import type { Dispatch } from 'react';
import { Input } from '~/atoms/Input';
import { FieldRow, describedBy } from '~/molecules/FieldRow';
import {
  isMeasuredAcross,
  type FieldErrors,
  type GeneratorAction,
  type GeneratorState,
} from '~/utils/generatorState';
import type { RoundField } from '~/utils/shapes';

export interface RoundPairProps {
  field: RoundField;
  state: GeneratorState;
  errors: FieldErrors;
  dispatch: Dispatch<GeneratorAction>;
  unitName: string;
  onFocus: () => void;
}

/**
 * A round edge as two linked rows, around and across. Typing in either works
 * out the other, and its error shows on whichever was typed.
 */
export const RoundPair = ({
  field,
  state,
  errors,
  dispatch,
  unitName,
  onFocus,
}: RoundPairProps) => {
  const across = isMeasuredAcross(state, field.key);
  const rows = [
    {
      id: `field-${field.key}`,
      label: field.label,
      value: state.dims[field.key],
      error: across ? undefined : errors[field.key],
      onChange: (value: string) =>
        dispatch({ type: 'dim', key: field.key, value }),
    },
    {
      id: `field-${field.key}-diameter`,
      label: field.diameterLabel,
      value: state.diameters[field.key],
      error: across ? errors[field.key] : undefined,
      onChange: (value: string) =>
        dispatch({ type: 'diameter', key: field.key, value }),
    },
  ];
  return rows.map((row, index) => (
    <FieldRow
      key={row.id}
      id={row.id}
      label={row.label}
      unit={state.unit}
      unitName={unitName}
      error={row.error}
      joined={index === 0}
    >
      <Input
        id={row.id}
        aria-invalid={row.error ? true : undefined}
        aria-describedby={describedBy(row.id, row.error)}
        inputMode="decimal"
        autoComplete="off"
        value={row.value}
        onFocus={onFocus}
        onChange={event => row.onChange(event.target.value)}
      />
    </FieldRow>
  ));
};
