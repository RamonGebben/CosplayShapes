import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Lead } from '.';

const meta = {
  component: Lead,
  args: {
    children: 'Looking for a starting point or more instructions?',
  },
} satisfies Meta<typeof Lead>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
