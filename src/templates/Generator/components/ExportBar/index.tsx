'use client';

import { SplitButton } from '~/molecules/SplitButton';
import type { PaperId } from '~/utils/layout';
import { Actions } from './components/Actions';
import { Bar } from './components/Bar';
import { Details } from './components/Details';
import { PaperSelect } from './components/PaperSelect';
import { Status } from './components/Status';
import { Summary } from './components/Summary';
import { Tag } from './components/Tag';

/** The last export's outcome, shown once no PDF is being made. */
export type ExportStatus = 'idle' | 'done' | 'failed' | 'copied' | 'copyFailed';

export interface ExportBarProps {
  pieces: string;
  pages: string;
  paper: PaperId;
  onPaper: (paper: PaperId) => void;
  onPdf: () => void;
  onSvg: () => void;
  onShare: () => void;
  status: ExportStatus;
  /** A PDF is being made: its button waits and says so. */
  making: boolean;
  disabled: boolean;
}

const MESSAGES: Record<ExportStatus, { text: string; error: boolean }> = {
  idle: { text: '', error: false },
  done: {
    text: 'PDF saved. Print it at 100% and measure the square on page 1.',
    error: false,
  },
  failed: {
    text: 'The PDF could not be made. Try again, or use the SVG.',
    error: true,
  },
  copied: {
    text: 'Link copied. It opens this pattern with your measurements.',
    error: false,
  },
  copyFailed: {
    text: 'The link could not be copied. Copy it from the address bar.',
    error: true,
  },
};

export const ExportBar = ({
  pieces,
  pages,
  paper,
  onPaper,
  onPdf,
  onSvg,
  onShare,
  status,
  making,
  disabled,
}: ExportBarProps) => {
  const message = making
    ? { text: 'Making your PDF…', error: false }
    : MESSAGES[status];
  return (
    <Bar aria-label="Export">
      <Summary>
        <Details>
          <b>{pieces}</b> on <b>{pages}</b> + a scale guide page
          <Status role="status" $error={message.error}>
            {message.text}
          </Status>
        </Details>
      </Summary>
      <Actions>
        <PaperSelect value={paper} onChange={onPaper} />
        <SplitButton
          onClick={onPdf}
          disabled={disabled || making}
          menuLabel="More export options"
          items={[
            {
              label: 'SVG for cutter',
              hint: 'Cricut, laser or vinyl cutter',
              onSelect: onSvg,
              disabled,
            },
            {
              label: 'Copy link',
              hint: 'Opens this pattern with your measurements',
              onSelect: onShare,
            },
          ]}
        >
          {making ? (
            'Making PDF…'
          ) : (
            <>
              Download PDF <Tag>· true scale</Tag>
            </>
          )}
        </SplitButton>
      </Actions>
    </Bar>
  );
};
