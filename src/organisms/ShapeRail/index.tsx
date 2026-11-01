import { TIERS, type ShapeSlug } from '~/utils/shapes';
import { Brand } from './components/Brand';
import { Category } from './components/Category';
import { Foot } from './components/Foot';
import { GroupHeading } from './components/GroupHeading';
import { Rail } from './components/Rail';
import { Tier } from './components/Tier';

/**
 * The ultramarine rail: every shape, basic tier first, the current one in magenta. Basic categories
 * start open; complex ones start folded unless they hold the current shape.
 */
export const ShapeRail = ({ active }: { active?: ShapeSlug }) => (
  <Rail aria-label="Shapes">
    <Brand href="/">
      cosplay
      <br />
      <span>shapes</span>
    </Brand>
    {TIERS.map(tier => (
      <Tier key={tier.id} aria-labelledby={`rail-${tier.id}`}>
        <GroupHeading id={`rail-${tier.id}`}>{tier.name}</GroupHeading>
        {tier.categories.map(category => (
          <Category
            key={category.id}
            category={category}
            active={active}
            defaultOpen={
              tier.id === 'basic' ||
              category.shapes.some(shape => shape.slug === active)
            }
          />
        ))}
      </Tier>
    ))}
    <Foot>Free. Prints at 100%.</Foot>
  </Rail>
);
