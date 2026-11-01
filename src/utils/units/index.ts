export type Unit = 'cm' | 'in';

const MM_PER: Record<Unit, number> = { cm: 10, in: 25.4 };

/** Decimal places a length shows with in each unit. */
const PLACES: Record<Unit, number> = { cm: 1, in: 2 };

export const toUnit = (mm: number, unit: Unit) => mm / MM_PER[unit];

export const fromUnit = (value: number, unit: Unit) => value * MM_PER[unit];

export const roundTo = (value: number, places: number) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

/**
 * A length as the number an input shows, rounded to the unit's precision
 * plus any extra places.
 */
export const toInputValue = (mm: number, unit: Unit, extraPlaces = 0) => {
  const places = PLACES[unit] + extraPlaces;
  return roundTo(toUnit(mm, unit), places).toFixed(places);
};

/** A length with its unit, joined by a no-break space so they never part. */
export const formatLength = (mm: number, unit: Unit, places = PLACES[unit]) =>
  `${toUnit(mm, unit).toFixed(places)}\u00a0${unit}`;

/** Parses what a maker typed, accepting a comma as the decimal separator. */
export const parseInput = (raw: string): number | undefined => {
  const normalised = raw.trim().replace(',', '.');
  if (normalised === '' || !/^-?\d*\.?\d+$|^-?\d+\.$/.test(normalised))
    return undefined;
  return Number(normalised);
};
