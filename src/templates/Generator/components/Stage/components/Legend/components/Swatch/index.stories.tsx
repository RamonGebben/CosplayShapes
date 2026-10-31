import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Swatch } from '.';

const meta = {
  component: Swatch,
  args: { $kind: 'lit' },
} satisfies Meta<typeof Swatch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
