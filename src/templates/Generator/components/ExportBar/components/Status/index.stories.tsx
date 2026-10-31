import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Status } from '.';

const meta = {
  component: Status,
  args: { $tone: 'done', children: 'PDF saved.' },
} satisfies Meta<typeof Status>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
