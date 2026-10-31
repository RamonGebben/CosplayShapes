import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Hint } from '.';

const meta = {
  component: Hint,
  args: { children: 'Off for foam: cut edges butt together.' },
} satisfies Meta<typeof Hint>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
