import {
  generatorReducer,
  initialState,
  isMeasuredAcross,
  parsePreferences,
  type GeneratorAction,
  type GeneratorState,
} from '~/utils/generatorState';
import { SITE, shapePath } from '~/utils/seo';
import { getShape, isRoundField, type ShapeSlug } from '~/utils/shapes';

/**
 * Bumped only when a key changes meaning, so links on printed patterns can be
 * migrated rather than misread.
 */
const SHARE_VERSION = '1';

/** A round field given across goes in the URL under its key plus this. */
const DIAMETER_SUFFIX = '_d';

/** A page's query, as `useSearchParams` or `URLSearchParams` gives it. */
export type Search = Pick<URLSearchParams, 'get'>;

/** Whether a query carries settings the site wrote, not just tracking tags. */
export const hasSettings = (search: Search) => search.get('v') !== null;

/** The settings written as typed, and the ones written as a 0/1 flag. */
const TEXT_KEYS = ['thickness', 'seamAmount'] as const;
const FLAG_KEYS = ['compensate', 'seam'] as const;

const flag = (value: boolean) => (value ? '1' : '0');

const parseFlag = (value: string | undefined) =>
  value === '1' ? true : value === '0' ? false : undefined;

/**
 * Everything the maker set, as typed and in their unit, so the link builds
 * the same pattern even if the examples change later. A round field keeps
 * whichever of its pair was typed.
 */
export const toSearch = (state: GeneratorState) => {
  const shape = getShape(state.slug);
  return new URLSearchParams([
    ['v', SHARE_VERSION],
    ['unit', state.unit],
    ...shape.fields.map(({ key }) =>
      isMeasuredAcross(state, key)
        ? [`${key}${DIAMETER_SUFFIX}`, state.diameters[key]]
        : [key, state.dims[key]],
    ),
    ...shape.options.map(({ key }) => [key, flag(state.options[key])]),
    ['material', state.material],
    ...TEXT_KEYS.map(key => [key, state[key]]),
    ...FLAG_KEYS.map(key => [key, flag(state[key])]),
    ['paper', state.paper],
  ]).toString();
};

/**
 * The link that opens this exact pattern, for the PDF's QR code and sharing.
 * On the live site by default; pass the page's origin to stay on this host.
 */
export const shareUrl = (state: GeneratorState, origin: string = SITE.url) =>
  `${origin}${shapePath(state.slug)}?${toSearch(state)}`;

/**
 * The generator's starting state for a query: the shape's example, with
 * whatever the query sets on top. Values go in as text so a broken one shows
 * its usual error; an unknown unit, material or paper is ignored.
 */
export const stateFromSearch = (
  slug: ShapeSlug,
  search: Search,
): GeneratorState => {
  const get = (key: string) => search.get(key) ?? undefined;
  const shape = getShape(slug);
  const start = initialState(
    slug,
    parsePreferences({
      unit: get('unit'),
      material: get('material'),
      paper: get('paper'),
    }),
  );
  /** The action for a value the query sets, or none when it's missing. */
  const when = <T>(
    value: T | undefined,
    action: (value: T) => GeneratorAction,
  ) => (value === undefined ? [] : [action(value)]);
  const actions: Array<GeneratorAction> = [
    ...shape.fields.flatMap(field => {
      const { key } = field;
      const across = get(`${key}${DIAMETER_SUFFIX}`);
      if (across !== undefined && isRoundField(field))
        return [{ type: 'diameter', key, value: across } as const];
      return when(get(key), value => ({ type: 'dim', key, value }));
    }),
    ...shape.options.flatMap(({ key }) =>
      when(parseFlag(get(key)), value => ({ type: 'option', key, value })),
    ),
    ...TEXT_KEYS.flatMap(type => when(get(type), value => ({ type, value }))),
    ...FLAG_KEYS.flatMap(type =>
      when(parseFlag(get(type)), value => ({ type, value })),
    ),
  ];
  return actions.reduce(generatorReducer, start);
};
