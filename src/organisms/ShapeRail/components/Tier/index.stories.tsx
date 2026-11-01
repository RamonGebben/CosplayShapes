import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tier } from '.';

const meta = {
  component: Tier,
  args: { children: 'Tier' },
} satisfies Meta<typeof Tier>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
