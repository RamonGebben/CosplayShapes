import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Details } from '.';

const meta = {
  component: Details,
  args: { children: '1 piece on 2 A4 pages' },
} satisfies Meta<typeof Details>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
