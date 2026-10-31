import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Generator } from '~/templates/Generator';
import { StructuredData } from '~/atoms/StructuredData';
import { SITE, shapePath, shapeSeo, webApplicationSchema } from '~/utils/seo';
import { SHAPES, isShapeSlug } from '~/utils/shapes';

export const generateStaticParams = () =>
  SHAPES.map(shape => ({ shape: shape.slug }));

export const generateMetadata = async ({
  params,
}: PageProps<'/[shape]'>): Promise<Metadata> => {
  const { shape } = await params;
  if (!isShapeSlug(shape)) return {};
  const { title, description, keywords } = shapeSeo(shape);
  const url = shapePath(shape);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      title,
      description,
      url,
      locale: 'en',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
};

const ShapeGenerator = async ({
  params,
}: Pick<PageProps<'/[shape]'>, 'params'>) => {
  const { shape } = await params;
  if (!isShapeSlug(shape)) notFound();
  // Keyed so a new shape mounts fresh and the title card wipes in again.
  return (
    <>
      <StructuredData data={webApplicationSchema(shape)} />
      <Generator key={shape} slug={shape} />
    </>
  );
};

const ShapePage = ({ params }: PageProps<'/[shape]'>) => (
  <Suspense>
    <ShapeGenerator params={params} />
  </Suspense>
);

export default ShapePage;
