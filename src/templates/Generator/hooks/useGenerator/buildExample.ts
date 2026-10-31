import { initialState, toBuildInput } from '~/utils/generatorState';
import { buildPattern } from '~/utils/pattern';
import type { ShapeSlug } from '~/utils/shapes';

/** The shape's example pattern, which must always build. */
export const buildExample = (slug: ShapeSlug) => {
  const result = buildPattern(slug, toBuildInput(initialState(slug)).input);
  if (!result.ok) throw new Error(`Example for ${slug}: ${result.message}`);
  return result.pattern;
};
