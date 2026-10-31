import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Svg } from '.';

const meta = {
  component: Svg,
  args: {},
} satisfies Meta<typeof Svg>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
