'use client';

import { ActionButton } from '~/atoms/ActionButton';
import { SegmentedControl } from '~/molecules/SegmentedControl';
import type { PaperId } from '~/utils/layout';
import { Actions } from './components/Actions';
import { Bar } from './components/Bar';
import { Details } from './components/Details';
import { Status } from './components/Status';
import { Summary } from './components/Summary';

export type ExportStatus = 'idle' | 'working' | 'done' | 'failed';

export interface ExportBarProps {
  pieces: string;
  pages: string;
  paper: PaperId;
  onPaper: (paper: PaperId) => void;
  onPdf: () => void;
  onSvg: () => void;
  status: ExportStatus;
  disabled: boolean;
}

const MESSAGES: Record<ExportStatus, string> = {
  idle: '',
  working: 'Making your PDF…',
  done: 'PDF saved. Print it at 100% and measure the square on page 1.',
  failed: 'The PDF could not be made. Try again, or use the SVG.',
};

export const ExportBar = ({
  pieces,
  pages,
  paper,
  onPaper,
  onPdf,
  onSvg,
  status,
  disabled,
}: ExportBarProps) => (
  <Bar aria-label="Export">
    <Summary>
      <Details>
        <b>{pieces}</b> on <b>{pages}</b> + a scale guide page
        <Status role="status" $tone={status}>
          {MESSAGES[status]}
        </Status>
      </Details>
      <ActionButton $variant="secondary" onClick={onSvg} disabled={disabled}>
        SVG for cutter
      </ActionButton>
    </Summary>
    <Actions>
      <SegmentedControl
        label="Paper size"
        options={[
          { value: 'a4', label: 'A4' },
          { value: 'letter', label: 'Letter' },
        ]}
        value={paper}
        onChange={onPaper}
      />
      <ActionButton
        $variant="primary"
        onClick={onPdf}
        disabled={disabled || status === 'working'}
      >
        {status === 'working' ? (
          'Making PDF…'
        ) : (
          <>
            Download PDF <span>· true scale</span>
          </>
        )}
      </ActionButton>
    </Actions>
  </Bar>
);
