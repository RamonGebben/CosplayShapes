import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Main } from '.';

const meta = {
  component: Main,
  args: {
    children: 'Main content',
  },
} satisfies Meta<typeof Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
