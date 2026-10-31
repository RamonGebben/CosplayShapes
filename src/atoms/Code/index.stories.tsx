import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Code } from '.';

const meta = {
  component: Code,
  args: {
    children: 'page.tsx',
  },
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
