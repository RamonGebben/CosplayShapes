import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Frame } from '.';

const meta = {
  component: Frame,
  args: { children: 'Picker' },
} satisfies Meta<typeof Frame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
