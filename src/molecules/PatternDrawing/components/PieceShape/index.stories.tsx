import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { buildExample } from '~/utils/examples';
import { PieceShape } from '.';

const [piece] = buildExample('cone').pieces;

const meta = {
  component: PieceShape,
  args: {
    piece,
    x: 0,
    y: 0,
    line: 1,
    layer: 'lines',
    highlight: 'circumference',
    labelSize: 5,
    materialLabel: 'EVA 6 mm',
  },
  decorators: [
    Story => (
      <svg viewBox="-10 -10 200 200" width={400} height={400}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof PieceShape>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
