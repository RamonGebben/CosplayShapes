import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from '.';

const meta = {
  component: Text,
  args: { children: 'Seam allowance' },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
