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

export const FromSharedLink: Story = {
  args: {
    slug: 'cylinder',
    search: new URLSearchParams({
      v: '1',
      unit: 'in',
      circumference_d: '4',
      height: '6',
    }),
  },
};
