import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Unit } from '.';

const meta = {
  component: Unit,
  args: { children: 'cm' },
} satisfies Meta<typeof Unit>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
