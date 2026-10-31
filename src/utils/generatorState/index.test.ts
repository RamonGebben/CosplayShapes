import { describe, expect, it } from 'vitest';
import { generatorReducer, initialState, toBuildInput } from '.';

describe('generatorReducer', () => {
  it('starts from the shape’s example measurements in cm', () => {
    const state = initialState('truncated-cone');
    expect(state.dims).toEqual({ top: '26.0', bottom: '32.0', height: '18.0' });
    expect(state.thickness).toBe('6');
  });

  it('converts typed values when the unit changes instead of resetting them', () => {
    const state = generatorReducer(initialState('cylinder'), {
      type: 'unit',
      unit: 'in',
    });
    expect(state.dims.circumference).toBe('11.02');
    expect(state.dims.height).toBe('2.36');
    const back = generatorReducer(state, { type: 'unit', unit: 'cm' });
    expect(back.dims.circumference).toBe('28.0');
  });

  it('keeps half-typed text through a unit switch', () => {
    const typed = generatorReducer(initialState('cylinder'), {
      type: 'dim',
      key: 'height',
      value: 'abc',
    });
    const state = generatorReducer(typed, { type: 'unit', unit: 'in' });
    expect(state.dims.height).toBe('abc');
  });

  it('applies a material’s usual thickness and seam settings', () => {
    const state = generatorReducer(initialState('dome'), {
      type: 'material',
      material: 'fabric',
    });
    expect(state).toMatchObject({
      thickness: '0',
      compensate: false,
      seam: true,
      seamAmount: '1.0',
    });
  });
});

describe('toBuildInput', () => {
  it('reads lengths as mm and counts as they are', () => {
    const { input, errors } = toBuildInput(initialState('dome'));
    expect(errors).toEqual({});
    expect(input.dims).toEqual({ circumference: 600, height: 95, gores: 8 });
    expect(input.thicknessMm).toBe(6);
  });

  it('reports every field it can’t read', () => {
    const state = generatorReducer(
      generatorReducer(initialState('cone'), {
        type: 'dim',
        key: 'height',
        value: '',
      }),
      { type: 'thickness', value: '12' },
    );
    expect(Object.keys(toBuildInput(state).errors).sort()).toEqual([
      'height',
      'thickness',
    ]);
  });

  it('ignores thickness when compensation is off', () => {
    const state = generatorReducer(initialState('cone'), {
      type: 'compensate',
      value: false,
    });
    expect(toBuildInput(state).input.thicknessMm).toBe(0);
  });
});
