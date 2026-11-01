import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Chevron } from '.';

const meta = {
  component: Chevron,
  args: { open: false },
} satisfies Meta<typeof Chevron>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = { args: { open: true } };
