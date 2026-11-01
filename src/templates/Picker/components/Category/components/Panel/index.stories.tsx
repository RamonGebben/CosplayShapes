import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Panel } from '.';

const meta = {
  component: Panel,
  args: { children: 'Panel' },
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
