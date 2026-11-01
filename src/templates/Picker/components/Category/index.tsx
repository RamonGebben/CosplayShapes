'use client';

import { useId, useState, type ReactNode } from 'react';
import { Chevron } from '~/atoms/Chevron';
import type { Category as ShapeCategory } from '~/utils/shapes';
import { Panel } from './components/Panel';
import { Toggle } from './components/Toggle';
import { Wrapper } from './components/Wrapper';

export interface CategoryProps {
  category: ShapeCategory;
  defaultOpen: boolean;
  children: ReactNode;
}

/**
 * One category of shape tiles. Folded, its heading still names every shape in it, so nothing is
 * hidden from a maker scanning for one.
 */
export const Category = ({
  category,
  defaultOpen,
  children,
}: CategoryProps) => {
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Wrapper>
      <h3>
        <Toggle
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        >
          <span>
            <strong>{category.name}</strong>
            {!open && (
              <span>{category.shapes.map(shape => shape.name).join(', ')}</span>
            )}
          </span>
          <Chevron open={open} size={14} />
        </Toggle>
      </h3>
      <Panel id={panelId} hidden={!open}>
        {children}
      </Panel>
    </Wrapper>
  );
};
