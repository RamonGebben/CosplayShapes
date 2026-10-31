import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Bar } from '.';

const meta = {
  component: Bar,
  args: { children: 'Export' },
} satisfies Meta<typeof Bar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
