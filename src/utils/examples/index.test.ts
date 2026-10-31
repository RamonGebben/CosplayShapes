import { describe, expect, it } from 'vitest';
import { SHAPES } from '~/utils/shapes';
import { buildExample } from '.';

describe('buildExample', () => {
  it.each(SHAPES.map(shape => shape.slug))('builds the %s example', slug => {
    expect(buildExample(slug).pieces.length).toBeGreaterThan(0);
  });
});
