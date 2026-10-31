import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack } from '.';

const meta = {
  component: Stack,
  args: {
    children: 'Stacked content',
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
