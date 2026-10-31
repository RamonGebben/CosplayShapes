import type { Unit } from '~/utils/units';
import { Item } from './components/Item';
import { List } from './components/List';
import { Swatch } from './components/Swatch';

/** Says what each kind of line means, and which measurement is lit. */
export const Legend = ({
  guides,
  pages,
  litLabel,
  unit,
}: {
  guides: boolean;
  pages: boolean;
  litLabel: string;
  unit: Unit;
}) => (
  <List aria-label="Line key">
    <Item>
      <Swatch $kind="cut" />
      Cut line
    </Item>
    {guides && (
      <Item>
        <Swatch $kind="guide" />
        Stitch or fold line
      </Item>
    )}
    <Item>
      <Swatch $kind="notch" />
      Alignment notch
    </Item>
    <Item>
      <Swatch $kind="lit" />
      {litLabel}
    </Item>
    {pages && (
      <Item>
        <Swatch $kind="pages" />
        Page edge
      </Item>
    )}
    <Item>
      <Swatch $kind="grid" />
      {unit === 'cm' ? '1 cm grid' : '1 in grid'}
    </Item>
  </List>
);
