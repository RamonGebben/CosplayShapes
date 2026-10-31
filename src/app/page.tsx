import { Picker } from '~/templates/Picker';
import { buildExample } from '~/utils/examples';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { SHAPES } from '~/utils/shapes';

const HomePage = () => {
  const previews = SHAPES.map(shape => ({
    slug: shape.slug,
    layout: layoutPattern(buildExample(shape.slug).pieces, PAPERS.a4),
  }));
  return <Picker previews={previews} />;
};

export default HomePage;
