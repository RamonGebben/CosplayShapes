import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Wrapper } from '.';

const meta = {
  component: Wrapper,
  args: { children: 'Category' },
} satisfies Meta<typeof Wrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
