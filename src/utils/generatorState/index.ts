import type { PaperId } from '~/utils/layout';
import {
  SEAM_RANGE_MM,
  THICKNESS_RANGE_MM,
  getMaterial,
  type MaterialId,
} from '~/utils/materials';
import type { BuildInput } from '~/utils/pattern';
import {
  getExampleDims,
  getExampleOptions,
  getShape,
  isRoundField,
  type RoundMeasure,
  type ShapeSlug,
} from '~/utils/shapes';
import {
  fromUnit,
  parseInput,
  roundTo,
  toInputValue,
  type Unit,
} from '~/utils/units';

/** What the maker has typed, kept as text so half-typed values survive. */
export interface GeneratorState {
  slug: ShapeSlug;
  unit: Unit;
  dims: Record<string, string>;
  /** Round fields given across, keyed like dims; each pair fills in the other. */
  diameters: Record<string, string>;
  /** Which of a round field's pair was typed last, so the pattern is built from it. */
  measuredBy: Record<string, RoundMeasure>;
  options: Record<string, boolean>;
  material: MaterialId;
  /** Always in mm: foam and Worbla are sold by the millimetre everywhere. */
  thickness: string;
  compensate: boolean;
  seam: boolean;
  /** In the display unit. */
  seamAmount: string;
  paper: PaperId;
}

export type GeneratorAction =
  | { type: 'unit'; unit: Unit }
  | { type: 'dim'; key: string; value: string }
  | { type: 'diameter'; key: string; value: string }
  | { type: 'option'; key: string; value: boolean }
  | { type: 'material'; material: MaterialId }
  | { type: 'thickness'; value: string }
  | { type: 'compensate'; value: boolean }
  | { type: 'seam'; value: boolean }
  | { type: 'seamAmount'; value: string }
  | { type: 'paper'; paper: PaperId };

const DEFAULT_SEAM_MM = 10;

const formatThickness = (mm: number) => String(roundTo(mm, 1));

/** Shows a stored length in the unit, or the raw text if it doesn't parse. */
const inUnit = (raw: string, from: Unit, to: Unit, extraPlaces = 0) => {
  const value = parseInput(raw);
  if (value === undefined) return raw;
  return toInputValue(fromUnit(value, from), to, extraPlaces);
};

// Dividing by π would round away a millimetre at the unit's usual precision,
// so diameters keep one more place.
const DIAMETER_EXTRA_PLACES = 1;

/** Works out one of a round field's pair from the other, blank if it doesn't parse. */
const counterpart = (raw: string, unit: Unit, to: RoundMeasure) => {
  const value = parseInput(raw);
  if (value === undefined) return '';
  const mm = fromUnit(value, unit);
  return to === 'diameter'
    ? toInputValue(mm / Math.PI, unit, DIAMETER_EXTRA_PLACES)
    : toInputValue(mm * Math.PI, unit);
};

/** Whether a round field was last typed as a diameter, so its errors belong there. */
export const isMeasuredAcross = (state: GeneratorState, key: string) =>
  state.measuredBy[key] === 'diameter';

/** The text the pattern is built from for a field, as a circumference if round. */
const typedLength = (state: GeneratorState, key: string) => {
  const raw = isMeasuredAcross(state, key)
    ? state.diameters[key]
    : state.dims[key];
  const value = parseInput(raw);
  if (value === undefined) return undefined;
  const mm = fromUnit(value, state.unit);
  return isMeasuredAcross(state, key) ? mm * Math.PI : mm;
};

export const initialState = (
  slug: ShapeSlug,
  preferences: Partial<
    Pick<GeneratorState, 'unit' | 'material' | 'paper'>
  > = {},
): GeneratorState => {
  const shape = getShape(slug);
  const unit = preferences.unit ?? 'cm';
  const material = getMaterial(preferences.material ?? 'eva');
  const examples = getExampleDims(shape);
  return {
    slug,
    unit,
    dims: Object.fromEntries(
      shape.fields.map(field => [
        field.key,
        field.kind === 'count'
          ? String(examples[field.key])
          : toInputValue(examples[field.key], unit),
      ]),
    ),
    diameters: Object.fromEntries(
      shape.fields
        .filter(isRoundField)
        .map(field => [
          field.key,
          toInputValue(
            examples[field.key] / Math.PI,
            unit,
            DIAMETER_EXTRA_PLACES,
          ),
        ]),
    ),
    measuredBy: {},
    options: getExampleOptions(shape),
    material: material.id,
    thickness: formatThickness(material.thicknessMm),
    compensate: material.compensate,
    seam: material.seam,
    seamAmount: toInputValue(material.seamMm || DEFAULT_SEAM_MM, unit),
    paper: preferences.paper ?? 'a4',
  };
};

