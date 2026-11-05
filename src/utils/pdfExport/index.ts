import fontkit from '@pdf-lib/fontkit';
import {
  LineJoinStyle,
  PDFDocument,
  PDFString,
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
import { encode } from 'uqr';
import {
  clipToRect,
  spotFinder,
  polygonArea,
  type Rect,
} from '~/utils/labelSpot';
import {
  PAGE_MARGIN_MM,
  tileName,
  type Layout,
  type Paper,
  type Placed,
  type Tile,
} from '~/utils/layout';
import { bounds, pieceSize, type Piece, type Polyline } from '~/utils/pattern';
import type { LabelPlacement } from '~/utils/patternText';
import { pieceLabel, toPath } from '~/utils/svgExport';

/** PDF points per millimetre: the whole reason the print comes out true. */
const PT = 72 / 25.4;

type Color = ReturnType<typeof rgb>;

const INK = rgb(0.07, 0.07, 0.07);
const GUIDE = rgb(0.11, 0.17, 0.84);
const FAINT = rgb(0.55, 0.55, 0.58);
/** The brand's yellow, deepened so it holds up on white paper. */
const BRAND = rgb(0.79, 0.6, 0.05);

export interface PdfMeta {
  title: string;
  materialLabel: string;
  /** The calibration square's side and its printed caption, per unit. */
  unit: 'cm' | 'in';
  /** The shape's page, printed short on every page. */
  link: string;
  /** This exact pattern, settings and all: what the QR code and links open. */
  share: string;
  /** Shape-specific assembly advice for the guide page. */
  notes?: Array<string>;
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
  options: { color?: Color; width?: number; dash?: Array<number> } = {},
) =>
  page.drawSvgPath(d, {
    x: 0,
    y: page.getHeight(),
    scale: PT,
    borderColor: options.color ?? INK,
    borderWidth: (options.width ?? 0.3) / PT,
    borderDashArray: options.dash?.map(value => value / PT),
  });

/** Fills an SVG path given in page millimetres, y down from the top edge. */
const fillPath = (page: PDFPage, d: string) =>
  page.drawSvgPath(d, { x: 0, y: page.getHeight(), scale: PT, color: INK });

interface TextOptions {
  size?: number;
  align?: 'left' | 'centre' | 'right';
  /** Turned a quarter anticlockwise, reading bottom to top. */
  along?: boolean;
  color?: Color;
}

/** Text centred on y, in page millimetres; returns its width in mm. */
const text = (
  page: PDFPage,
  font: PDFFont,
  value: string,
  x: number,
  y: number,
  { size = 9, align = 'left', along = false, color = INK }: TextOptions = {},
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
    color,
  });
  return width / PT;
};

/**
 * Text over a white outline of its own glyphs, so a label stays readable
 * where it crosses a cut or fold line: the PDF twin of the SVG's
 * paint-order halo.
 */
const haloText = (...args: Parameters<typeof text>) => {
  const [page, , , , , { size = 9 } = {}] = args;
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

/** Words split onto lines no wider than the measure, in mm. */
const wrap = (font: PDFFont, value: string, size: number, measure: number) =>
  value.split(' ').reduce<Array<string>>((lines, word) => {
    const last = lines.at(-1);
    const joined = last === undefined ? word : `${last} ${word}`;
    return last !== undefined &&
      font.widthOfTextAtSize(joined, size) / PT > measure
      ? [...lines, word]
      : [...lines.slice(0, -1), joined];
  }, []);

/** A clickable area over a printed link, in page millimetres. */
const linkArea = (page: PDFPage, url: string, area: Rect) => {
  const height = page.getHeight();
  const annotation = page.doc.context.register(
    page.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [
        area.x * PT,
        height - (area.y + area.height) * PT,
        (area.x + area.width) * PT,
        height - area.y * PT,
      ],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) },
    }),
  );
  page.node.addAnnot(annotation);
};

