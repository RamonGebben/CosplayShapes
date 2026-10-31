import { PatternDrawing } from '~/molecules/PatternDrawing';
import type { Layout } from '~/utils/layout';
import type { Shape } from '~/utils/shapes';
import { Art } from './components/Art';
import { Example } from './components/Example';
import { Name } from './components/Name';
import { TileLink } from './components/TileLink';

/** A shape's name over the flat pieces it becomes, linking to its generator. */
export const ShapeTile = ({
  shape,
  layout,
}: {
  shape: Shape;
  layout: Layout;
}) => (
  <TileLink href={`/${shape.slug}`}>
    <Art>
      <PatternDrawing
        layout={layout}
        title={`Flat pattern for a ${shape.name.toLowerCase()}`}
      />
    </Art>
    <Name>{shape.name}</Name>
    <Example>Example: {shape.example.toLowerCase()}</Example>
  </TileLink>
);
