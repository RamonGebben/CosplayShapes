import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Name } from '.';

const meta = {
  component: Name,
  args: { children: 'Dome' },
} satisfies Meta<typeof Name>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
