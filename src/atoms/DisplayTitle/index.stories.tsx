import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DisplayTitle } from '.';

const meta = {
  component: DisplayTitle,
  args: { children: 'Truncated cone', $size: 'xl' },
} satisfies Meta<typeof DisplayTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pane: Story = { args: { children: 'Flat pattern', $size: 'l' } };
