import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Message } from '.';

const meta = {
  component: Message,
  args: { $tone: 'error', children: 'Enter a length greater than 0.' },
} satisfies Meta<typeof Message>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
