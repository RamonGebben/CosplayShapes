import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '.';

const meta = {
  component: Label,
  args: { children: 'Top circumference' },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
