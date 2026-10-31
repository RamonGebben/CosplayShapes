import {
  PDFDocument,
  StandardFonts,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib';
import {
  PAGE_MARGIN_MM,
  tileName,
  type Layout,
  type Paper,
  type Tile,
} from '~/utils/layout';
import { pieceLabel, toPath } from '~/utils/svgExport';

/** PDF points per millimetre: the whole reason the print comes out true. */
const PT = 72 / 25.4;

const INK = rgb(0.07, 0.07, 0.07);
const GUIDE = rgb(0.11, 0.17, 0.84);
const FAINT = rgb(0.55, 0.55, 0.58);

export interface PdfMeta {
  title: string;
  materialLabel: string;
  /** The calibration square's side and its printed caption, per unit. */
  unit: 'cm' | 'in';
}

/** Draws an SVG path given in page millimetres, y down from the top edge. */
const strokePath = (
  page: PDFPage,
  d: string,
  options: { color?: typeof INK; width?: number; dash?: Array<number> } = {},
) =>
  page.drawSvgPath(d, {
    x: 0,
    y: page.getHeight(),
    scale: PT,
    borderColor: options.color ?? INK,
    borderWidth: (options.width ?? 0.3) / PT,
    borderDashArray: options.dash?.map(value => value / PT),
  });

const text = (
  page: PDFPage,
  font: PDFFont,
  value: string,
  x: number,
  y: number,
  size = 9,
  align: 'left' | 'centre' | 'right' = 'left',
) => {
  const width = font.widthOfTextAtSize(value, size);
  const offset = align === 'centre' ? width / 2 : align === 'right' ? width : 0;
  page.drawText(value, {
    x: x * PT - offset,
    y: page.getHeight() - y * PT - size * 0.35,
    size,
    font,
    color: INK,
  });
};

const frame = (x: number, y: number, width: number, height: number) =>
  `M${x} ${y} L${x + width} ${y} L${x + width} ${y + height} L${x} ${y + height} Z`;

const guidePage = (
  doc: PDFDocument,
  paper: Paper,
  layout: Layout,
  meta: PdfMeta,
  fonts: { regular: PDFFont; bold: PDFFont },
) => {
  const page = doc.addPage([paper.width * PT, paper.height * PT]);
  const left = PAGE_MARGIN_MM + 4;
  text(page, fonts.bold, meta.title, left, 26, 20);
  text(
    page,
    fonts.regular,
    'Print at 100% / Actual size. Turn off "Fit to page" and any scaling.',
    left,
    38,
    11,
  );
  const side = meta.unit === 'cm' ? 50 : 50.8;
  strokePath(page, frame(left, 50, side, side), { width: 0.4 });
  text(
    page,
    fonts.bold,
    meta.unit === 'cm' ? 'This square is 5 cm' : 'This square is 2 in',
    left + side + 8,
    62,
    12,
  );
  text(
    page,
    fonts.regular,
    'Measure it before you cut. If it is off, the printer scaled the page.',
    left + side + 8,
    70,
    10,
  );
  const mapTop = 120;
  text(page, fonts.bold, 'Page map', left, mapTop - 8, 12);
  const cell = Math.min(
    (paper.width - left * 2) / layout.columns,
    (paper.height - mapTop - 60) / layout.rows,
    30,
  );
  const aspect = layout.tileHeight / layout.tileWidth;
  layout.tiles.forEach(tile => {
    const x = left + tile.column * cell;
    const y = mapTop + tile.row * cell * aspect;
    strokePath(page, frame(x, y, cell, cell * aspect));
    text(
      page,
      fonts.bold,
      tile.name,
      x + cell / 2,
      y + (cell * aspect) / 2,
      10,
      'centre',
    );
  });
  const listTop = mapTop + layout.rows * cell * aspect + 16;
  text(page, fonts.bold, 'Pieces', left, listTop, 12);
  layout.placed.forEach(({ piece }, index) => {
    const label = pieceLabel(piece, meta.materialLabel);
    text(
      page,
      fonts.regular,
      `${label.title}  ·  ${label.detail}`,
      left,
      listTop + 8 + index * 6,
      10,
    );
  });
  text(
    page,
    fonts.regular,
    'Trim each page on its grey frame and tape pages edge to edge, matching the half-diamonds.',
    left,
    paper.height - PAGE_MARGIN_MM - 4,
    9,
  );
};

const tilePage = (
  doc: PDFDocument,
  paper: Paper,
  layout: Layout,
  tile: Tile,
  meta: PdfMeta,
  font: PDFFont,
) => {
  const page = doc.addPage([paper.width * PT, paper.height * PT]);
  const { tileWidth: w, tileHeight: h } = layout;
  const m = PAGE_MARGIN_MM;
  const dx = m - tile.column * w;
  const dy = m - tile.row * h;
  page.pushOperators(
    pushGraphicsState(),
    rectangle(m * PT, m * PT, w * PT, h * PT),
    clip(),
    endPath(),
  );
  layout.placed.forEach(({ piece, x, y }) => {
    const ox = x + dx;
    const oy = y + dy;
    strokePath(page, toPath(piece.cutLine, true, ox, oy), { width: 0.35 });
    piece.notches.forEach(mark =>
      strokePath(page, toPath(mark, false, ox, oy), { width: 0.35 }),
    );
    if (piece.stitch)
      strokePath(page, toPath(piece.outline, true, ox, oy), {
        color: GUIDE,
        dash: [2, 1.5],
      });
    piece.folds.forEach(fold =>
      strokePath(page, toPath(fold, false, ox, oy), {
        color: GUIDE,
        dash: [2, 1.5],
      }),
    );
    // Every page a piece crosses carries its label, pulled inside the page.
    const [lx, ly] = piece.label;
    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));
    const labelX = clamp(ox + lx, m + 30, m + w - 30);
    const labelY = clamp(oy + ly, m + 8, m + h - 12);
    const label = pieceLabel(piece, meta.materialLabel);
    text(page, font, label.title, labelX, labelY, 10, 'centre');
    text(page, font, label.detail, labelX, labelY + 5, 9, 'centre');
  });
  page.pushOperators(popGraphicsState());
  strokePath(page, frame(m, m, w, h), {
    color: FAINT,
    width: 0.2,
  });
  const has = (column: number, row: number) =>
    layout.tiles.some(item => item.column === column && item.row === row);
  const diamond = 4;
  const marks = [
    {
      on: has(tile.column, tile.row - 1),
      x: m + w / 2,
      y: m,
      name: tileName(tile.column, tile.row - 1),
    },
    {
      on: has(tile.column, tile.row + 1),
      x: m + w / 2,
      y: m + h,
      name: tileName(tile.column, tile.row + 1),
    },
    {
      on: has(tile.column - 1, tile.row),
      x: m,
      y: m + h / 2,
      name: tileName(tile.column - 1, tile.row),
    },
    {
      on: has(tile.column + 1, tile.row),
      x: m + w,
      y: m + h / 2,
      name: tileName(tile.column + 1, tile.row),
    },
  ];
  marks
    .filter(mark => mark.on)
    .forEach(mark => {
      strokePath(
        page,
        `M${mark.x - diamond} ${mark.y} L${mark.x} ${mark.y - diamond} L${mark.x + diamond} ${mark.y} L${mark.x} ${mark.y + diamond} Z`,
        { width: 0.3 },
      );
    });
  text(page, font, `Page ${tile.name}`, m, m / 2, 9);
  text(page, font, meta.title, m + w, m / 2, 9, 'right');
  const joins = marks.filter(mark => mark.on).map(mark => mark.name);
  if (joins.length > 0)
    text(page, font, `Joins ${joins.join(', ')}`, m, m + h + m / 2, 9);
  strokePath(
    page,
    `M${m + w - 20} ${m + h + m / 2} L${m + w} ${m + h + m / 2}`,
    {
      width: 0.4,
    },
  );
  text(page, font, '2 cm', m + w - 22, m + h + m / 2, 8, 'right');
};

/** A true-scale PDF: a guide page with the calibration square, then the tiles. */
export const patternPdf = async (
  layout: Layout,
  paper: Paper,
  meta: PdfMeta,
) => {
  const doc = await PDFDocument.create();
  doc.setTitle(meta.title);
  doc.setCreator('basic-shape-patterns');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  guidePage(doc, paper, layout, meta, { regular, bold });
  layout.tiles.forEach(tile =>
    tilePage(doc, paper, layout, tile, meta, regular),
  );
  return doc.save();
};
