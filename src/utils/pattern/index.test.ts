import { describe, expect, it } from 'vitest';
import { getMaterial } from '~/utils/materials';
import { bounds, buildPattern, type BuildInput, type Polyline } from '.';
import { notchAlong, offsetPolygon, rect } from './geometry';
import { hornPoint, hornSections } from './tube';

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

  it('rises an angled cylinder wrap from the short side to the tall side', () => {
    const pattern = build(
      'angled-cylinder',
      input({ circumference: 380, short: 120, tall: 180 }),
    );
    const { width, height } = bounds(pattern.pieces[0].outline);
    expect(width).toBeCloseTo(380, 6);
    expect(height).toBeCloseTo(180, 6);
    expect(edgeLength(pattern, 'short')).toBeCloseTo(120, 6);
    expect(edgeLength(pattern, 'tall')).toBeCloseTo(180, 6);
  });

  it('cuts an angled cylinder top cap to fit the slanted edge', () => {
    const pattern = build(
      'angled-cylinder',
      input(
        { circumference: 380, short: 120, tall: 180 },
        { options: { ends: true } },
      ),
    );
    const cap = pattern.pieces.find(piece => piece.name === 'Top cap');
    expect(cap).toBeDefined();
    const capEdge = cap?.edges[0].points ?? [];
    expect(pathLength(capEdge)).toBeCloseTo(edgeLength(pattern, 'top'), 1);
  });

  it('refuses an angled cylinder whose tall side is not taller', () => {
    const result = buildPattern(
      'angled-cylinder',
      input({ circumference: 380, short: 150, tall: 150 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'tall' });
  });

  it('cuts elbow sections whose joints match and whose sides follow the bend', () => {
    const [circumference, bendRadius] = [250, 120];
    const radius = circumference / (2 * Math.PI);
    const pattern = build(
      'elbow',
      input({ circumference, bend: 90, radius: bendRadius, sections: 4 }),
    );
    const [end, middle] = pattern.pieces;
    expect([end.cut, middle.cut]).toEqual([2, 2]);
    const slant = Math.tan((30 * Math.PI) / 360);
    const seam = end.edges.find(edge => edge.keys.includes('seam'));
    expect(pathLength(seam?.points ?? [])).toBeCloseTo(
      (bendRadius - radius) * slant,
      6,
    );
    expect(bounds(end.outline).height).toBeCloseTo(
      (bendRadius + radius) * slant,
      6,
    );
    const joint = (piece: typeof end, index: number) =>
      pathLength(
        piece.edges.filter(edge => edge.keys.includes('joint'))[index].points,
      );
    expect(joint(end, 0)).toBeCloseTo(joint(middle, 0), 6);
    expect(joint(middle, 0)).toBeCloseTo(joint(middle, 1), 6);
  });

  it('makes a two-section elbow from two end sections', () => {
    const pattern = build(
      'elbow',
      input({ circumference: 250, bend: 45, radius: 120, sections: 2 }),
    );
    expect(pattern.pieces.map(piece => piece.cut)).toEqual([2]);
  });

  it('refuses an elbow that bends tighter than the tube', () => {
    const result = buildPattern(
      'elbow',
      input({ circumference: 250, bend: 90, radius: 30, sections: 4 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'radius' });
  });

  it('asks for more elbow sections when a joint would turn past 90°', () => {
    const result = buildPattern(
      'elbow',
      input({ circumference: 250, bend: 180, radius: 120, sections: 2 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'sections' });
    if (!result.ok) expect(result.message).toContain('at least 3 sections');
  });

  it('gives neighbouring curved horn sections joint edges of one length', () => {
    const dims = { base: 200, tip: 20, length: 300, bend: 120, sections: 6 };
    [0, 6].forEach(thicknessMm => {
      const pattern = build('curved-horn', input(dims, { thicknessMm }));
      expect(pattern.pieces).toHaveLength(6);
      const curves = (key: string) =>
        pattern.pieces.map(piece =>
          piece.edges
            .filter(edge => edge.keys.includes(key))
            .map(edge => pathLength(edge.points)),
        );
      const joints = curves('joint');
      joints.slice(0, -1).forEach((joint, index) => {
        const narrowEnd = joint[joint.length - 1];
        const nextWideEnd = joints[index + 1][0];
        expect(narrowEnd).toBeCloseTo(nextWideEnd, 6);
      });
    });
  });

  it('opens a curved horn to the base and narrows it to the tip', () => {
    const pattern = build(
      'curved-horn',
      input({ base: 200, tip: 20, length: 300, bend: 90, sections: 6 }),
    );
    expect(edgeLength(pattern, 'base', 0)).toBeCloseTo(200, 2);
    expect(edgeLength(pattern, 'tip', 5)).toBeCloseTo(20, 2);
  });

  it('refuses a curved horn that curls tighter than it is wide', () => {
    const result = buildPattern(
      'curved-horn',
      input({ base: 400, tip: 20, length: 120, bend: 270, sections: 8 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'bend' });
  });

  it('refuses a curved horn whose tip is not narrower than its base', () => {
    const result = buildPattern(
      'curved-horn',
      input({ base: 100, tip: 100, length: 300, bend: 90, sections: 6 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'tip' });
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

  it('makes an oval dome of a hemisphere when the height is the radius', () => {
    const circumference = 600;
    const radius = circumference / (2 * Math.PI);
    const oval = build(
      'oval-dome',
      input({ circumference, height: radius, gores: 6 }),
    );
    const round = build(
      'dome',
      input({ circumference, height: radius, gores: 6 }),
    );
    expect(bounds(oval.pieces[0].outline).height).toBeCloseTo(
      bounds(round.pieces[0].outline).height,
      6,
    );
    expect(bounds(oval.pieces[0].outline).width).toBeCloseTo(
      bounds(round.pieces[0].outline).width,
      6,
    );
  });

  it('runs an oval dome gore as long as the quarter ellipse', () => {
    const [across, up] = [100, 40];
    const pattern = build(
      'oval-dome',
      input({ circumference: 2 * Math.PI * across, height: up, gores: 8 }),
    );
    // Ramanujan's perimeter, a quarter of it, is good to well under 0.01 mm here.
    const h = ((across - up) / (across + up)) ** 2;
    const quarter =
      (Math.PI * (across + up) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))) /
      4;
    const { width, height } = bounds(pattern.pieces[0].outline);
    expect(height).toBeCloseTo(quarter, 2);
    expect(width * 8).toBeCloseTo(2 * Math.PI * across, 6);
  });

  it('closes a pointed dome gore in a point and opens it to the base', () => {
    const circumference = 600;
    const pattern = build(
      'pointed-dome',
      input({ circumference, height: 160, gores: 8 }),
    );
    const [tip] = pattern.pieces[0].edges[0].points;
    const top = bounds(pattern.pieces[0].outline);
    expect(tip[1]).toBeCloseTo(top.minY, 6);
    expect(top.width * 8).toBeCloseTo(circumference, 6);
  });

  it('carries a foam pointed dome tip on to the axis', () => {
    const pattern = build(
      'pointed-dome',
      input({ circumference: 600, height: 160, gores: 8 }, { thicknessMm: 6 }),
    );
    const outline = pattern.pieces[0].outline;
    const tips = outline.filter(([x]) => {
      const { minX, width } = bounds(outline);
      return Math.abs(x - (minX + width / 2)) < 1e-9;
    });
    expect(tips).toHaveLength(1);
  });

  it('refuses a pointed dome lower than half its width', () => {
    const result = buildPattern(
      'pointed-dome',
      input({ circumference: 600, height: 60, gores: 8 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'height' });
  });

  it('makes capsule gores as long as the straight middle and two half circles', () => {
    const circumference = 200;
    const radius = circumference / (2 * Math.PI);
    const pattern = build(
      'capsule',
      input({ circumference, length: 160, gores: 6 }),
    );
    expect(bounds(pattern.pieces[0].outline).height).toBeCloseTo(
      160 - 2 * radius + Math.PI * radius,
      6,
    );
    const rings = pattern.pieces[0].edges.filter(edge =>
      edge.keys.includes('circumference'),
    );
    expect(rings.map(edge => pathLength(edge.points) * 6)).toEqual([
      expect.closeTo(circumference, 6),
      expect.closeTo(circumference, 6),
    ]);
  });

  it('refuses a capsule no longer than it is wide', () => {
    const result = buildPattern(
      'capsule',
      input({ circumference: 200, length: 60, gores: 6 }),
    );
    expect(result).toMatchObject({ ok: false, field: 'length' });
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

describe('hornSections', () => {
  // A cone's surface makes the same angle with its axis everywhere.
  const offCone = (
    point: readonly [number, number, number],
    section: ReturnType<typeof hornSections>[number],
    slope: number,
  ) => {
    const toApex = section.apex.map((value, axis) => value - point[axis]);
    const along = toApex.reduce(
      (sum, value, axis) => sum + value * section.axis[axis],
      0,
    );
    return along / Math.hypot(...toApex) - Math.cos(Math.atan(slope));
  };

  it('puts every joint on both neighbouring cones', () => {
    const slope = 0.1;
    const turn = (25 * Math.PI) / 180;
    const sections = hornSections(
      along => 40 - slope * along,
      slope,
      150,
      5,
      turn,
    );
    sections.slice(0, -1).forEach((section, index) => {
      const next = sections[index + 1];
      [0, 1, 2, 3, 4, 5].forEach(step => {
        const angle = (step * Math.PI) / 3;
        const point = hornPoint(section, slope, angle, section.end);
        expect(offCone(point, next, slope)).toBeCloseTo(0, 9);
      });
    });
  });
});

describe('solid models', () => {
  type Vertex = readonly [number, number, number];
  const mean = (points: Array<Vertex>) =>
    [0, 1, 2].map(
      axis =>
        points.reduce((sum, point) => sum + point[axis], 0) / points.length,
    );
  /** Newell's normal: right for any flat polygon, however many corners. */
  const normal = (points: Array<Vertex>) =>
    points.reduce(
      (sum, [x, y, z], index) => {
        const [nx, ny, nz] = points[(index + 1) % points.length];
        return [
          sum[0] + (y - ny) * (z + nz),
          sum[1] + (z - nz) * (x + nx),
          sum[2] + (x - nx) * (y + ny),
        ];
      },
      [0, 0, 0],
    );

  // Convex shapes only: the inside of an elbow's bend faces its middle.
  it.each([
    ['box', { width: 120, depth: 50, height: 90 }, { lid: true }],
    ['pyramid', { width: 80, depth: 60, height: 110 }, { base: true }],
    ['prism', { sides: 6, face: 40, length: 160 }, { ends: true }],
    [
      'tapered-prism',
      { sides: 8, top: 32, bottom: 40, height: 180 },
      { ends: true },
    ],
    ['angled-cylinder', { circumference: 380, short: 120, tall: 180 }, {}],
    [
      'angled-cylinder',
      { circumference: 380, short: 120, tall: 180 },
      { ends: true },
    ],
  ] as const)('winds every %s face outwards', (slug, dims, options) => {
    const { model } = build(
      slug,
      input({ ...dims }, { options: { ...options } }),
    );
    if (model.kind !== 'solid') throw new Error('Expected a solid model');
    const centre = mean(model.vertices);
    model.faces.forEach(face => {
      const points = face.map(index => model.vertices[index]);
      const [nx, ny, nz] = normal(points);
      const [cx, cy, cz] = mean(points);
      const outwards =
        nx * (cx - centre[0]) + ny * (cy - centre[1]) + nz * (cz - centre[2]);
      expect(outwards).toBeGreaterThan(0);
    });
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
