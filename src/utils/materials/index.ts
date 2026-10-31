export type MaterialId =
  'eva' | 'fabric' | 'thermoplastic' | 'paper' | 'cardboard';

/** How pieces of a material are joined, which decides the pattern's layout. */
export type JoinStyle = 'butt' | 'sewn' | 'tabbed';

export interface Material {
  id: MaterialId;
  name: string;
  /** Short form for pattern labels. */
  short: string;
  join: JoinStyle;
  thicknessMm: number;
  compensate: boolean;
  seam: boolean;
  seamMm: number;
  /** What the maker should know about how this material's pieces join. */
  joinNote: string;
}

export const MATERIALS: Array<Material> = [
  {
    id: 'eva',
    name: 'EVA foam',
    short: 'EVA',
    join: 'butt',
    thicknessMm: 6,
    compensate: true,
    seam: false,
    seamMm: 0,
    joinNote: 'Cut edges butt together and are glued with contact cement.',
  },
  {
    id: 'fabric',
    name: 'Fabric',
    short: 'Fabric',
    join: 'sewn',
    thicknessMm: 0,
    compensate: false,
    seam: true,
    seamMm: 10,
    joinNote: 'The dashed line is the stitch line; cut on the solid line.',
  },
  {
    id: 'thermoplastic',
    name: 'Thermoplastic (Worbla)',
    short: 'Worbla',
    join: 'butt',
    thicknessMm: 1.5,
    compensate: true,
    seam: false,
    seamMm: 0,
    joinNote: 'Heat the edges and press them together, or overlap a strip.',
  },
  {
    id: 'paper',
    name: 'Paper or cardstock',
    short: 'Card',
    join: 'tabbed',
    thicknessMm: 0.3,
    compensate: false,
    seam: false,
    seamMm: 0,
    joinNote: 'Score the dashed lines, fold, and glue the tabs inside.',
  },
  {
    id: 'cardboard',
    name: 'Cardboard',
    short: 'Cardboard',
    join: 'tabbed',
    thicknessMm: 3,
    compensate: true,
    seam: false,
    seamMm: 0,
    joinNote: 'Score the dashed lines, fold, and glue the tabs inside.',
  },
];

export const getMaterial = (id: MaterialId) =>
  MATERIALS.find(material => material.id === id) ?? MATERIALS[0];

export const THICKNESS_RANGE_MM = { min: 0, max: 10 } as const;
export const SEAM_RANGE_MM = { min: 0, max: 20 } as const;
