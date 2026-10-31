import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Facts } from '.';

const meta = {
  component: Facts,
  args: { children: <li>Free</li> },
} satisfies Meta<typeof Facts>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
