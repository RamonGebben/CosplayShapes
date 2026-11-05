import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tag } from '.';

const meta = {
  component: Tag,
  args: { children: '· true scale' },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
