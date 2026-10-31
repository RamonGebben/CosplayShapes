import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Rail } from '.';

const meta = {
  component: Rail,
  args: { children: 'Rail' },
} satisfies Meta<typeof Rail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
