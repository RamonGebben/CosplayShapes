import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Item } from '.';

const meta = {
  component: Item,
  args: { children: 'Cut line' },
} satisfies Meta<typeof Item>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
