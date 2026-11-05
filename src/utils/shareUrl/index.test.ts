import { describe, expect, it } from 'vitest';
import {
  generatorReducer,
  initialState,
  toBuildInput,
} from '~/utils/generatorState';
import { SHAPES, isRoundField } from '~/utils/shapes';
import { hasSettings, shareUrl, stateFromSearch, toSearch } from '.';

const parse = (query: string) =>
  Object.fromEntries(new URLSearchParams(query).entries());

const roundTrip = (state: ReturnType<typeof initialState>) =>
  stateFromSearch(state.slug, new URLSearchParams(toSearch(state)));

describe('toSearch', () => {
  it('writes every setting as typed, in the maker’s unit', () => {
    expect(parse(toSearch(initialState('cylinder', { unit: 'in' })))).toEqual({
      v: '1',
      unit: 'in',
      circumference: '11.02',
      height: '2.36',
      ends: '0',
      material: 'eva',
      thickness: '6',
      compensate: '1',
      seam: '0',
      seamAmount: '0.39',
      paper: 'a4',
    });
  });

  it('keeps a round field as the diameter when that is what was typed', () => {
    const state = generatorReducer(initialState('cylinder'), {
      type: 'diameter',
      key: 'circumference',
      value: '10',
    });
    const query = parse(toSearch(state));
    expect(query.circumference_d).toBe('10');
    expect(query).not.toHaveProperty('circumference');
  });
});

describe('stateFromSearch', () => {
  it('starts from the example when the query is empty', () => {
    expect(stateFromSearch('cone', new URLSearchParams())).toEqual(
      initialState('cone'),
    );
  });

  it.each(SHAPES.map(shape => shape.slug))(
    'builds the same %s pattern from the link as from the page',
    slug => {
      const edited = [
        { type: 'unit', unit: 'in' },
        { type: 'material', material: 'fabric' },
        { type: 'seamAmount', value: '0.5' },
        { type: 'paper', paper: 'letter' },
      ] as const;
      const state = edited.reduce(generatorReducer, initialState(slug));
      const back = roundTrip(state);
      expect(back.dims).toEqual(state.dims);
      expect(toBuildInput(back)).toEqual(toBuildInput(state));
    },
  );

  it('rebuilds a round field’s pair from the diameter and remembers it', () => {
    const state = generatorReducer(initialState('cylinder'), {
      type: 'diameter',
      key: 'circumference',
      value: '10',
    });
    const back = roundTrip(state);
    expect(back.diameters.circumference).toBe('10');
    expect(back.dims.circumference).toBe('31.4');
    expect(back.measuredBy.circumference).toBe('diameter');
  });

  it('keeps unreadable values as text so the form shows their errors', () => {
    const state = stateFromSearch(
      'cylinder',
      new URLSearchParams({ height: 'abc', thickness: '99' }),
    );
    expect(state.dims.height).toBe('abc');
    expect(state.thickness).toBe('99');
  });

  it('ignores an unknown unit, material, paper or flag', () => {
    const state = stateFromSearch(
      'cylinder',
      new URLSearchParams({
        unit: 'furlong',
        material: 'steel',
        paper: 'b5',
        ends: 'yes',
      }),
    );
    expect(state).toEqual(initialState('cylinder'));
  });
});

describe('shareUrl', () => {
  it('uses the given origin instead of the live site', () => {
    expect(shareUrl(initialState('dome'), 'http://localhost:3000')).toMatch(
      /^http:\/\/localhost:3000\/dome\?v=1&/,
    );
  });

  it('points at the shape page with the full query', () => {
    expect(shareUrl(initialState('dome'))).toMatch(
      /^https:\/\/cosplayshapes\.ra-ge\.net\/dome\?v=1&unit=cm&/,
    );
  });
});

describe('hasSettings', () => {
  it('is true for a link the site wrote', () => {
    expect(hasSettings(new URLSearchParams({ v: '1', unit: 'in' }))).toBe(true);
  });

  it('is false for a clean or tracking-only query', () => {
    expect(hasSettings(new URLSearchParams())).toBe(false);
    expect(hasSettings(new URLSearchParams({ utm_source: 'pin' }))).toBe(false);
  });
});

describe('query keys', () => {
  it.each(SHAPES.map(shape => [shape.slug, shape] as const))(
    'never collide on the %s page',
    (slug, shape) => {
      // Every round field given across, so the diameter keys are written too.
      const across = shape.fields
        .filter(isRoundField)
        .reduce(
          (state, { key }) =>
            generatorReducer(state, { type: 'diameter', key, value: '10' }),
          initialState(slug),
        );
      [initialState(slug), across].forEach(state => {
        const keys = [...new URLSearchParams(toSearch(state)).keys()];
        expect(new Set(keys).size).toBe(keys.length);
      });
    },
  );
});
