import { OG_SIZE, renderOgCard } from './_og/card';

export const alt =
  'CosplayShapes: free pattern templates for cosplay and props, printed as a tiled true-scale PDF';
export const size = OG_SIZE;
export const contentType = 'image/png';

const Image = () =>
  renderOgCard({
    heading: 'Pattern templates in your size',
    detail: 'Tiled across A4, Letter or larger, true to scale.',
    shapes: ['cone', 'dome', 'box', 'truncated-cone'],
  });

export default Image;
