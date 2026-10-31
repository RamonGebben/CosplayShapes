import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FlatHeader } from '.';

const meta = {
  component: FlatHeader,
  args: { children: 'Flat pattern' },
} satisfies Meta<typeof FlatHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
