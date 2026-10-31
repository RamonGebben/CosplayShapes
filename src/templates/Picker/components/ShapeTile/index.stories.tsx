import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { getShape } from '~/utils/shapes';
import { buildExample } from '~/utils/examples';
import { ShapeTile } from '.';

const meta = {
  component: ShapeTile,
  args: {
    shape: getShape('dome'),
    layout: layoutPattern(buildExample('dome').pieces, PAPERS.a4),
    model: buildExample('dome').model,
  },
} satisfies Meta<typeof ShapeTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
