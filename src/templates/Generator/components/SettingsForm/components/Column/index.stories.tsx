import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Column } from '.';

const meta = {
  component: Column,
  args: { children: 'Settings' },
} satisfies Meta<typeof Column>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
