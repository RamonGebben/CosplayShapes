'use client';

import { useId, useState } from 'react';
import { Chevron } from '~/atoms/Chevron';
import { ShapeIcon } from '~/atoms/ShapeIcon';
import type { Category as ShapeCategory, ShapeSlug } from '~/utils/shapes';
import { centredScrollLeft } from '~/utils/stripScroll';
import { CategoryHeading } from '../CategoryHeading';
import { CategoryToggle } from '../CategoryToggle';
import { RailLink } from '../RailLink';
import { RailList } from '../RailList';

export interface CategoryProps {
  category: ShapeCategory;
  active?: ShapeSlug;
  defaultOpen: boolean;
}

/** In the phone strip, scrolls the current shape to the middle so it shows on arrival. */
const revealInStrip = (link: HTMLAnchorElement | null) => {
  const strip = link?.closest('nav');
  if (!link || !strip || strip.scrollWidth <= strip.clientWidth) return;
  const linkBox = link.getBoundingClientRect();
  strip.scrollLeft = centredScrollLeft({
    itemLeft:
      linkBox.left - strip.getBoundingClientRect().left + strip.scrollLeft,
    itemWidth: linkBox.width,
    viewWidth: strip.clientWidth,
    scrollWidth: strip.scrollWidth,
  });
};

/** One category of shapes in the rail, folded away until the maker opens it. */
export const Category = ({ category, active, defaultOpen }: CategoryProps) => {
  const listId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <CategoryHeading>
        <CategoryToggle
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(!open)}
        >
          {category.name}
          <Chevron open={open} />
        </CategoryToggle>
      </CategoryHeading>
      <RailList id={listId} $open={open}>
        {category.shapes.map(shape => (
          <li key={shape.slug}>
            <RailLink
              href={`/${shape.slug}`}
              aria-current={shape.slug === active ? 'page' : undefined}
              ref={shape.slug === active ? revealInStrip : undefined}
            >
              <ShapeIcon slug={shape.slug} />
              {shape.name}
            </RailLink>
          </li>
        ))}
      </RailList>
    </>
  );
};
