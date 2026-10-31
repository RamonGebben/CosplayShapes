'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { DisplayTitle } from '~/atoms/DisplayTitle';
import { PatternDrawing } from '~/molecules/PatternDrawing';
import { ToggleField } from '~/molecules/ToggleField';
import type { Layout } from '~/utils/layout';
import type { ModelSpec } from '~/utils/pattern';
import type { Unit } from '~/utils/units';
import { Field } from './components/Field';
import { FlatHeader } from './components/FlatHeader';
import { FlatPane } from './components/FlatPane';
import { Legend } from './components/Legend';
import { ModelSlot } from './components/ModelSlot';
import { StageFrame } from './components/StageFrame';
import { StaleNote } from './components/StaleNote';
import { Summary } from './components/Summary';
import { TitleBlock } from './components/TitleBlock';

const ModelView = dynamic(
  () => import('~/organisms/ModelView').then(module => module.ModelView),
  { ssr: false },
);

export interface StageProps {
  shapeName: string;
  /** Facts for the title card; each stays on one line. */
  summary: Array<string>;
  model: ModelSpec;
  layout: Layout;
  highlight: string;
  highlightLabel: string;
  unit: Unit;
  materialLabel: string;
  stale: boolean;
}

/**
 * The title card: the finished form on the ultramarine field, its flat
 * pattern on the paper side, one hard diagonal between them.
 */
export const Stage = ({
  shapeName,
  summary,
  model,
  layout,
  highlight,
  highlightLabel,
  unit,
  materialLabel,
  stale,
}: StageProps) => {
  const [showPages, setShowPages] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const onUnavailable = useCallback(() => setWebgl(false), []);
  const guides = layout.placed.some(
    ({ piece }) => piece.stitch || piece.folds.length > 0,
  );
  return (
    <StageFrame aria-label={`${shapeName} pattern preview`}>
      <Field aria-hidden="true" />
      <TitleBlock
        $longestWord={Math.max(
          ...shapeName.split(' ').map(word => word.length),
        )}
      >
        <DisplayTitle $size="xl">{shapeName}</DisplayTitle>
        <Summary>
          {summary.map((fact, index) => (
            <span key={fact}>
              <span>
                {fact}
                {index < summary.length - 1 && ' ·'}
              </span>{' '}
            </span>
          ))}
        </Summary>
      </TitleBlock>
      {webgl && (
        <ModelSlot>
          <ModelView
            model={model}
            highlight={highlight}
            label={`${shapeName}, finished`}
            onUnavailable={onUnavailable}
          />
        </ModelSlot>
      )}
      <FlatHeader>
        <DisplayTitle as="h2" $size="l">
          Flat pattern
        </DisplayTitle>
        <ToggleField
          label="Show page edges"
          checked={showPages}
          onChange={setShowPages}
        />
      </FlatHeader>
      <FlatPane $alone={!webgl}>
        {stale && (
          <StaleNote role="status">
            Showing the last pattern that worked. Fix the marked field to update
            it.
          </StaleNote>
        )}
        <PatternDrawing
          layout={layout}
          title={`Flat pattern for the ${shapeName.toLowerCase()}, drawn to scale`}
          highlight={highlight}
          showPages={showPages}
          unit={unit}
          materialLabel={materialLabel}
          detailed
          padding={28}
        />
      </FlatPane>
      <Legend
        guides={guides}
        pages={showPages}
        litLabel={highlightLabel}
        unit={unit}
      />
    </StageFrame>
  );
};
