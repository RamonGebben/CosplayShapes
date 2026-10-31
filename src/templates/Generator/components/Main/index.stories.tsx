import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Main } from '.';

const meta = {
  component: Main,
  args: { children: 'Stage' },
} satisfies Meta<typeof Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
