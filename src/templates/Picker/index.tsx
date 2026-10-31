import { DisplayTitle } from '~/atoms/DisplayTitle';
import type { Layout } from '~/utils/layout';
import { FAMILIES, SHAPES, type ShapeSlug } from '~/utils/shapes';
import { Facts } from './components/Facts';
import { Field } from './components/Field';
import { Frame } from './components/Frame';
import { Groups } from './components/Groups';
import { Intro } from './components/Intro';
import { Lead } from './components/Lead';
import { ShapeTile } from './components/ShapeTile';
import { TileGrid } from './components/TileGrid';

export interface ShapePreview {
  slug: ShapeSlug;
  layout: Layout;
}

/** The shape picker: every shape with the flat pattern it becomes. */
export const Picker = ({ previews }: { previews: Array<ShapePreview> }) => (
  <Frame>
    <Intro>
      <Field aria-hidden="true" />
      <DisplayTitle $size="xl">
        basic-shape
        <br />
        <span>patterns</span>
      </DisplayTitle>
      <Lead>
        Pick a shape and enter your measurements. Print a pattern that is true
        to scale on A4 or Letter, or send an SVG to your cutter.
      </Lead>
      <Facts>
        <li>EVA foam, fabric, Worbla, card and cardboard</li>
        <li>Allows for foam thickness and seam allowance</li>
        <li>Free, with nothing to sign up for</li>
      </Facts>
    </Intro>
    <Groups aria-label="Shapes">
      {FAMILIES.map(family => (
        <section key={family.id} aria-labelledby={`family-${family.id}`}>
          <DisplayTitle as="h2" id={`family-${family.id}`} $size="l">
            {family.name}
          </DisplayTitle>
          <TileGrid>
            {SHAPES.filter(shape => shape.family === family.id).map(shape => {
              const preview = previews.find(item => item.slug === shape.slug);
              return (
                preview && (
                  <li key={shape.slug}>
                    <ShapeTile shape={shape} layout={preview.layout} />
                  </li>
                )
              );
            })}
          </TileGrid>
        </section>
      ))}
    </Groups>
  </Frame>
);
