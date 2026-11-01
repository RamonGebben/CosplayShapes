import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Trigger } from '.';

const meta = {
  component: Trigger,
  args: { children: 'How to measure' },
} satisfies Meta<typeof Trigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
