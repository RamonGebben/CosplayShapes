import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TierHeader } from '.';

const meta = {
  component: TierHeader,
  args: { children: 'Basic shapes' },
} satisfies Meta<typeof TierHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
