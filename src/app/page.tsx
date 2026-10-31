import { StructuredData } from '~/atoms/StructuredData';
import { Picker } from '~/templates/Picker';
import { buildExample } from '~/utils/examples';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { webApplicationSchema } from '~/utils/seo';
import { SHAPES } from '~/utils/shapes';

const HomePage = () => {
  const previews = SHAPES.map(shape => {
    const example = buildExample(shape.slug);
    return {
      slug: shape.slug,
      layout: layoutPattern(example.pieces, PAPERS.a4),
      model: example.model,
    };
  });
  return (
    <>
      <StructuredData data={webApplicationSchema()} />
      <Picker previews={previews} />
    </>
  );
};

export default HomePage;
