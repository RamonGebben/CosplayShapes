import { DisplayTitle } from '~/atoms/DisplayTitle';
import type { Layout } from '~/utils/layout';
import type { ModelSpec } from '~/utils/pattern';
import { TIERS, type ShapeSlug } from '~/utils/shapes';
import { Category } from './components/Category';
import { Credits } from './components/Credits';
import { Facts } from './components/Facts';
import { Field } from './components/Field';
import { Frame } from './components/Frame';
import { Groups } from './components/Groups';
import { Intro } from './components/Intro';
import { Lead } from './components/Lead';
import { ShapeTile } from './components/ShapeTile';
import { TierHeader } from './components/TierHeader';
import { TierSummary } from './components/TierSummary';
import { TileGrid } from './components/TileGrid';

export interface ShapePreview {
  slug: ShapeSlug;
  layout: Layout;
  model: ModelSpec;
}

/** The maker's credit and Patreon link, shown in the intro or at the foot of the page. */
const credit = (
  <>
    <p>
      Made with{' '}
      <span role="img" aria-label="love">
        ❤️
      </span>{' '}
      by{' '}
      <a
        href="https://www.instagram.com/kernel.cosplay/"
        target="_blank"
        rel="noopener noreferrer"
      >
        @kernel.cosplay
      </a>
    </p>
    <p>
      <a
        href="https://www.patreon.com/cw/KernelsSoftwareEmporium"
        target="_blank"
        rel="noopener noreferrer"
      >
        Support this and other projects
      </a>{' '}
      on Patreon
    </p>
  </>
);

/** The shape picker: every shape with the flat pattern it becomes. */
export const Picker = ({ previews }: { previews: Array<ShapePreview> }) => (
  <Frame>
    <Intro>
      <Field aria-hidden="true" />
      <DisplayTitle $size="xl">
        cosplay
        <br />
        <span>shapes</span>
      </DisplayTitle>
      <Lead>
        Free pattern templates for cosplay and props. Pick a shape, enter your
        measurements and print it true to scale on A4, Letter or a larger sheet,
        or send an SVG to your cutter.
      </Lead>
      <Facts>
        <li>EVA foam, fabric, Worbla, card and cardboard</li>
        <li>Allows for foam thickness and seam allowance</li>
        <li>Free, with nothing to sign up for</li>
      </Facts>
      <Credits $placement="intro">{credit}</Credits>
    </Intro>
    <Groups aria-label="Shapes">
      {TIERS.map(tier => (
        <section key={tier.id} aria-labelledby={`tier-${tier.id}`}>
          <TierHeader>
            <DisplayTitle as="h2" id={`tier-${tier.id}`} $size="l">
              {tier.name}
            </DisplayTitle>
            <TierSummary>{tier.summary}</TierSummary>
          </TierHeader>
          {tier.categories.map(category => (
            <Category
              key={category.id}
              category={category}
              defaultOpen={tier.id === 'basic'}
            >
              <TileGrid>
                {category.shapes.map(shape => {
                  const preview = previews.find(
                    item => item.slug === shape.slug,
                  );
                  return (
                    preview && (
                      <li key={shape.slug}>
                        <ShapeTile
                          shape={shape}
                          layout={preview.layout}
                          model={preview.model}
                        />
                      </li>
                    )
                  );
                })}
              </TileGrid>
            </Category>
          ))}
        </section>
      ))}
    </Groups>
    <Credits $placement="footer">{credit}</Credits>
  </Frame>
);
