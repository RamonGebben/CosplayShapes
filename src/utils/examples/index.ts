import { getMaterial } from '~/utils/materials';
import { buildPattern } from '~/utils/pattern';
import {
  getExampleDims,
  getExampleOptions,
  getShape,
  type ShapeSlug,
} from '~/utils/shapes';

/** The example pattern a shape's tile shows, in EVA foam. */
export const buildExample = (slug: ShapeSlug) => {
  const shape = getShape(slug);
  const result = buildPattern(slug, {
    dims: getExampleDims(shape),
    options: getExampleOptions(shape),
    material: getMaterial('eva'),
    thicknessMm: 0,
    seamMm: 0,
  });
  if (!result.ok) throw new Error(`Example for ${slug}: ${result.message}`);
  return result.pattern;
};
