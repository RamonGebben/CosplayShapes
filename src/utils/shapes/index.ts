export type ShapeSlug =
  | 'cylinder'
  | 'cone'
  | 'truncated-cone'
  | 'dome'
  | 'sphere'
  | 'box'
  | 'pyramid'
  | 'prism';

export type ShapeFamily = 'round' | 'flat';

export interface LengthField {
  kind: 'length';
  key: string;
  label: string;
  /** Example value, in mm. */
  example: number;
  /** Which edges of the pattern and the model this measurement is. */
  edge: string;
}

export interface CountField {
  kind: 'count';
  key: string;
  label: string;
  example: number;
  min: number;
  max: number;
  edge: string;
  hint: string;
}

export type ShapeField = LengthField | CountField;

export interface ShapeOption {
  key: string;
  label: string;
  hint: string;
  example: boolean;
}

export interface Shape {
  slug: ShapeSlug;
  name: string;
  family: ShapeFamily;
  /** What the example measurements make, so they read as an example. */
  example: string;
  fields: Array<ShapeField>;
  options: Array<ShapeOption>;
}

const endsOption = (hint: string): ShapeOption => ({
  key: 'ends',
  label: 'Close the ends',
  hint,
  example: false,
});

export const SHAPES: Array<Shape> = [
  {
    slug: 'cylinder',
    name: 'Cylinder',
    family: 'round',
    example: 'Arm band',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Circumference',
        example: 280,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 60,
        edge: 'height',
      },
    ],
    options: [endsOption('Adds a round cap for each end.')],
  },
  {
    slug: 'cone',
    name: 'Cone',
    family: 'round',
    example: 'Horn tip',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Base circumference',
        example: 220,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 150,
        edge: 'height',
      },
    ],
    options: [endsOption('Adds a round cap for the base.')],
  },
  {
    slug: 'truncated-cone',
    name: 'Truncated cone',
    family: 'round',
    example: 'Bracer',
    fields: [
      {
        kind: 'length',
        key: 'top',
        label: 'Top circumference',
        example: 260,
        edge: 'top',
      },
      {
        kind: 'length',
        key: 'bottom',
        label: 'Bottom circumference',
        example: 320,
        edge: 'bottom',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 180,
        edge: 'height',
      },
    ],
    options: [endsOption('Adds a round cap for each end.')],
  },
  {
    slug: 'dome',
    name: 'Dome',
    family: 'round',
    example: 'Helmet crown',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Base circumference',
        example: 600,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 95,
        edge: 'height',
      },
      {
        kind: 'count',
        key: 'gores',
        label: 'Gores',
        example: 8,
        min: 3,
        max: 24,
        edge: 'seam',
        hint: 'More gores make a rounder dome with more seams.',
      },
    ],
    options: [],
  },
  {
    slug: 'sphere',
    name: 'Sphere',
    family: 'round',
    example: 'Orb',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Circumference',
        example: 400,
        edge: 'circumference',
      },
      {
        kind: 'count',
        key: 'gores',
        label: 'Gores',
        example: 8,
        min: 3,
        max: 24,
        edge: 'seam',
        hint: 'More gores make a rounder sphere with more seams.',
      },
    ],
    options: [],
  },
  {
    slug: 'box',
    name: 'Box',
    family: 'flat',
    example: 'Belt pouch',
    fields: [
      {
        kind: 'length',
        key: 'width',
        label: 'Width',
        example: 120,
        edge: 'width',
      },
      {
        kind: 'length',
        key: 'depth',
        label: 'Depth',
        example: 50,
        edge: 'depth',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 90,
        edge: 'height',
      },
    ],
    options: [
      {
        key: 'lid',
        label: 'Add a lid',
        hint: 'Leave off for an open-topped box.',
        example: true,
      },
    ],
  },
  {
    slug: 'pyramid',
    name: 'Pyramid',
    family: 'flat',
    example: 'Shoulder spike',
    fields: [
      {
        kind: 'length',
        key: 'width',
        label: 'Base width',
        example: 80,
        edge: 'width',
      },
      {
        kind: 'length',
        key: 'depth',
        label: 'Base depth',
        example: 80,
        edge: 'depth',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 110,
        edge: 'height',
      },
    ],
    options: [
      {
        key: 'base',
        label: 'Include the base',
        hint: 'Leave off when the pyramid sits on armour.',
        example: false,
      },
    ],
  },
  {
    slug: 'prism',
    name: 'Prism',
    family: 'flat',
    example: 'Crystal',
    fields: [
      {
        kind: 'count',
        key: 'sides',
        label: 'Sides',
        example: 6,
        min: 3,
        max: 12,
        edge: 'seam',
        hint: 'Three for a triangular prism, six for a hexagonal one.',
      },
      {
        kind: 'length',
        key: 'face',
        label: 'Face width',
        example: 40,
        edge: 'face',
      },
      {
        kind: 'length',
        key: 'length',
        label: 'Length',
        example: 160,
        edge: 'length',
      },
    ],
    options: [endsOption('Adds a flat cap for each end.')],
  },
];

export const FAMILIES: Array<{ id: ShapeFamily; name: string }> = [
  { id: 'round', name: 'Round' },
  { id: 'flat', name: 'Flat-sided' },
];

export const isShapeSlug = (value: string): value is ShapeSlug =>
  SHAPES.some(shape => shape.slug === value);

export const getShape = (slug: ShapeSlug) =>
  SHAPES.find(shape => shape.slug === slug) ?? SHAPES[0];

export const getExampleDims = (shape: Shape) =>
  Object.fromEntries(shape.fields.map(field => [field.key, field.example]));

export const getExampleOptions = (shape: Shape) =>
  Object.fromEntries(shape.options.map(option => [option.key, option.example]));
