import type { ShapeSlug } from '~/utils/shapes';

const PATHS: Record<ShapeSlug, string> = {
  cylinder:
    'M4 5.5a7 2.5 0 1 0 14 0a7 2.5 0 1 0 -14 0M4 5.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11',
  cone: 'M11 2 4 16.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5L11 2Z',
  'truncated-cone':
    'M6 5a5 2 0 1 0 10 0a5 2 0 1 0 -10 0M6 5 4 16.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5L16 5',
  dome: 'M3 15.5a8 8 0 0 1 16 0M3 15.5a8 2.5 0 1 0 16 0a8 2.5 0 1 0 -16 0',
  'oval-dome':
    'M3 15.5C3 7.5 6.5 4 11 4s8 3.5 8 11.5M3 15.5a8 2.5 0 1 0 16 0a8 2.5 0 1 0 -16 0',
  'pointed-dome':
    'M3 15.5C3 10 6.5 6 11 2c4.5 4 8 8 8 13.5M3 15.5a8 2.5 0 1 0 16 0a8 2.5 0 1 0 -16 0',
  sphere:
    'M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M3 11a8 3 0 1 0 16 0a8 3 0 1 0 -16 0',
  capsule:
    'M7 6a4 4 0 0 1 8 0v10a4 4 0 0 1-8 0V6Zm0 0a4 1.5 0 0 0 8 0M7 16a4 1.5 0 0 0 8 0',
  box: 'M4 7l7-4 7 4v9l-7 4-7-4V7Zm0 0 7 4 7-4M11 11v9',
  pyramid: 'M11 2 3 16.5l8 3.5 8-3.5L11 2Zm0 0v18',
  prism: 'M7 3h8l4 3.5v11L15 20H7l-4-2.5v-11L7 3Zm0 0v17M15 3v17',
  'tapered-prism':
    'M8 3h6l2.5 3L19 17.5 15 20H7l-4-2.5L5.5 6 8 3Zm0 0-1 17M14 3l1 17',
};

/** A line drawing of the shape, stroked in the current text colour. */
export const ShapeIcon = ({
  slug,
  size = 22,
}: {
  slug: ShapeSlug;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={PATHS[slug]} />
  </svg>
);
