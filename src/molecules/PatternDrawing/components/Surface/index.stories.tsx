import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Surface } from '.';

const meta = {
  component: Surface,
  args: {},
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
