import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Summary } from '.';

const meta = {
  component: Summary,
  args: { children: 'Summary' },
} satisfies Meta<typeof Summary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
