'use client';

import { useState } from 'react';
import { ShapeRail } from '~/organisms/ShapeRail';
import { downloadBlob, patternFileName } from '~/utils/download';
import { getMaterial } from '~/utils/materials';
import { SITE, shapePath } from '~/utils/seo';
import { exportSummary, formatFact, materialLabel } from '~/utils/patternText';
import { getShape, type ShapeSlug } from '~/utils/shapes';
import { shareUrl, type Search } from '~/utils/shareUrl';
import { patternSvg } from '~/utils/svgExport';
import { ExportBar, type ExportStatus } from './components/ExportBar';
import { Frame } from './components/Frame';
import { Main } from './components/Main';
import { SettingsForm } from './components/SettingsForm';
import { Stage } from './components/Stage';
import { useGenerator } from './hooks/useGenerator';
import { useUrlSync } from './hooks/useUrlSync';

export interface GeneratorProps {
  slug: ShapeSlug;
  /** The page's query: a shared link's settings, or none. */
  search?: Search;
}

const NO_SEARCH = new URLSearchParams();

/** On a phone the share sheet beats a clipboard nobody can see. */
const canShareSheet = () =>
  typeof navigator.share === 'function' &&
  window.matchMedia('(pointer: coarse)').matches;

export const Generator = ({ slug, search = NO_SEARCH }: GeneratorProps) => {
  const shape = getShape(slug);
  const {
    state,
    dispatch,
    edited,
    input,
    errors,
    pattern,
    layout,
    paper,
    stale,
  } = useGenerator(slug, search);
  useUrlSync(state, edited);
  const [edge, setEdge] = useState(shape.fields[0].edge);
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [making, setMaking] = useState(false);
  const material = getMaterial(state.material);
  const label = materialLabel(material, input.thicknessMm);
  const summary = exportSummary(layout, paper);
  const litField = shape.fields.find(field => field.edge === edge);

  const onPdf = async () => {
    setMaking(true);
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
          link: `${SITE.url}${shapePath(slug)}`,
          share: shareUrl(state),
          notes: pattern.notes,
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
    } finally {
      setMaking(false);
    }
  };

  const onShare = async () => {
    // This host, so a link copied from a local or preview build opens there.
    const url = shareUrl(state, window.location.origin);
    if (canShareSheet()) {
      const shared = await navigator
        .share({ title: `${shape.name} pattern`, url })
        .then(() => true)
        // Dismissing the sheet is an answer; any other failure falls back.
        .catch(
          (error: unknown) =>
            error instanceof DOMException && error.name === 'AbortError',
        );
      if (shared) return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch {
      setStatus('copyFailed');
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
          onShare={onShare}
          status={status}
          making={making}
          disabled={stale}
        />
      </Main>
    </Frame>
  );
};
