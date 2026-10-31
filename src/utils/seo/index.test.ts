import { describe, expect, it } from 'vitest';
import { SHAPES } from '~/utils/shapes';
import { SITE, shapeSeo, sitemapPaths, webApplicationSchema } from '.';

describe('shapeSeo', () => {
  it('names the shape and what makers build with it', () => {
    expect(shapeSeo('truncated-cone').title).toBe(
      'Truncated cone pattern template for bracers, gauntlets and greaves',
    );
  });

  it('keeps every title short enough for search results', () => {
    // Titles get " · CosplayShapes" appended by the layout template.
    SHAPES.forEach(shape => {
      const title = `${shapeSeo(shape.slug).title} · ${SITE.name}`;
      expect(title.length).toBeLessThanOrEqual(85);
    });
  });

  it('keeps every description within the snippet length', () => {
    SHAPES.forEach(shape => {
      expect(shapeSeo(shape.slug).description.length).toBeLessThanOrEqual(260);
    });
  });

  it('has no duplicate keywords', () => {
    SHAPES.forEach(shape => {
      const { keywords } = shapeSeo(shape.slug);
      expect(new Set(keywords).size).toBe(keywords.length);
    });
  });
});

describe('webApplicationSchema', () => {
  it('describes the site as a free web app', () => {
    expect(webApplicationSchema()).toMatchObject({
      '@type': 'WebApplication',
      name: 'CosplayShapes',
      url: SITE.url,
      isAccessibleForFree: true,
      offers: { price: '0' },
    });
  });

  it('points a shape page at its own URL', () => {
    expect(webApplicationSchema('dome').url).toBe(`${SITE.url}/dome`);
  });
});

describe('sitemapPaths', () => {
  it('lists the home page and every shape', () => {
    expect(sitemapPaths()).toHaveLength(SHAPES.length + 1);
    expect(sitemapPaths()).toContain('/cone');
  });
});
