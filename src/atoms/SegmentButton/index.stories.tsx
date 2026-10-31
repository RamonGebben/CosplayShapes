import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SegmentButton } from '.';

const meta = {
  component: SegmentButton,
  args: { children: 'Metric (cm)', 'aria-pressed': true },
} satisfies Meta<typeof SegmentButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
