import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { SHAPES } from '~/utils/shapes';
import { buildExample } from '~/utils/examples';
import { Picker } from '.';

const meta = {
  component: Picker,
  args: {
    previews: SHAPES.map(shape => ({
      slug: shape.slug,
      layout: layoutPattern(buildExample(shape.slug).pieces, PAPERS.a4),
    })),
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Picker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
