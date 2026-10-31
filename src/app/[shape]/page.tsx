import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Generator } from '~/templates/Generator';
import { SHAPES, getShape, isShapeSlug } from '~/utils/shapes';

export const generateStaticParams = () =>
  SHAPES.map(shape => ({ shape: shape.slug }));

export const generateMetadata = async ({
  params,
}: PageProps<'/[shape]'>): Promise<Metadata> => {
  const { shape } = await params;
  if (!isShapeSlug(shape)) return {};
  const { name } = getShape(shape);
  return {
    title: `${name} pattern`,
    description: `Enter your measurements and print a true-scale ${name.toLowerCase()} pattern, or export an SVG for your cutter.`,
  };
};

const ShapeGenerator = async ({
  params,
}: Pick<PageProps<'/[shape]'>, 'params'>) => {
  const { shape } = await params;
  if (!isShapeSlug(shape)) notFound();
  // Keyed so a new shape mounts fresh and the title card wipes in again.
  return <Generator key={shape} slug={shape} />;
};

const ShapePage = ({ params }: PageProps<'/[shape]'>) => (
  <Suspense>
    <ShapeGenerator params={params} />
  </Suspense>
);

export default ShapePage;
