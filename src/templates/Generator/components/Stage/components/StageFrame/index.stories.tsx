import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StageFrame } from '.';

const meta = {
  component: StageFrame,
  args: { children: 'Stage' },
} satisfies Meta<typeof StageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
