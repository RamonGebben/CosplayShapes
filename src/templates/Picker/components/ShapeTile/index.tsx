import { ShapeIcon } from '~/atoms/ShapeIcon';
import { PatternDrawing } from '~/molecules/PatternDrawing';
import { ModelStill } from '~/organisms/ModelStill';
import type { Layout } from '~/utils/layout';
import type { ModelSpec } from '~/utils/pattern';
import type { Shape } from '~/utils/shapes';
import { Art } from './components/Art';
import { Example } from './components/Example';
import { FlatArt } from './components/FlatArt';
import { ModelField } from './components/ModelField';
import { Name } from './components/Name';
import { TileLink } from './components/TileLink';

/**
 * A shape's finished form beside the flat pieces it becomes, its name
 * underneath, linking to its generator.
 */
export const ShapeTile = ({
  shape,
  layout,
  model,
}: {
  shape: Shape;
  layout: Layout;
  model: ModelSpec;
}) => (
  <TileLink href={`/${shape.slug}`}>
    <Art>
      <ModelField>
        <ModelStill
          model={model}
          width={112}
          height={112}
          fallback={<ShapeIcon slug={shape.slug} size={44} />}
        />
      </ModelField>
      <FlatArt>
        <PatternDrawing
          layout={layout}
          title={`Flat pattern for a ${shape.name.toLowerCase()}`}
        />
      </FlatArt>
    </Art>
    <Name>{shape.name}</Name>
    <Example>Example: {shape.example.toLowerCase()}</Example>
  </TileLink>
);
