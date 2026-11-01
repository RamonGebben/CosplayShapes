'use client';

import { useId } from 'react';
import { MeasureDiagram } from '~/atoms/MeasureDiagram';
import { Toggletip } from '~/molecules/Toggletip';
import { Lead } from './components/Lead';
import { Terms } from './components/Terms';

/** Explains circumference, diameter and radius, with the diagram. */
export const MeasureHelp = () => {
  const titleId = useId();
  return (
    <Toggletip
      label="How to measure"
      lead={<Lead>Fill in circumference or diameter; the other follows.</Lead>}
    >
      <MeasureDiagram titleId={titleId} />
      <Terms>
        <dt>Circumference</dt>
        <dd>All the way around, where a tape measure goes.</dd>
        <dt>Diameter</dt>
        <dd>Straight across, through the middle.</dd>
        <dt>Radius</dt>
        <dd>Half the diameter. You won’t need it here.</dd>
      </Terms>
    </Toggletip>
  );
};
