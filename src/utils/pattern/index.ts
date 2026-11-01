import { getShape, type ShapeSlug } from '~/utils/shapes';
import { box, prism, pyramid, taperedPrism } from './flat';
import { cone, cylinder, dome, sphere, truncatedCone } from './round';
import type { BuildInput, BuildResult } from './types';

export type {
  BuildInput,
  BuildResult,
  Fact,
  ModelLine,
  ModelSpec,
  Pattern,
  PatternEdge,
  Piece,
  Point,
  Polyline,
} from './types';
export { bounds, pieceSize } from './geometry';

const BUILDERS: Record<ShapeSlug, (input: BuildInput) => BuildResult> = {
  cylinder,
  cone,
  'truncated-cone': truncatedCone,
  dome,
  sphere,
  box,
  pyramid,
  prism,
  'tapered-prism': taperedPrism,
};

/** Five metres: past this a value is far more likely a unit slip than a prop. */
export const MAX_LENGTH_MM = 5000;

const GORE_NOTE =
  'Gores join edge to edge. Line up the middle notches before gluing towards the tips.';

/** Checks every measurement before any geometry runs. */
const validate = (slug: ShapeSlug, input: BuildInput) => {
  const shape = getShape(slug);
  return shape.fields
    .map(field => {
      const value = input.dims[field.key];
      if (!Number.isFinite(value))
        return {
          field: field.key,
          message: `Enter a number for ${field.label.toLowerCase()}.`,
        };
      if (field.kind === 'count') {
        if (!Number.isInteger(value) || value < field.min || value > field.max)
          return {
            field: field.key,
            message: `Use a whole number from ${field.min} to ${field.max}.`,
          };
        return undefined;
      }
      if (value <= 0)
        return { field: field.key, message: 'Enter a length greater than 0.' };
      if (value > MAX_LENGTH_MM)
        return {
          field: field.key,
          message: 'That is over 5 metres. Check the unit is right.',
        };
      return undefined;
    })
    .find(error => error !== undefined);
};

export const buildPattern = (
  slug: ShapeSlug,
  input: BuildInput,
): BuildResult => {
  const error = validate(slug, input);
  if (error) return { ok: false, ...error };
  const result = BUILDERS[slug](input);
  if (!result.ok) return result;
  const gored = slug === 'dome' || slug === 'sphere';
  return gored
    ? {
        ok: true,
        pattern: {
          ...result.pattern,
          notes: [...result.pattern.notes, GORE_NOTE],
        },
      }
    : result;
};
