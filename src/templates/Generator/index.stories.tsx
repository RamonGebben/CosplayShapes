import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Generator } from '.';

const meta = {
  component: Generator,
  args: { slug: 'truncated-cone' },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Generator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sphere: Story = { args: { slug: 'sphere' } };
