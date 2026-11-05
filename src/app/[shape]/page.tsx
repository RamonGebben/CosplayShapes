import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Generator } from '~/templates/Generator';
import { StructuredData } from '~/atoms/StructuredData';
import { SITE, shapePath, shapeSeo, webApplicationSchema } from '~/utils/seo';
import { SHAPES, isShapeSlug } from '~/utils/shapes';
import { GeneratorFromQuery } from './GeneratorFromQuery';

export const generateStaticParams = () =>
  SHAPES.map(shape => ({ shape: shape.slug }));

/** A shared link and the clean page both point at the clean path. */
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

/**
 * The whole page is built ahead, and the build fails if anything here starts
 * reading the request. It also makes an unknown slug wait for its render, so
 * the not-found answers 404 instead of streaming after a 200 shell.
 */
export const ensureStatic = 'navigation';

const ShapeGenerator = async ({
  params,
}: Pick<PageProps<'/[shape]'>, 'params'>) => {
  const { shape } = await params;
  if (!isShapeSlug(shape)) notFound();
  // Keyed so a new shape mounts fresh and the title card wipes in again. The
  // example is prerendered as the fallback; a link's settings fill it in
  // once the browser has read the query.
  return (
    <>
      <StructuredData data={webApplicationSchema(shape)} />
      <Suspense fallback={<Generator key={shape} slug={shape} />}>
        <GeneratorFromQuery key={shape} slug={shape} />
      </Suspense>
    </>
  );
};

const ShapePage = ({ params }: PageProps<'/[shape]'>) => (
  <Suspense>
    <ShapeGenerator params={params} />
  </Suspense>
);

export default ShapePage;
