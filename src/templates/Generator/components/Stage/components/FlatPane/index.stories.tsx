import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FlatPane } from '.';

const meta = {
  component: FlatPane,
  args: { $alone: false, children: 'Pattern' },
} satisfies Meta<typeof FlatPane>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
