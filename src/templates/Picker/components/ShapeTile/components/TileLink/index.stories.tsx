import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TileLink } from '.';

const meta = {
  component: TileLink,
  args: { href: '/cone', children: 'Cone' },
} satisfies Meta<typeof TileLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
