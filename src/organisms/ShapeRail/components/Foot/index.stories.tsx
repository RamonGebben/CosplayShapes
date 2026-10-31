import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Foot } from '.';

const meta = {
  component: Foot,
  args: { children: 'Free. Prints at 100%.' },
} satisfies Meta<typeof Foot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
