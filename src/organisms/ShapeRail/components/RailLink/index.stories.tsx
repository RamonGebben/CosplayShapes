import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RailLink } from '.';

const meta = {
  component: RailLink,
  args: { href: '/cone', children: 'Cone' },
} satisfies Meta<typeof RailLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
