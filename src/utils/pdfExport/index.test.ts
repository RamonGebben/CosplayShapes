import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDict, PDFDocument, PDFName } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { getMaterial } from '~/utils/materials';
import { buildPattern } from '~/utils/pattern';
import { labelPosition, patternPdf } from '.';

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

  it('embeds Big Shoulders for the headings when its bytes are passed', async () => {
    const font = await readFile(
      path.join(process.cwd(), 'public/fonts/BigShoulders-Black.ttf'),
    );
    const bytes = await patternPdf(
      layoutFor(300),
      PAPERS.a4,
      { title: 'Cylinder', materialLabel: 'EVA 6 mm', unit: 'cm' },
      font,
    );
    const doc = await PDFDocument.load(bytes);
    const fontNames = doc.context
      .enumerateIndirectObjects()
      .map(([, object]) => object)
      .filter(object => object instanceof PDFDict)
      .map(dict => dict.get(PDFName.of('BaseFont'))?.toString() ?? '');
    expect(fontNames.some(name => name.includes('BigShoulders'))).toBe(true);
  });
});

describe('labelPosition', () => {
  const area = { x: 12, y: 12, width: 186, height: 273 };

  it('keeps the title on the piece’s label point when it fits', () => {
    expect(
      labelPosition({
        box: { minX: 40, minY: 40, width: 100, height: 60 },
        anchor: [90, 70],
        placement: 'across',
        width: 30,
        area,
      }),
    ).toEqual({ x: 90, y: 70 });
  });

  it('sets the label just right of a piece too narrow to hold it', () => {
    const position = labelPosition({
      box: { minX: 12, minY: 12, width: 9, height: 150 },
      anchor: [16.5, 87],
      placement: 'beside',
      width: 30,
      area,
    });
    expect(position).toEqual({ x: 24, y: 87 });
  });

  it('pulls a label inside the page by its real width, not a fixed margin', () => {
    const position = labelPosition({
      box: { minX: -400, minY: 40, width: 600, height: 60 },
      anchor: [-100, 70],
      placement: 'across',
      width: 20,
      area,
    });
    expect(position.x).toBe(12 + 10 + 1);
  });
});
