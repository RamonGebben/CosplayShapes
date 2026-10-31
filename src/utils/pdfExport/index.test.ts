import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { getMaterial } from '~/utils/materials';
import { buildPattern } from '~/utils/pattern';
import { patternPdf } from '.';

const layoutFor = (circumference: number) => {
  const result = buildPattern('cylinder', {
    dims: { circumference, height: 100 },
    options: {},
    material: getMaterial('eva'),
    thicknessMm: 0,
    seamMm: 0,
  });
  if (!result.ok) throw new Error(result.message);
  return layoutPattern(result.pattern.pieces, PAPERS.a4);
};

describe('patternPdf', () => {
  it('writes a guide page plus one page per tile, at the paper’s true size', async () => {
    const layout = layoutFor(900);
    const bytes = await patternPdf(layout, PAPERS.a4, {
      title: 'Cylinder',
      materialLabel: 'EVA 6 mm',
      unit: 'cm',
    });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(layout.tiles.length + 1);
    const { width, height } = doc.getPage(0).getSize();
    expect(width).toBeCloseTo((210 * 72) / 25.4, 2);
    expect(height).toBeCloseTo((297 * 72) / 25.4, 2);
  });
});
