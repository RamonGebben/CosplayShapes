import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { getMaterial } from '~/utils/materials';
import { buildPattern } from '~/utils/pattern';
import { PatternDrawing } from '.';

const result = buildPattern('truncated-cone', {
  dims: { top: 260, bottom: 320, height: 180 },
  options: {},
  material: getMaterial('eva'),
  thicknessMm: 6,
  seamMm: 0,
});

if (!result.ok) throw new Error(result.message);

const meta = {
  component: PatternDrawing,
  args: {
    layout: layoutPattern(result.pattern.pieces, PAPERS.a4),
    title: 'Flat pattern for a truncated cone',
    highlight: 'top',
    detailed: true,
    showPages: true,
    unit: 'cm',
    materialLabel: 'EVA 6 mm',
  },
  decorators: [
    Story => (
      <div style={{ width: 640, height: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PatternDrawing>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Thumbnail: Story = { args: { detailed: false } };
