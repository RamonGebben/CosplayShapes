import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TierSummary } from '.';

const meta = {
  component: TierSummary,
  args: { children: 'Straight seams and simple curves. Start here.' },
} satisfies Meta<typeof TierSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
