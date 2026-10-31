import { describe, expect, it } from 'vitest';
import { SHAPES } from '~/utils/shapes';
import { buildExample } from './buildExample';

describe('buildExample', () => {
  it.each(SHAPES.map(shape => shape.slug))(
    'builds the %s example with at least one piece',
    slug => {
      expect(buildExample(slug).pieces.length).toBeGreaterThan(0);
    },
  );
});
