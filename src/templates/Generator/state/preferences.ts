import { atomWithStorage } from 'jotai/utils';
import { DEFAULT_PREFERENCES, type Preferences } from '~/utils/generatorState';

/**
 * Unit, material and paper, remembered in this browser so they carry from
 * shape to shape and across visits. Read after hydration: the page renders
 * the defaults first, like the server did.
 */
export const preferencesAtom = atomWithStorage<Preferences>(
  'cosplayshapes:preferences',
  DEFAULT_PREFERENCES,
);
