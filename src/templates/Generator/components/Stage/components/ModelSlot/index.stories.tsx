import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ModelSlot } from '.';

const meta = {
  component: ModelSlot,
  args: { children: 'Model' },
} satisfies Meta<typeof ModelSlot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
