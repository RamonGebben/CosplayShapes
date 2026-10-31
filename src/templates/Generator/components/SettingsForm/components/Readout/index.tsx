import type { Fact } from '~/utils/pattern';
import type { Unit } from '~/utils/units';
import { formatFact } from '~/utils/patternText';
import { List } from './components/List';
import { Note } from './components/Note';
import { Wrapper } from './components/Wrapper';

/** What the pattern works out to, so the numbers can be checked. */
export const Readout = ({
  facts,
  unit,
  notes,
}: {
  facts: Array<Fact>;
  unit: Unit;
  notes: Array<string>;
}) => (
  <Wrapper aria-label="Pattern measurements">
    <List>
      {facts.map(fact => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{formatFact(fact, unit)}</dd>
        </div>
      ))}
    </List>
    {notes.map(note => (
      <Note key={note}>{note}</Note>
    ))}
  </Wrapper>
);
