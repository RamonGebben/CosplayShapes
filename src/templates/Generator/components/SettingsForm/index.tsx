'use client';

import type { Dispatch } from 'react';
import { Input } from '~/atoms/Input';
import { Select } from '~/atoms/Select';
import { FieldRow, describedBy } from '~/molecules/FieldRow';
import { SegmentedControl } from '~/molecules/SegmentedControl';
import { ToggleField } from '~/molecules/ToggleField';
import type {
  FieldErrors,
  GeneratorAction,
  GeneratorState,
} from '~/utils/generatorState';
import { MATERIALS, getMaterial, type MaterialId } from '~/utils/materials';
import type { Fact } from '~/utils/pattern';
import { hasRoundFields, isRoundField, type Shape } from '~/utils/shapes';
import type { Unit } from '~/utils/units';
import { Column } from './components/Column';
import { MeasureHelp } from './components/MeasureHelp';
import { Readout } from './components/Readout';
import { RoundPair } from './components/RoundPair';
import { Section } from './components/Section';

const UNIT_NAMES: Record<Unit, string> = {
  cm: 'centimetres',
  in: 'inches',
};

export interface SettingsFormProps {
  shape: Shape;
  state: GeneratorState;
  errors: FieldErrors;
  dispatch: Dispatch<GeneratorAction>;
  /** Lights the edges a measurement belongs to while it is being edited. */
  onEdge: (edge: string) => void;
  facts: Array<Fact>;
  notes: Array<string>;
}

export const SettingsForm = ({
  shape,
  state,
  errors,
  dispatch,
  onEdge,
  facts,
  notes,
}: SettingsFormProps) => {
  const material = getMaterial(state.material);
  const field = (key: string) => ({
    id: `field-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': describedBy(`field-${key}`, errors[key]),
  });
  return (
    <Column
      aria-label="Pattern settings"
      onSubmit={event => event.preventDefault()}
    >
      <SegmentedControl
        label="Units"
        options={[
          { value: 'cm', label: 'Metric (cm)' },
          { value: 'in', label: 'Imperial (in)' },
        ]}
        value={state.unit}
        onChange={unit => dispatch({ type: 'unit', unit })}
      />
      <Section title="Size" aside={`Example: ${shape.example.toLowerCase()}`}>
        {hasRoundFields(shape) && <MeasureHelp />}
        {shape.fields.map(item => {
          if (isRoundField(item))
            return (
              <RoundPair
                key={item.key}
                field={item}
                state={state}
                errors={errors}
                dispatch={dispatch}
                unitName={UNIT_NAMES[state.unit]}
                onFocus={() => onEdge(item.edge)}
              />
            );
          return (
            <FieldRow
              key={item.key}
              id={`field-${item.key}`}
              label={item.label}
              unit={item.kind === 'length' ? state.unit : (item.unit ?? '')}
              unitName={
                item.kind === 'length' ? UNIT_NAMES[state.unit] : item.unitName
              }
              error={errors[item.key]}
              hint={item.hint}
            >
              <Input
                {...field(item.key)}
                aria-describedby={describedBy(
                  `field-${item.key}`,
                  errors[item.key],
                  item.hint,
                )}
                inputMode={item.kind === 'count' ? 'numeric' : 'decimal'}
                autoComplete="off"
                value={state.dims[item.key]}
                onFocus={() => onEdge(item.edge)}
                onChange={event =>
                  dispatch({
                    type: 'dim',
                    key: item.key,
                    value: event.target.value,
                  })
                }
              />
            </FieldRow>
          );
        })}
        {shape.options.map(option => (
          <ToggleField
            key={option.key}
            label={option.label}
            hint={option.hint}
            checked={Boolean(state.options[option.key])}
            onChange={value =>
              dispatch({ type: 'option', key: option.key, value })
            }
          />
        ))}
      </Section>
      <Section title="Material" aside={material.name}>
        <FieldRow id="field-material" label="Material">
          <Select
            id="field-material"
            value={state.material}
            onChange={event =>
              dispatch({
                type: 'material',
                material: event.target.value as MaterialId,
              })
            }
          >
            {MATERIALS.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </FieldRow>
        <FieldRow
          id="field-thickness"
          label="Thickness"
          unit="mm"
          unitName="millimetres"
          error={errors.thickness}
        >
          <Input
            {...field('thickness')}
            inputMode="decimal"
            autoComplete="off"
            value={state.thickness}
            onChange={event =>
              dispatch({ type: 'thickness', value: event.target.value })
            }
          />
        </FieldRow>
        <ToggleField
          label="Compensate for thickness"
          hint="Measure the body or form it goes around. The pattern is drawn at the middle of the material so it still fits."
          checked={state.compensate}
          onChange={value => dispatch({ type: 'compensate', value })}
        />
        <ToggleField
          label="Seam allowance"
          hint={
            material.join === 'butt'
              ? 'Usually off for foam and Worbla: cut edges butt together.'
              : 'Adds a cutting margin outside the stitch line.'
          }
          checked={state.seam}
          onChange={value => dispatch({ type: 'seam', value })}
        />
        {state.seam && (
          <FieldRow
            id="field-seamAmount"
            label="Allowance"
            unit={state.unit}
            unitName={UNIT_NAMES[state.unit]}
            error={errors.seamAmount}
          >
            <Input
              {...field('seamAmount')}
              inputMode="decimal"
              autoComplete="off"
              value={state.seamAmount}
              onChange={event =>
                dispatch({ type: 'seamAmount', value: event.target.value })
              }
            />
          </FieldRow>
        )}
      </Section>
      <Readout
        facts={facts}
        unit={state.unit}
        notes={[material.joinNote, ...notes]}
      />
    </Column>
  );
};
