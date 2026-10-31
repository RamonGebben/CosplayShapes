import { bounds, pieceSize, type Piece, type Polyline } from '~/utils/pattern';

export type PaperId =
  'a4' | 'a3' | 'a2' | 'a1' | 'a0' | 'letter' | 'legal' | 'tabloid' | 'arch-d';

export type PaperFamily = 'ISO' | 'US';

export interface Paper {
  id: PaperId;
  name: string;
  family: PaperFamily;
  width: number;
  height: number;
}

const INCH_MM = 25.4;

const iso = (
  id: PaperId,
  name: string,
  width: number,
  height: number,
): Paper => ({
  id,
  name,
  family: 'ISO',
  width,
  height,
});

const us = (
  id: PaperId,
  name: string,
  width: number,
  height: number,
): Paper => ({
  id,
  name,
  family: 'US',
  width: width * INCH_MM,
  height: height * INCH_MM,
});

/** Home printer sizes first, then the large sheets a print shop or plotter takes. */
export const PAPERS: Record<PaperId, Paper> = {
  a4: iso('a4', 'A4', 210, 297),
  a3: iso('a3', 'A3', 297, 420),
  a2: iso('a2', 'A2', 420, 594),
  a1: iso('a1', 'A1', 594, 841),
  a0: iso('a0', 'A0', 841, 1189),
  letter: us('letter', 'Letter', 8.5, 11),
  legal: us('legal', 'Legal', 8.5, 14),
  tabloid: us('tabloid', 'Tabloid', 11, 17),
  'arch-d': us('arch-d', 'Arch D', 24, 36),
};

export const PAPER_FAMILIES: Array<PaperFamily> = ['ISO', 'US'];

/** Margin on every side, wide enough for any home printer's unprintable edge. */
export const PAGE_MARGIN_MM = 12;

const GAP_MM = 10;

export interface Placed {
  piece: Piece;
  x: number;
  y: number;
}

export interface Tile {
  column: number;
  row: number;
  name: string;
}

export interface Layout {
  placed: Array<Placed>;
  width: number;
  height: number;
  columns: number;
  rows: number;
  /** Pages that carry part of a piece; empty grid cells are not printed. */
  tiles: Array<Tile>;
  tileWidth: number;
  tileHeight: number;
}

export const printableArea = (paper: Paper) => ({
  width: paper.width - PAGE_MARGIN_MM * 2,
  height: paper.height - PAGE_MARGIN_MM * 2,
});

const quarterTurn = (points: Polyline): Polyline =>
  points.map(([x, y]) => [-y, x] as const);

/** Turns a piece 90° and moves it back so its cut line starts at (0, 0). */
export const turnPiece = (piece: Piece): Piece => {
  const turned = quarterTurn(piece.cutLine);
  const { minX, minY } = bounds(turned);
  const move = (points: Polyline) =>
    quarterTurn(points).map(([x, y]) => [x - minX, y - minY] as const);
  const [label] = move([piece.label]);
  return {
    ...piece,
    outline: move(piece.outline),
    cutLine: move(piece.cutLine),
    edges: piece.edges.map(edge => ({ ...edge, points: move(edge.points) })),
    folds: piece.folds.map(move),
    notches: piece.notches.map(move),
    label,
  };
};

/** Shelf packing: tallest pieces first, filling rows across the sheet. */
const shelfPack = (pieces: Array<Piece>, sheetWidth: number) => {
  const sorted = [...pieces].sort(
    (a, b) => pieceSize(b).height - pieceSize(a).height,
  );
  const result = sorted.reduce(
    (state, piece) => {
      const { width, height } = pieceSize(piece);
      const fits = state.x === 0 || state.x + width <= sheetWidth;
      const x = fits ? state.x : 0;
      const y = fits ? state.y : state.y + state.shelf + GAP_MM;
      const shelf = fits ? Math.max(state.shelf, height) : height;
      return {
        x: x + width + GAP_MM,
        y,
        shelf,
        width: Math.max(state.width, x + width),
        placed: [...state.placed, { piece, x, y }],
      };
    },
    { x: 0, y: 0, shelf: 0, width: 0, placed: [] as Array<Placed> },
  );
  return {
    placed: result.placed,
    width: result.width,
    height: result.y + result.shelf,
  };
};

const COLUMN_NAMES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const tileName = (column: number, row: number) =>
  `${COLUMN_NAMES[column] ?? column + 1}${row + 1}`;

const overlaps = (
  placed: Placed,
  tile: { x: number; y: number; width: number; height: number },
) => {
  const { width, height } = pieceSize(placed.piece);
  return (
    placed.x < tile.x + tile.width &&
    placed.x + width > tile.x &&
    placed.y < tile.y + tile.height &&
    placed.y + height > tile.y
  );
};

const tilesFor = (
  placed: Array<Placed>,
  columns: number,
  rows: number,
  tileWidth: number,
  tileHeight: number,
) =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (__, column) => ({ column, row })),
  )
    .flat()
    .filter(({ column, row }) =>
      placed.some(item =>
        overlaps(item, {
          x: column * tileWidth,
          y: row * tileHeight,
          width: tileWidth,
          height: tileHeight,
        }),
      ),
    )
    .map(({ column, row }) => ({ column, row, name: tileName(column, row) }));

const orient = (piece: Piece, portrait: boolean) => {
  const { width, height } = pieceSize(piece);
  return portrait === height >= width ? piece : turnPiece(piece);
};

/**
 * Lays the pieces out on as few pages as it can, trying each sheet width
 * from one to six pages across and each piece orientation.
 */
export const layoutPattern = (pieces: Array<Piece>, paper: Paper): Layout => {
  const { width: tileWidth, height: tileHeight } = printableArea(paper);
  const candidates = [true, false].flatMap(portrait =>
    [1, 2, 3, 4, 5, 6].map(columnsWide => {
      const oriented = pieces.map(piece => orient(piece, portrait));
      const packed = shelfPack(oriented, columnsWide * tileWidth);
      const columns = Math.max(1, Math.ceil(packed.width / tileWidth - 1e-6));
      const rows = Math.max(1, Math.ceil(packed.height / tileHeight - 1e-6));
      const tiles = tilesFor(
        packed.placed,
        columns,
        rows,
        tileWidth,
        tileHeight,
      );
      return { ...packed, columns, rows, tiles, tileWidth, tileHeight };
    }),
  );
  return candidates.reduce((best, candidate) =>
    candidate.tiles.length < best.tiles.length ? candidate : best,
  );
};
