import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Aside } from '.';

const meta = {
  component: Aside,
  args: { children: 'Example: bracer' },
} satisfies Meta<typeof Aside>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