/** The link as printed: no scheme, it reads cleaner and types the same. */
const shortLink = (url: string) => url.replace(/^https?:\/\//, '');

/**
 * A printed link that also opens when the PDF is read on screen, to `href`:
 * the full address, too long to print.
 */
const linkText = (
  page: PDFPage,
  font: PDFFont,
  url: string,
  href: string,
  x: number,
  y: number,
  options: TextOptions = {},
) => {
  const size = options.size ?? 9;
  const width = text(page, font, shortLink(url), x, y, options);
  const start =
    options.align === 'right'
      ? x - width
      : options.align === 'centre'
        ? x - width / 2
        : x;
  linkArea(page, href, {
    x: start,
    y: y - size / PT / 2 - 0.5,
    width,
    height: size / PT + 1,
  });
};

/** Wide enough for a phone to read a long link from arm's length. */
const QR_SIDE = 30;

/**
 * A QR code with its top-left corner at x, y in page millimetres, its dark
 * cells filled as one path so neighbours meet without seams. Each row's run
 * of dark cells is one rectangle, which keeps the path short. Leaves the
 * quiet zone to the caller.
 */
const qrCode = (page: PDFPage, value: string, x: number, y: number) => {
  const { data, size } = encode(value, { ecc: 'M', border: 0 });
  const cell = QR_SIDE / size;
  const d = data
    .flatMap((row, rowIndex) =>
      row.flatMap((dark, column) => {
        if (!dark || row[column - 1]) return [];
        const run = row.slice(column).findIndex(next => !next);
        const length = run === -1 ? size - column : run;
        return [
          frame(x + column * cell, y + rowIndex * cell, length * cell, cell),
        ];
      }),
    )
    .join(' ');
  fillPath(page, d);
};

/** "COSPLAYSHAPES", the second word in the brand's yellow, as on the site. */
const wordmark = (
  page: PDFPage,
  font: PDFFont,
  x: number,
  y: number,
  size: number,
) => {
  const first = 'COSPLAY';
  const second = 'SHAPES';
  const width =
    font.widthOfTextAtSize(first, size) / PT +
    font.widthOfTextAtSize(second, size) / PT;
  const start = x - width;
  const firstWidth = text(page, font, first, start, y, { size });
  text(page, font, second, start + firstWidth, y, { size, color: BRAND });
};

/** Piece labels: bold title over a detail line, in points; the gap in mm. */
const LABEL = { title: 10, detail: 9, gap: 5 };

/** How far a label reaches above and below its title's centre, in mm. */
const REACH = { before: 2, after: LABEL.gap + 2 };

/** Clear space kept between a label and the lines around it, in mm. */
const LABEL_PAD = 1.5;

/** Less of a piece than this on a page (mm²) is a sliver, not a part. */
const MIN_PART_MM2 = 4;

/**
 * Where a piece's label goes on one tile page, in page millimetres, when it
 * fits inside the piece nowhere: across the piece, turned along a tall
 * narrow one, or beside one too small for either (the same rule as the
 * on-screen drawing), pulled inside the printable area.
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
  area: Rect;
}) => {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const { before, after } = REACH;
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

/**
 * Where a label sits wholly inside the visible part of a piece: across it
 * when there is room, else turned along it. The point is the title's
 * centre, as `labelPosition` gives it.
 */
export const fitLabel = (
  find: ReturnType<typeof spotFinder>,
  width: number,
  pad = LABEL_PAD,
): { x: number; y: number; placement: LabelPlacement } | undefined => {
  const depth = REACH.before + REACH.after + pad * 2;
  const length = width + pad * 2;
  // The box's centre sits this far past the title's, toward the detail line.
  const lean = (REACH.after - REACH.before) / 2;
  const across = find({ width: length, height: depth });
  if (across) return { x: across[0], y: across[1] - lean, placement: 'across' };
  const along = find({ width: depth, height: length });
  if (along) return { x: along[0] - lean, y: along[1], placement: 'along' };
  return undefined;
};

const moved = (points: Polyline, dx: number, dy: number): Polyline =>
  points.map(([x, y]) => [x + dx, y + dy] as const);

const shrink = (area: Rect, by: number): Rect => ({
  x: area.x + by,
  y: area.y + by,
  width: area.width - by * 2,
  height: area.height - by * 2,
});

interface PlacedLabel {
  x: number;
  y: number;
  placement: LabelPlacement;
}

interface PiecePlan {
  placed: Placed;
  /** The tiles a real part of the piece lands on, with its label there. */
  parts: Array<{ tile: Tile; label?: PlacedLabel }>;
}

/** Whether a piece's bounds reach onto a page: only those can show on it. */
const reaches = (layout: Layout, { piece, x, y }: Placed, tile: Tile) => {
  const { width, height } = pieceSize(piece);
  return (
    x < (tile.column + 1) * layout.tileWidth &&
    x + width > tile.column * layout.tileWidth &&
    y < (tile.row + 1) * layout.tileHeight &&
    y + height > tile.row * layout.tileHeight
  );
};

const tileOffset = (layout: Layout, tile: Tile) => ({
  dx: PAGE_MARGIN_MM - tile.column * layout.tileWidth,
  dy: PAGE_MARGIN_MM - tile.row * layout.tileHeight,
});

const printable = (layout: Layout): Rect => ({
  x: PAGE_MARGIN_MM,
  y: PAGE_MARGIN_MM,
  width: layout.tileWidth,
  height: layout.tileHeight,
});

const labelWidth = (fonts: Fonts, piece: Piece, materialLabel: string) => {
  const label = pieceLabel(piece, materialLabel);
  return (
    Math.max(
      fonts.bold.widthOfTextAtSize(label.title, LABEL.title),
      fonts.regular.widthOfTextAtSize(label.detail, LABEL.detail),
    ) / PT
  );
};

/**
 * The fallback for a piece its label fits inside on no page: set once,
 * beside the piece, on the page holding the piece's label point.
 */
const besideLabel = (
  layout: Layout,
  { piece, x, y }: Placed,
  width: number,
  tile: Tile,
): PlacedLabel => {
  const { dx, dy } = tileOffset(layout, tile);
  const outline = bounds(piece.outline);
  return {
    ...labelPosition({
      box: {
        ...outline,
        minX: outline.minX + x + dx,
        minY: outline.minY + y + dy,
      },
      anchor: [piece.label[0] + x + dx, piece.label[1] + y + dy],
      placement: 'beside',
      width,
      area: printable(layout),
    }),
    placement: 'beside',
  };
};

/**
 * Which pages each piece lands on and where its label goes on each: inside
 * whatever part of the piece that page shows, so a label never lands on a
 * page the piece misses or on top of another piece's.
 */
export const labelPlan = (
  layout: Layout,
  fonts: Fonts,
  materialLabel: string,
): Array<PiecePlan> => {
  const area = printable(layout);
  return layout.placed.map(placed => {
    const width = labelWidth(fonts, placed.piece, materialLabel);
    const parts = layout.tiles
      .filter(tile => reaches(layout, placed, tile))
      .map(tile => {
        const { dx, dy } = tileOffset(layout, tile);
        const outline = moved(
          placed.piece.cutLine,
          placed.x + dx,
          placed.y + dy,
        );
        return { tile, outline };
      })
      .filter(
        ({ outline }) => polygonArea(clipToRect(outline, area)) >= MIN_PART_MM2,
      )
      .map(({ tile, outline }) => ({
        tile,
        find: spotFinder(clipToRect(outline, shrink(area, 1))),
      }));
    const tiles = parts.map(({ tile }) => tile);
    const fitted = (pad: number) =>
      parts.map(({ tile, find }) => ({
        tile,
        label: fitLabel(find, width, pad),
      }));
    const roomy = fitted(LABEL_PAD);
    if (roomy.some(part => part.label)) return { placed, parts: roomy };
    // Tight on a slim piece: try once more without the clear space.
    const snug = fitted(0);
    if (snug.some(part => part.label)) return { placed, parts: snug };
    const [lx, ly] = placed.piece.label;
    const column = Math.floor((placed.x + lx) / layout.tileWidth);
    const row = Math.floor((placed.y + ly) / layout.tileHeight);
    const home =
      tiles.find(tile => tile.column === column && tile.row === row) ??
      tiles[0];
    return {
      placed,
      parts: tiles.map(tile => ({
        tile,
        label:
          tile === home ? besideLabel(layout, placed, width, tile) : undefined,
      })),
    };
  });
};

const frame = (x: number, y: number, width: number, height: number) =>
  `M${x} ${y} L${x + width} ${y} L${x + width} ${y + height} L${x} ${y + height} Z`;

/** Registration crosshair: a ring with arms past it, in mm. */
const CROSSHAIR = { arm: 5, ring: 2.5 };

const crosshair = (page: PDFPage, x: number, y: number) => {
  const { arm, ring } = CROSSHAIR;
  strokePath(
    page,
    `M${x - arm} ${y} L${x + arm} ${y} M${x} ${y - arm} L${x} ${y + arm}`,
    { width: 0.25 },
  );
  strokePath(
    page,
    `M${x - ring} ${y} A${ring} ${ring} 0 1 0 ${x + ring} ${y} A${ring} ${ring} 0 1 0 ${x - ring} ${y} Z`,
    { width: 0.25 },
  );
};

const STEPS = [
  'Measure the square above before you cut anything.',
  'Snip each page corner off through its crosshair.',
  'Lay the pages out as in the page map, overlap them so the crosshairs line up, then tape.',
  'Cut on the solid black lines. Blue dashed lines are folds and stitch lines.',
];

/** Section heading on the guide page. */
const sectionHeading = (
  page: PDFPage,
  fonts: Fonts,
  value: string,
  x: number,
  y: number,
) => text(page, fonts.heading, value, x, y, { size: 16 });

/**
 * The page map: one cell per printed page, in their places in the grid.
 * Returns the map's size in mm.
 */
const pageMap = (
  page: PDFPage,
  fonts: Fonts,
  layout: Layout,
  { x, y, width, height }: Rect,
) => {
  const aspect = layout.tileHeight / layout.tileWidth;
  const cell = Math.min(
    width / layout.columns,
    height / (layout.rows * aspect),
    30,
  );
  const size = Math.min(10, cell * PT * 0.3);
  layout.tiles.forEach(tile => {
    const left = x + tile.column * cell;
    const top = y + tile.row * cell * aspect;
    strokePath(page, frame(left, top, cell, cell * aspect));
    text(
      page,
      fonts.bold,
      tile.name,
      left + cell / 2,
      top + (cell * aspect) / 2,
      {
        size,
        align: 'centre',
      },
    );
  });
  return { width: cell * layout.columns, height: cell * aspect * layout.rows };
};

/**
 * Page names, with three or more in a row down one column of the grid
 * shortened to a run: "A1–A3, B1, B2".
 */
export const pageRanges = (tiles: Array<Tile>) =>
  [...tiles]
    .sort((a, b) => a.column - b.column || a.row - b.row)
    .reduce<Array<Array<Tile>>>((runs, tile) => {
      const run = runs.at(-1);
      const last = run?.at(-1);
      return run && last?.column === tile.column && last.row === tile.row - 1
        ? [...runs.slice(0, -1), [...run, tile]]
        : [...runs, [tile]];
    }, [])
    .flatMap(run =>
      run.length > 2
        ? [`${run[0].name}\u2013${run[run.length - 1].name}`]
        : run.map(tile => tile.name),
    )
    .join(', ');

/** Narrowest a piece list column gets, in mm. */
const LIST_COLUMN_MM = 58;

/** Title line to detail line, and between wrapped detail lines, in mm. */
const LIST_LINE = { title: 4.5, detail: 4 };

/** How tall a piece list entry with this many detail lines stands, in mm. */
export const entryHeight = (detailLines: number) =>
  LIST_LINE.title + LIST_LINE.detail * (detailLines - 1) + 7.5;

/**
 * Where each list entry goes: down a column, then across, spread about
 * evenly over the columns. Entries past the last column's foot are left
 * for a following page, never squeezed together.
 */
export const flowList = (
  heights: Array<number>,
  columns: number,
  height: number,
) => {
  const target = Math.ceil(heights.length / columns);
  return heights.reduce<{
    spots: Array<{ column: number; top: number }>;
    column: number;
    top: number;
    full: boolean;
  }>(
    (state, entry) => {
      if (state.full) return state;
      const count = state.spots.filter(
        spot => spot.column === state.column,
      ).length;
      const turn = count > 0 && (count >= target || state.top + entry > height);
      const column = turn ? state.column + 1 : state.column;
      const top = turn ? 0 : state.top;
      // The first entry of a column always goes in, however tall.
      if (column >= columns || (top > 0 && top + entry > height))
        return { ...state, full: true };
      return {
        spots: [...state.spots, { column, top }],
        column,
        top: top + entry,
        full: false,
      };
    },
    { spots: [], column: 0, top: 0, full: false },
  ).spots;
};

/**
 * The piece list, over as many columns as fit the area. Returns the
 * entries that did not fit, for a following page.
 */
const pieceList = (
  page: PDFPage,
  fonts: Fonts,
  plan: Array<PiecePlan>,
  materialLabel: string,
  { x, y, width, height }: Rect,
) => {
  const columns = Math.max(
    1,
    Math.min(plan.length, Math.floor(width / LIST_COLUMN_MM), 4),
  );
  const columnWidth = width / columns;
  const entries = plan.map(({ placed, parts }) => {
    const label = pieceLabel(placed.piece, materialLabel);
    const pages = `${parts.length === 1 ? 'Page' : 'Pages'} ${pageRanges(parts.map(({ tile }) => tile))}`;
    return {
      title: label.title,
      details: wrap(
        fonts.regular,
        `${label.detail}  ·  ${pages}`,
        8.5,
        columnWidth - 4,
      ),
    };
  });
  const spots = flowList(
    entries.map(({ details }) => entryHeight(details.length)),
    columns,
    height,
  );
  spots.forEach(({ column, top }, index) => {
    const { title, details } = entries[index];
    const left = x + column * columnWidth;
    text(page, fonts.bold, title, left, y + top, { size: 10 });
    details.forEach((line, row) =>
      text(
        page,
        fonts.regular,
        line,
        left,
        y + top + LIST_LINE.title + row * LIST_LINE.detail,
        { size: 8.5, color: FAINT },
      ),
    );
  });
  return plan.slice(spots.length);
};

/** The guide pages' foot: the maker's credit and the way back to the shape. */
const guideFooter = (
  page: PDFPage,
  fonts: Fonts,
  meta: PdfMeta,
  { left, right, foot }: { left: number; right: number; foot: number },
) => {
  strokePath(page, `M${left} ${foot - 5} L${right} ${foot - 5}`, {
    color: FAINT,
    width: 0.2,
  });
  const generated = text(page, fonts.regular, 'Generated with ', left, foot, {
    size: 9,
  });
  text(page, fonts.bold, 'CosplayShapes', left + generated, foot, {
    size: 9,
  });
  linkText(page, fonts.regular, meta.link, meta.share, right, foot, {
    size: 9,
    align: 'right',
  });
};

/** Further guide pages for a piece list too long for the first. */
const continuedPieces = (
  doc: PDFDocument,
  paper: Paper,
  rest: Array<PiecePlan>,
  meta: PdfMeta,
  fonts: Fonts,
): void => {
  if (rest.length === 0) return;
  const page = doc.addPage([paper.width * PT, paper.height * PT]);
  const left = PAGE_MARGIN_MM + 4;
  const right = paper.width - left;
  const foot = paper.height - PAGE_MARGIN_MM - 2;
  wordmark(page, fonts.heading, right, 14, 12);
  sectionHeading(page, fonts, 'PIECES, CONTINUED', left, 26);
  const leftOver = pieceList(page, fonts, rest, meta.materialLabel, {
    x: left,
    y: 35,
    width: right - left,
    height: foot - 10 - 35,
  });
  guideFooter(page, fonts, meta, { left, right, foot });
  continuedPieces(doc, paper, leftOver, meta, fonts);
};

const guidePage = (
  doc: PDFDocument,
  paper: Paper,
  layout: Layout,
  plan: Array<PiecePlan>,
  meta: PdfMeta,
  fonts: Fonts,
) => {
  const page = doc.addPage([paper.width * PT, paper.height * PT]);
  const left = PAGE_MARGIN_MM + 4;
  const right = paper.width - left;
  const width = right - left;
  const footer = paper.height - PAGE_MARGIN_MM - 2;
  wordmark(page, fonts.heading, right, 14, 12);
  text(page, fonts.heading, meta.title.toUpperCase(), left, 26, { size: 30 });
  text(
    page,
    fonts.regular,
    'Print at 100% / Actual size. Turn off "Fit to page" and any scaling.',
    left,
    38,
    { size: 11 },
  );
  const side = meta.unit === 'cm' ? 50 : 50.8;
  strokePath(page, frame(left, 50, side, side), { width: 0.4 });
  const captionX = left + side + 8;
  // The way back to this exact pattern, at the page's top right.
  const qrX = right - QR_SIDE;
  qrCode(page, meta.share, qrX, 50);
  linkArea(page, meta.share, {
    x: qrX,
    y: 50,
    width: QR_SIDE,
    height: QR_SIDE,
  });
  wrap(
    fonts.regular,
    'Scan to open this pattern and adjust it.',
    8,
    QR_SIDE,
  ).forEach((line, index) =>
    text(page, fonts.regular, line, qrX, 50 + QR_SIDE + 4 + index * 3.6, {
      size: 8,
    }),
  );
  text(
    page,
    fonts.bold,
    meta.unit === 'cm' ? 'This square is 5 cm' : 'This square is 2 in',
    captionX,
    62,
    { size: 12 },
  );
  wrap(
    fonts.regular,
    'Measure it before you cut. If it is off, the printer scaled the page.',
    10,
    qrX - 8 - captionX,
  ).forEach((line, index) =>
    text(page, fonts.regular, line, captionX, 70 + index * 5, { size: 10 }),
  );

  // How to put it together: the fixed steps, then the shape's own notes.
  const stepsTop = 50 + side + 16;
  sectionHeading(page, fonts, 'HOW TO ASSEMBLE', left, stepsTop);
  const stepLines = [...STEPS, ...(meta.notes ?? [])].map(step =>
    wrap(fonts.regular, step, 10, width - 7),
  );
  const stepsEnd = stepLines.reduce((top, lines, index) => {
    text(page, fonts.bold, `${index + 1}`, left, top, { size: 10 });
    lines.forEach((line, row) =>
      text(page, fonts.regular, line, left + 7, top + row * 4.8, { size: 10 }),
    );
    return top + lines.length * 4.8 + 2;
  }, stepsTop + 9);

  // The page map beside the piece list when it is narrow, above it when wide.
  const sectionTop = stepsEnd + 10;
  const bodyTop = sectionTop + 9;
  const bodyBottom = footer - 10;
  const beside = layout.columns <= 3;
  const mapArea = {
    x: left,
    y: bodyTop,
    width: beside ? width * 0.4 : width,
    height: beside ? bodyBottom - bodyTop : (bodyBottom - bodyTop) / 2,
  };
  const mapHeading = sectionHeading(page, fonts, 'PAGE MAP', left, sectionTop);
  const map = pageMap(page, fonts, layout, mapArea);
  const listLeft = beside ? left + Math.max(map.width, mapHeading) + 12 : left;
  const listTop = beside ? sectionTop : bodyTop + map.height + 12;
  sectionHeading(page, fonts, 'PIECES', listLeft, listTop);
  const rest = pieceList(page, fonts, plan, meta.materialLabel, {
    x: listLeft,
    y: listTop + 9,
    width: right - listLeft,
    height: bodyBottom - listTop - 9,
  });

  guideFooter(page, fonts, meta, { left, right, foot: footer });
  return rest;
};

const tilePage = (
  doc: PDFDocument,
  paper: Paper,
  layout: Layout,
  plan: Array<PiecePlan>,
  tile: Tile,
  meta: PdfMeta,
  fonts: Fonts,
) => {
  const font = fonts.regular;
  const page = doc.addPage([paper.width * PT, paper.height * PT]);
  const { tileWidth: w, tileHeight: h } = layout;
  const m = PAGE_MARGIN_MM;
  const { dx, dy } = tileOffset(layout, tile);
  page.pushOperators(
    pushGraphicsState(),
    rectangle(m * PT, m * PT, w * PT, h * PT),
    clip(),
    endPath(),
  );
  const here = layout.placed.filter(placed => reaches(layout, placed, tile));
  here.forEach(({ piece, x, y }) => {
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
  plan.forEach(({ placed, parts }) => {
    const label = parts.find(part => part.tile === tile)?.label;
    if (!label) return;
    const lines = pieceLabel(placed.piece, meta.materialLabel);
    const along = label.placement === 'along';
    const align = label.placement === 'beside' ? 'left' : 'centre';
    haloText(page, fonts.bold, lines.title, label.x, label.y, {
      size: LABEL.title,
      align,
      along,
    });
    haloText(
      page,
      fonts.regular,
      lines.detail,
      along ? label.x + LABEL.gap : label.x,
      along ? label.y : label.y + LABEL.gap,
      { size: LABEL.detail, align, along },
    );
  });
  page.pushOperators(popGraphicsState());
  strokePath(page, frame(m, m, w, h), {
    color: FAINT,
    width: 0.2,
  });
  const has = (column: number, row: number) =>
    layout.tiles.some(item => item.column === column && item.row === row);
  const neighbours = [
    [tile.column, tile.row - 1],
    [tile.column, tile.row + 1],
    [tile.column - 1, tile.row],
    [tile.column + 1, tile.row],
  ]
    .filter(([column, row]) => has(column, row))
    .map(([column, row]) => tileName(column, row));
  // A crosshair on every frame corner another tile shares: snip the corner
  // off one page through its mark and lay it on the next, no full trim.
  ([-1, 1] as const)
    .flatMap(across => ([-1, 1] as const).map(down => [across, down] as const))
    .filter(([across, down]) =>
      [
        [across, 0],
        [0, down],
        [across, down],
      ].some(([c, r]) => has(tile.column + c, tile.row + r)),
    )
    .forEach(([across, down]) =>
      crosshair(page, m + (across > 0 ? w : 0), m + (down > 0 ? h : 0)),
    );
  const inset = CROSSHAIR.arm + 2;
  const foot = m + h + m / 2;
  text(page, fonts.heading, `PAGE ${tile.name}`, m + inset, m / 2, {
    size: 14,
  });
  text(page, font, meta.title, m + w - inset, m / 2, {
    size: 9,
    align: 'right',
  });
  if (neighbours.length > 0)
    text(page, font, `Joins ${neighbours.join(', ')}`, m + inset, foot, {
      size: 9,
    });
  linkText(page, font, meta.link, meta.share, m + w / 2, foot, {
    size: 7.5,
    align: 'centre',
    color: FAINT,
  });
  const scaleEnd = m + w - inset;
  strokePath(page, `M${scaleEnd - 20} ${foot} L${scaleEnd} ${foot}`, {
    width: 0.4,
  });
  text(page, font, '2 cm', scaleEnd - 22, foot, { size: 8, align: 'right' });
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
  doc.setProducer(`CosplayShapes · ${meta.link}`);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const heading = headingFont
    ? await doc.embedFont(headingFont, { subset: true })
    : bold;
  const fonts = { regular, bold, heading };
  const plan = labelPlan(layout, fonts, meta.materialLabel);
  const rest = guidePage(doc, paper, layout, plan, meta, fonts);
  continuedPieces(doc, paper, rest, meta, fonts);
  layout.tiles.forEach(tile =>
    tilePage(doc, paper, layout, plan, tile, meta, fonts),
  );
  return doc.save();
};
