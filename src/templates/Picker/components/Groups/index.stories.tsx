import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Groups } from '.';

const meta = {
  component: Groups,
  args: { children: 'Groups' },
} satisfies Meta<typeof Groups>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
