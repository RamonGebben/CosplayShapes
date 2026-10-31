import { ShapeIcon } from '~/atoms/ShapeIcon';
import { FAMILIES, SHAPES, type ShapeSlug } from '~/utils/shapes';
import { Brand } from './components/Brand';
import { Foot } from './components/Foot';
import { GroupHeading } from './components/GroupHeading';
import { Rail } from './components/Rail';
import { RailLink } from './components/RailLink';
import { RailList } from './components/RailList';

/** The ultramarine rail: every shape, grouped, the current one in magenta. */
export const ShapeRail = ({ active }: { active?: ShapeSlug }) => (
  <Rail aria-label="Shapes">
    <Brand href="/">
      basic-shape
      <br />
      <span>patterns</span>
    </Brand>
    {FAMILIES.map(family => (
      <section key={family.id} aria-labelledby={`rail-${family.id}`}>
        <GroupHeading id={`rail-${family.id}`}>{family.name}</GroupHeading>
        <RailList>
          {SHAPES.filter(shape => shape.family === family.id).map(shape => (
            <li key={shape.slug}>
              <RailLink
                href={`/${shape.slug}`}
                aria-current={shape.slug === active ? 'page' : undefined}
              >
                <ShapeIcon slug={shape.slug} />
                {shape.name}
              </RailLink>
            </li>
          ))}
        </RailList>
      </section>
    ))}
    <Foot>Free. Prints at 100%.</Foot>
  </Rail>
);
