import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Viewport } from '.';

const meta = {
  component: Viewport,
  args: { children: 'Model' },
} satisfies Meta<typeof Viewport>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
