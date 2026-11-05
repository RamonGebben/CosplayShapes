import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Main } from '.';

const meta = {
  component: Main,
  args: { $variant: 'primary', children: 'Download PDF' },
} satisfies Meta<typeof Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
