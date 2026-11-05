'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Generator } from '~/templates/Generator';
import type { ShapeSlug } from '~/utils/shapes';

/**
 * The generator filled in from the address's query, read in the browser so
 * the page itself stays prerendered. The query is taken once, as opened: the
 * generator writes it back on every edit, and those writes needn't render the
 * generator again.
 */
export const GeneratorFromQuery = ({ slug }: { slug: ShapeSlug }) => {
  const params = useSearchParams();
  const [search] = useState(() => new URLSearchParams(params));
  return useMemo(
    () => <Generator slug={slug} search={search} />,
    [slug, search],
  );
};
