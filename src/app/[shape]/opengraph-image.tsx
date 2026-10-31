import { notFound } from 'next/navigation';
import { shapeSeo } from '~/utils/seo';
import { SHAPES, isShapeSlug } from '~/utils/shapes';
import { OG_SIZE, renderOgCard } from '../_og/card';

export const alt = 'A CosplayShapes pattern template for a basic shape';
export const size = OG_SIZE;
export const contentType = 'image/png';

export const generateStaticParams = () =>
  SHAPES.map(shape => ({ shape: shape.slug }));

const Image = async ({ params }: { params: Promise<{ shape: string }> }) => {
  const { shape } = await params;
  if (!isShapeSlug(shape)) notFound();
  const { name } = shapeSeo(shape);
  return renderOgCard({
    heading: `${name} pattern`,
    detail: 'Your measurements as a tiled, true-scale PDF.',
    shapes: [shape],
  });
};

export default Image;
