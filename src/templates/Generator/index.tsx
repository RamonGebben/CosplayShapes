'use client';

import { useState } from 'react';
import { ShapeRail } from '~/organisms/ShapeRail';
import { downloadBlob, patternFileName } from '~/utils/download';
import { getMaterial } from '~/utils/materials';
import { exportSummary, formatFact, materialLabel } from '~/utils/patternText';
import { getShape, type ShapeSlug } from '~/utils/shapes';
import { patternSvg } from '~/utils/svgExport';
import { ExportBar, type ExportStatus } from './components/ExportBar';
import { Frame } from './components/Frame';
import { Main } from './components/Main';
import { SettingsForm } from './components/SettingsForm';
import { Stage } from './components/Stage';
import { useGenerator } from './hooks/useGenerator';

export const Generator = ({ slug }: { slug: ShapeSlug }) => {
  const shape = getShape(slug);
  const { state, dispatch, input, errors, pattern, layout, paper, stale } =
    useGenerator(slug);
  const [edge, setEdge] = useState(shape.fields[0].edge);
  const [status, setStatus] = useState<ExportStatus>('idle');
  const material = getMaterial(state.material);
  const label = materialLabel(material, input.thicknessMm);
  const summary = exportSummary(layout, paper);
  const litField = shape.fields.find(field => field.edge === edge);

  const onPdf = async () => {
    setStatus('working');
    try {
      const [{ patternPdf }, headingFont] = await Promise.all([
        import('~/utils/pdfExport'),
        // Without the display face the headings fall back to Helvetica Bold.
        fetch('/fonts/BigShoulders-Black.ttf')
          .then(response => (response.ok ? response.arrayBuffer() : undefined))
          .catch(() => undefined),
      ]);
      const bytes = await patternPdf(
        layout,
        paper,
        {
          title: `${shape.name} pattern`,
          materialLabel: label,
          unit: state.unit,
        },
        headingFont,
      );
      downloadBlob(
        new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
        patternFileName(slug, 'pdf', paper.id),
      );
      setStatus('done');
    } catch {
      setStatus('failed');
    }
  };

  const onSvg = () =>
    downloadBlob(
      new Blob([patternSvg(layout, label)], { type: 'image/svg+xml' }),
      patternFileName(slug, 'svg'),
    );

  return (
    <Frame>
      <ShapeRail active={slug} />
      <SettingsForm
        shape={shape}
        state={state}
        errors={errors}
        dispatch={dispatch}
        onEdge={setEdge}
        facts={pattern.facts}
        notes={pattern.notes}
      />
      <Main>
        <Stage
          shapeName={shape.name}
          summary={pattern.facts
            .slice(0, 2)
            .map(fact => `${fact.label} ${formatFact(fact, state.unit)}`)}
          model={pattern.model}
          layout={layout}
          highlight={edge}
          highlightLabel={litField?.label ?? 'Seams'}
          unit={state.unit}
          materialLabel={label}
          stale={stale}
        />
        <ExportBar
          pieces={summary.pieces}
          pages={summary.pages}
          paper={state.paper}
          onPaper={value => {
            setStatus('idle');
            dispatch({ type: 'paper', paper: value });
          }}
          onPdf={onPdf}
          onSvg={onSvg}
          status={status}
          disabled={stale}
        />
      </Main>
    </Frame>
  );
};
