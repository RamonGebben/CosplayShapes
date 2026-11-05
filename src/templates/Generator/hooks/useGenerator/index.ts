import { useAtom } from 'jotai';
import { useMemo, useReducer, useState } from 'react';
import {
  generatorReducer,
  initialState,
  parsePreferences,
  toBuildInput,
  type FieldErrors,
  type GeneratorAction,
  type Preferences,
} from '~/utils/generatorState';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { buildPattern, type Pattern } from '~/utils/pattern';
import type { ShapeSlug } from '~/utils/shapes';
import { hasSettings, stateFromSearch, type Search } from '~/utils/shareUrl';
import { preferencesAtom } from '../../state/preferences';
import { buildExample } from './buildExample';

/** The preference an action changes, if it changes one. */
const preferenceOf = (
  action: GeneratorAction,
): Partial<Preferences> | undefined => {
  if (action.type === 'unit') return { unit: action.unit };
  if (action.type === 'material') return { material: action.material };
  if (action.type === 'paper') return { paper: action.paper };
  return undefined;
};

/**
 * The generator's state: what was typed, the pattern it builds, and the last
 * pattern that built, which the stage keeps showing while a field is invalid.
 * It starts from the settings in the page's query, if any, or else from the
 * example in the maker's remembered preferences.
 */
export const useGenerator = (slug: ShapeSlug, search: Search) => {
  const [preferences, setPreferences] = useAtom(preferencesAtom);
  // While hydrating, the preferences are still the defaults the server used.
  const [state, reduce] = useReducer(generatorReducer, search, query =>
    hasSettings(query)
      ? stateFromSearch(slug, query)
      : initialState(slug, parsePreferences(preferences)),
  );
  const [edited, setEdited] = useState(false);
  // Stored preferences arrive after hydration; until the maker changes
  // anything, a page opened without settings takes them up.
  const [applied, setApplied] = useState(preferences);
  if (preferences !== applied) {
    setApplied(preferences);
    if (!edited && !hasSettings(search))
      reduce({
        type: 'preferences',
        preferences: parsePreferences(preferences),
      });
  }

  /** A change the maker made, remembered when it's a preference. */
  const dispatch = (action: GeneratorAction) => {
    setEdited(true);
    reduce(action);
    const preference = preferenceOf(action);
    if (preference) setPreferences(current => ({ ...current, ...preference }));
  };
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
    edited,
    input,
    errors,
    pattern,
    layout,
    paper,
    stale: fresh === undefined,
  };
};
