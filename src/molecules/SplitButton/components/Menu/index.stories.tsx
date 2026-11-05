import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Menu } from '.';

const meta = {
  component: Menu,
  args: { children: 'Menu' },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
