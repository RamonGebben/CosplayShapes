import type { Material } from '~/utils/materials';

/** A point on the pattern in millimetres, y pointing down as on paper. */
export type Point = readonly [number, number];

export type Polyline = Array<Point>;

/** A stretch of a piece's outline that matches a measurement the maker typed. */
export interface PatternEdge {
  keys: Array<string>;
  points: Polyline;
}

export interface Piece {
  id: string;
  name: string;
  /** How many of this piece to cut. */
  cut: number;
  /** The finished edge: where foam butts, fabric is stitched, card is folded. */
  outline: Polyline;
  /** Where the knife goes: the outline plus tabs and seam allowance. */
  cutLine: Polyline;
  /** True when a seam allowance puts the stitch line inside the cut line. */
  stitch: boolean;
  edges: Array<PatternEdge>;
  folds: Array<Polyline>;
  notches: Array<Polyline>;
  label: Point;
}

/** A fact about the pattern for the readout: lengths in mm, or an angle. */
export interface Fact {
  label: string;
  lengths?: Array<number>;
  degrees?: number;
}

export interface ModelLine {
  keys: Array<string>;
  points: Array<readonly [number, number, number]>;
}

/** The finished 3D form, in millimetres, y up. */
export type ModelSpec =
  | {
      kind: 'lathe';
      /** [radius, height] pairs from the bottom up. */
      profile: Array<readonly [number, number]>;
      lines: Array<ModelLine>;
    }
  | {
      kind: 'solid';
      vertices: Array<readonly [number, number, number]>;
      faces: Array<Array<number>>;
      lines: Array<ModelLine>;
    };

export interface Pattern {
  pieces: Array<Piece>;
  facts: Array<Fact>;
  /** How to assemble, when the material or thickness needs explaining. */
  notes: Array<string>;
  model: ModelSpec;
}

export interface BuildInput {
  dims: Record<string, number>;
  options: Record<string, boolean>;
  material: Material;
  /** Material thickness to compensate for, 0 when compensation is off. */
  thicknessMm: number;
  /** Seam allowance, 0 when it is off. */
  seamMm: number;
}

export type BuildResult =
  | { ok: true; pattern: Pattern }
  | { ok: false; field?: string; message: string };
