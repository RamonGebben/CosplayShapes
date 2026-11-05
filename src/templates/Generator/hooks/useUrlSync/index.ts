import { useEffect, useRef } from 'react';
import type { GeneratorState } from '~/utils/generatorState';
import { toSearch } from '~/utils/shareUrl';

/**
 * Keeps the address bar holding the full settings once the maker changes
 * anything, so the page can be bookmarked or shared as it stands. Until then
 * the address stays as it was opened. Replaces rather than pushes, so Back
 * still leaves the page.
 *
 * Written straight away, not debounced: Next treats a replace as navigation,
 * so a late one would cancel a click on a link made just before it.
 */
export const useUrlSync = (state: GeneratorState, edited: boolean) => {
  const written = useRef<string>(undefined);
  useEffect(() => {
    if (!edited) return;
    const search = toSearch(state);
    // An edit that leaves the query as it was needn't spend Safari's budget.
    if (search === written.current) return;
    try {
      window.history.replaceState(null, '', `?${search}`);
      written.current = search;
    } catch {
      // Safari throws past its replace rate limit; the next edit catches up.
    }
  }, [state, edited]);
};
