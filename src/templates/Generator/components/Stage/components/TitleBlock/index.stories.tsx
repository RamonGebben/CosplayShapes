import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TitleBlock } from '.';

const meta = {
  component: TitleBlock,
  args: { children: 'Truncated cone', $longestWord: 9 },
} satisfies Meta<typeof TitleBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
