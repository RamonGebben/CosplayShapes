import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Lead } from '.';

const meta = {
  component: Lead,
  args: { children: 'Fill in circumference or diameter; the other follows.' },
} satisfies Meta<typeof Lead>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
