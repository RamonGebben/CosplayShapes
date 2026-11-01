import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GroupHeading } from '.';

const meta = {
  component: GroupHeading,
  args: { children: 'Basic shapes' },
} satisfies Meta<typeof GroupHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
