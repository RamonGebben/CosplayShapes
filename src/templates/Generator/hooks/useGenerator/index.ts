import { useMemo, useReducer, useState } from 'react';
import {
  generatorReducer,
  initialState,
  toBuildInput,
  type FieldErrors,
} from '~/utils/generatorState';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { buildPattern, type Pattern } from '~/utils/pattern';
import type { ShapeSlug } from '~/utils/shapes';
import { buildExample } from './buildExample';

/**
 * The generator's state: what was typed, the pattern it builds, and the last
 * pattern that built, which the stage keeps showing while a field is invalid.
 */
export const useGenerator = (slug: ShapeSlug) => {
  const [state, dispatch] = useReducer(generatorReducer, slug, initialState);
  const { input, errors: inputErrors } = useMemo(
    () => toBuildInput(state),
    [state],
  );
  const result = useMemo(
    () =>
      Object.keys(inputErrors).length > 0
        ? undefined
        : buildPattern(slug, input),
    [slug, input, inputErrors],
  );
  const fresh = result?.ok ? result.pattern : undefined;
  const [lastValid, setLastValid] = useState<Pattern>(
    () => fresh ?? buildExample(slug),
  );
  if (fresh && fresh !== lastValid) setLastValid(fresh);
  const pattern = fresh ?? lastValid;
  const paper = PAPERS[state.paper];
  const layout = useMemo(
    () => layoutPattern(pattern.pieces, paper),
    [pattern, paper],
  );
  const geometryError =
    result && !result.ok
      ? { field: result.field, message: result.message }
      : undefined;
  const errors: FieldErrors = {
    ...inputErrors,
    ...(geometryError?.field
      ? { [geometryError.field]: geometryError.message }
      : {}),
  };
  return {
    state,
    dispatch,
    input,
    errors,
    pattern,
    layout,
    paper,
    stale: fresh === undefined,
  };
};
