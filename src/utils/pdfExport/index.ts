import fontkit from '@pdf-lib/fontkit';
import {
  LineJoinStyle,
  PDFDocument,
  StandardFonts,
  TextRenderingMode,
  clip,
  degrees,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
  setLineJoin,
  setLineWidth,
  setStrokingRgbColor,
  setTextRenderingMode,
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
import { bounds, type Piece } from '~/utils/pattern';
import { labelPlacement, type LabelPlacement } from '~/utils/patternText';
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

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  /** Big Shoulders when its bytes were passed in, else Helvetica Bold. */
  heading: PDFFont;
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
  /** Turned a quarter anticlockwise, reading bottom to top. */
  along = false,
) => {
  const width = font.widthOfTextAtSize(value, size);
  const offset = align === 'centre' ? width / 2 : align === 'right' ? width : 0;
  page.drawText(value, {
    ...(along
      ? { x: x * PT + size * 0.35, y: page.getHeight() - y * PT - offset }
      : { x: x * PT - offset, y: page.getHeight() - y * PT - size * 0.35 }),
    rotate: degrees(along ? 90 : 0),
    size,
    font,
    color: INK,
  });
};

/**
 * Text over a white outline of its own glyphs, so a label stays readable
 * where it crosses a cut or fold line: the PDF twin of the SVG's
 * paint-order halo.
 */
const haloText = (...args: Parameters<typeof text>) => {
  const [page, , , , , size = 9] = args;
  page.pushOperators(
    pushGraphicsState(),
    setTextRenderingMode(TextRenderingMode.Outline),
    setStrokingRgbColor(1, 1, 1),
    setLineWidth(size * 0.4),
    setLineJoin(LineJoinStyle.Round),
  );
  text(...args);
  page.pushOperators(popGraphicsState());
  text(...args);
};

/** Piece labels: bold title over a detail line, in points; the gap in mm. */
const LABEL = { title: 10, detail: 9, gap: 5 };

/**
 * Where a piece's label goes on one tile page, in page millimetres: across
 * the piece, turned along a tall narrow one, or beside one too small for
 * either (the same rule as the on-screen drawing). Every page a piece
 * crosses carries its label, so it is pulled inside the printable area.
 */
export const labelPosition = ({
  box,
  anchor,
  placement,
  width,
  area,
}: {
  /** The piece's outline bounds, already moved onto the page. */
  box: { minX: number; minY: number; width: number; height: number };
  /** Where the piece wants its title, already moved onto the page. */
  anchor: readonly [number, number];
  placement: LabelPlacement;
  /** The longer of the label's two lines, in mm. */
  width: number;
  /** The printable area of the page. */
  area: { x: number; y: number; width: number; height: number };
}) => {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  // Title centre to detail centre, plus half a line either side.
  const before = 2;
  const after = LABEL.gap + 2;
  const right = area.x + area.width;
  const bottom = area.y + area.height;
  const [ax, ay] = anchor;
  if (placement === 'along')
    return {
      x: clamp(ax, area.x + before, right - after),
      y: clamp(ay, area.y + width / 2 + 1, bottom - width / 2 - 1),
    };
  const y = clamp(ay, area.y + before, bottom - after);
  if (placement === 'beside')
    return {
      x: clamp(box.minX + box.width + 3, area.x + 1, right - width - 1),
      y,
    };
  return { x: clamp(ax, area.x + width / 2 + 1, right - width / 2 - 1), y };
};

const frame = (x: number, y: number, width: number, height: number) =>
  `M${x} ${y} L${x + width} ${y} L${x + width} ${y + height} L${x} ${y + height} Z`;

const guidePage = (
  doc: PDFDocument,
  paper: Paper,
  layout: Layout,
  meta: PdfMeta,
  fonts: Fonts,
) => {
  const page = doc.addPage([paper.width * PT, paper.height * PT]);
  const left = PAGE_MARGIN_MM + 4;
  text(page, fonts.heading, meta.title.toUpperCase(), left, 26, 30);
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
  text(page, fonts.heading, 'PAGE MAP', left, mapTop - 8, 16);
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
  text(page, fonts.heading, 'PIECES', left, listTop, 16);
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

const pieceLabelText = (
  page: PDFPage,
  fonts: Fonts,
  piece: Piece,
  materialLabel: string,
  {
    dx,
    dy,
    area,
  }: {
    dx: number;
    dy: number;
    area: { x: number; y: number; width: number; height: number };
  },
) => {
  const label = pieceLabel(piece, materialLabel);
  const outline = bounds(piece.outline);
  const box = { ...outline, minX: outline.minX + dx, minY: outline.minY + dy };
  const placement = labelPlacement(
    outline,
    Math.max(label.title.length, label.detail.length),
    LABEL.title / PT,
  );
  const width =
    Math.max(
      fonts.bold.widthOfTextAtSize(label.title, LABEL.title),
      fonts.regular.widthOfTextAtSize(label.detail, LABEL.detail),
    ) / PT;
  const { x, y } = labelPosition({
    box,
    anchor: [piece.label[0] + dx, piece.label[1] + dy],
    placement,
    width,
    area,
  });
  const along = placement === 'along';
  const align = placement === 'beside' ? 'left' : 'centre';
  haloText(page, fonts.bold, label.title, x, y, LABEL.title, align, along);
  haloText(
    page,
    fonts.regular,
    label.detail,
    along ? x + LABEL.gap : x,
    along ? y : y + LABEL.gap,
    LABEL.detail,
    align,
    along,
  );
};

const tilePage = (
  doc: PDFDocument,
  paper: Paper,
  layout: Layout,
  tile: Tile,
  meta: PdfMeta,
  fonts: Fonts,
) => {
  const font = fonts.regular;
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
  });
  // Labels go on after every line, so no other piece's line crosses a halo.
  layout.placed.forEach(({ piece, x, y }) =>
    pieceLabelText(page, fonts, piece, meta.materialLabel, {
      dx: x + dx,
      dy: y + dy,
      area: { x: m, y: m, width: w, height: h },
    }),
  );
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
  text(page, fonts.heading, `PAGE ${tile.name}`, m, m / 2, 14);
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

/**
 * A true-scale PDF: a guide page with the calibration square, then the
 * tiles. Headings are set in Big Shoulders when its TTF bytes are passed.
 */
export const patternPdf = async (
  layout: Layout,
  paper: Paper,
  meta: PdfMeta,
  headingFont?: ArrayBuffer | Uint8Array,
) => {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(meta.title);
  doc.setCreator('CosplayShapes');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const heading = headingFont
    ? await doc.embedFont(headingFont, { subset: true })
    : bold;
  const fonts = { regular, bold, heading };
  guidePage(doc, paper, layout, meta, fonts);
  layout.tiles.forEach(tile => tilePage(doc, paper, layout, tile, meta, fonts));
  return doc.save();
};