const convertDims = (state: GeneratorState, unit: Unit) => {
  const shape = getShape(state.slug);
  return Object.fromEntries(
    shape.fields.map(field => [
      field.key,
      field.kind === 'count'
        ? state.dims[field.key]
        : inUnit(state.dims[field.key], state.unit, unit),
    ]),
  );
};

export const generatorReducer = (
  state: GeneratorState,
  action: GeneratorAction,
): GeneratorState => {
  switch (action.type) {
    case 'unit':
      if (action.unit === state.unit) return state;
      return {
        ...state,
        unit: action.unit,
        dims: convertDims(state, action.unit),
        diameters: Object.fromEntries(
          Object.entries(state.diameters).map(([key, raw]) => [
            key,
            inUnit(raw, state.unit, action.unit, DIAMETER_EXTRA_PLACES),
          ]),
        ),
        seamAmount: inUnit(state.seamAmount, state.unit, action.unit),
      };
    case 'dim':
      return {
        ...state,
        dims: { ...state.dims, [action.key]: action.value },
        ...(action.key in state.diameters && {
          diameters: {
            ...state.diameters,
            [action.key]: counterpart(action.value, state.unit, 'diameter'),
          },
          measuredBy: { ...state.measuredBy, [action.key]: 'circumference' },
        }),
      };
    case 'diameter':
      return {
        ...state,
        dims: {
          ...state.dims,
          [action.key]: counterpart(action.value, state.unit, 'circumference'),
        },
        diameters: { ...state.diameters, [action.key]: action.value },
        measuredBy: { ...state.measuredBy, [action.key]: 'diameter' },
      };
    case 'option':
      return {
        ...state,
        options: { ...state.options, [action.key]: action.value },
      };
    case 'material': {
      const material = getMaterial(action.material);
      return {
        ...state,
        material: material.id,
        thickness: formatThickness(material.thicknessMm),
        compensate: material.compensate,
        seam: material.seam,
        seamAmount: material.seam
          ? toInputValue(material.seamMm, state.unit)
          : state.seamAmount,
      };
    }
    case 'thickness':
      return { ...state, thickness: action.value };
    case 'compensate':
      return { ...state, compensate: action.value };
    case 'seam':
      return { ...state, seam: action.value };
    case 'seamAmount':
      return { ...state, seamAmount: action.value };
    case 'paper':
      return { ...state, paper: action.paper };
  }
};

export type FieldErrors = Record<string, string>;

const inRange = (value: number | undefined, min: number, max: number) =>
  value !== undefined && value >= min && value <= max;

/**
 * Turns the typed state into measurements in mm, collecting a message for
 * every field that can't be read. Geometry errors come later, from the
 * pattern builder.
 */
export const toBuildInput = (
  state: GeneratorState,
): { input: BuildInput; errors: FieldErrors } => {
  const shape = getShape(state.slug);
  const material = getMaterial(state.material);
  const dimErrors = shape.fields
    .filter(field =>
      field.kind === 'count'
        ? parseInput(state.dims[field.key]) === undefined
        : typedLength(state, field.key) === undefined,
    )
    .map(field => [field.key, 'Enter a number.'] as const);
  const thickness = parseInput(state.thickness);
  const seam = parseInput(state.seamAmount);
  const seamMm = seam === undefined ? undefined : fromUnit(seam, state.unit);
  const settingErrors = [
    ...(inRange(thickness, THICKNESS_RANGE_MM.min, THICKNESS_RANGE_MM.max)
      ? []
      : [['thickness', 'Use a thickness from 0 to 10 mm.'] as const]),
    ...(!state.seam ||
    inRange(seamMm, SEAM_RANGE_MM.min, SEAM_RANGE_MM.max + 0.001)
      ? []
      : [
          [
            'seamAmount',
            state.unit === 'cm'
              ? 'Use an allowance from 0 to 2 cm.'
              : 'Use an allowance from 0 to 0.79 in.',
          ] as const,
        ]),
  ];
  return {
    input: {
      dims: Object.fromEntries(
        shape.fields.map(field => [
          field.key,
          (field.kind === 'count'
            ? parseInput(state.dims[field.key])
            : typedLength(state, field.key)) ?? Number.NaN,
        ]),
      ),
      options: state.options,
      material,
      thicknessMm: state.compensate ? (thickness ?? 0) : 0,
      seamMm: state.seam ? Math.min(seamMm ?? 0, SEAM_RANGE_MM.max) : 0,
    },
    errors: Object.fromEntries([...dimErrors, ...settingErrors]),
  };
};
