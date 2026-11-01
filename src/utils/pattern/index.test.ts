import { describe, expect, it } from 'vitest';
import { getMaterial } from '~/utils/materials';
import { bounds, buildPattern, type BuildInput, type Polyline } from '.';
import { notchAlong, offsetPolygon, rect } from './geometry';

const input = (
  dims: Record<string, number>,
  overrides: Partial<BuildInput> = {},
): BuildInput => ({
  dims,
  options: {},
  material: getMaterial('eva'),
  thicknessMm: 0,
  seamMm: 0,
  ...overrides,
});

const pathLength = (points: Polyline) =>
  points
    .slice(1)
    .reduce(
      (sum, [x, y], index) =>
        sum + Math.hypot(x - points[index][0], y - points[index][1]),
      0,
    );

const build = (...args: Parameters<typeof buildPattern>) => {
  const result = buildPattern(...args);
  if (!result.ok) throw new Error(result.message);
  return result.pattern;
};

const edgeLength = (
  pattern: ReturnType<typeof build>,
  key: string,
  piece = 0,
) => {
  const edge = pattern.pieces[piece].edges.find(item =>
    item.keys.includes(key),
  );
  return edge ? pathLength(edge.points) : NaN;
};

describe('buildPattern', () => {
  it('makes a cylinder wrap exactly as long as the circumference', () => {
    const pattern = build(
      'cylinder',
      input({ circumference: 280, height: 60 }),
    );
    const { width, height } = bounds(pattern.pieces[0].outline);
    expect(width).toBeCloseTo(280, 6);
    expect(height).toBeCloseTo(60, 6);
  });

  it('draws a foam wrap at mid-thickness, measured on the inside', () => {
    const pattern = build(
      'cylinder',
      input({ circumference: 280, height: 60 }, { thicknessMm: 6 }),
    );
    expect(bounds(pattern.pieces[0].outline).width).toBeCloseTo(
      280 + Math.PI * 6,
      6,
    );
  });

  it('gives a cone wall an arc as long as the base circumference', () => {
    const pattern = build('cone', input({ circumference: 220, height: 150 }));
    expect(edgeLength(pattern, 'circumference')).toBeCloseTo(220, 0);
  });

  it('gives a truncated cone arcs matching both circumferences', () => {
    const pattern = build(
      'truncated-cone',
      input({ top: 260, bottom: 320, height: 180 }),
    );
    expect(edgeLength(pattern, 'bottom')).toBeCloseTo(320, 0);
    expect(edgeLength(pattern, 'top')).toBeCloseTo(260, 0);
    expect(edgeLength(pattern, 'seam')).toBeCloseTo(
      Math.hypot((320 - 260) / (2 * Math.PI), 180),
      6,
    );
  });

  it('refuses a truncated cone with equal ends', () => {
    const result = buildPattern(
      'truncated-cone',
      input({ top: 300, bottom: 300, height: 100 }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.field).toBe('top');
  });

  it('makes sphere gores that add up to the circumference', () => {
    const pattern = build('sphere', input({ circumference: 400, gores: 8 }));
    const { width, height } = bounds(pattern.pieces[0].outline);
    expect(width * 8).toBeCloseTo(400, 6);
    expect(height).toBeCloseTo(200, 6);
    expect(pattern.pieces[0].cut).toBe(8);
  });

  it('makes a hemisphere dome from a height equal to the radius', () => {
    const circumference = 600;
    const radius = circumference / (2 * Math.PI);
    const pattern = build(
      'dome',
      input({ circumference, height: radius, gores: 6 }),
    );
    const { width, height } = bounds(pattern.pieces[0].outline);
    expect(height).toBeCloseTo((Math.PI * radius) / 2, 6);
    expect(width * 6).toBeCloseTo(circumference, 6);
  });

  it('cuts a foam box as separate faces and a card box as one tabbed net', () => {
    const dims = { width: 120, depth: 50, height: 90 };
    const foam = build('box', input(dims, { options: { lid: true } }));
    expect(foam.pieces.map(piece => piece.cut)).toEqual([2, 2, 2]);
    const card = build(
      'box',
      input(dims, { material: getMaterial('paper'), options: { lid: true } }),
    );
    expect(card.pieces).toHaveLength(1);
    // Only the tab folds are guides; the rest of the outline is cut.
    expect(card.pieces[0].stitch).toBe(false);
    expect(card.pieces[0].cutLine.length).toBeGreaterThan(
      card.pieces[0].outline.length,
    );
  });

  it('builds pyramid faces whose corner edges all match', () => {
    const pattern = build(
      'pyramid',
      input({ width: 80, depth: 60, height: 110 }),
    );
    const corner = Math.hypot(110, 40, 30);
    pattern.pieces.slice(0, 2).forEach(piece => {
      const [left, apex] = piece.outline;
      expect(Math.hypot(apex[0] - left[0], apex[1] - left[1])).toBeCloseTo(
        corner,
        6,
      );
    });
  });

  it('names the field when a count is out of range', () => {
    const result = buildPattern(
      'prism',
      input({ sides: 2, face: 40, length: 100 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'sides' });
  });

  it('cuts tapered prism faces to both face widths and the slanted height', () => {
    const dims = { sides: 6, top: 30, bottom: 40, height: 120 };
    const pattern = build('tapered-prism', input(dims));
    const across = (face: number) => face / Math.tan(Math.PI / 6);
    expect(pattern.pieces[0].cut).toBe(6);
    expect(edgeLength(pattern, 'top')).toBeCloseTo(30, 6);
    expect(edgeLength(pattern, 'bottom')).toBeCloseTo(40, 6);
    expect(bounds(pattern.pieces[0].outline).height).toBeCloseTo(
      Math.hypot(120, (across(40) - across(30)) / 2),
      6,
    );
  });

  it('fans a card tapered prism into one strip with matching seams', () => {
    const dims = { sides: 8, top: 32, bottom: 40, height: 180 };
    const card = build(
      'tapered-prism',
      input(dims, { material: getMaterial('paper') }),
    );
    const strip = card.pieces[0];
    const widths = (key: string) =>
      strip.edges
        .filter(edge => edge.keys.includes(key))
        .map(edge => pathLength(edge.points));
    expect(widths('bottom')).toHaveLength(8);
    widths('bottom').forEach(width => expect(width).toBeCloseTo(40, 6));
    widths('top').forEach(width => expect(width).toBeCloseTo(32, 6));
    const [first, last] = widths('seam');
    expect(first).toBeCloseTo(last, 6);
    // Seven folds between the eight faces, plus the glue tab's own fold.
    expect(strip.folds).toHaveLength(8);
  });

  it('refuses a tapered prism with equal ends', () => {
    const result = buildPattern(
      'tapered-prism',
      input({ sides: 6, top: 40, bottom: 40, height: 100 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'top' });
  });

  it('adds seam allowance outside the outline', () => {
    const pattern = build(
      'cylinder',
      input(
        { circumference: 200, height: 50 },
        { material: getMaterial('fabric'), seamMm: 10 },
      ),
    );
    const { width, height } = bounds(pattern.pieces[0].cutLine);
    expect(width).toBeCloseTo(220, 6);
    expect(height).toBeCloseTo(70, 6);
    expect(pattern.pieces[0].stitch).toBe(true);
  });
});

describe('offsetPolygon', () => {
  it('grows a square evenly on every side', () => {
    const grown = bounds(offsetPolygon(rect(10, 10), 2));
    expect(grown).toEqual({ minX: -2, minY: -2, width: 14, height: 14 });
  });
});

describe('notchAlong', () => {
  // A square's left and bottom edges: halfway lands on the corner sample.
  const square: Polyline = [
    [0, 0],
    [0, 10],
    [10, 10],
    [10, 0],
  ];
  const curve = square.slice(0, 3);

  it('angles a notch on a sample point the same, an ulp either side', () => {
    const under = notchAlong(curve, 0.5 - 1e-15, square);
    const over = notchAlong(curve, 0.5 + 1e-15, square);
    expect(under[1][0]).toBeCloseTo(over[1][0], 9);
    expect(under[1][1]).toBeCloseTo(over[1][1], 9);
  });
});
