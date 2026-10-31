import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InlineLink } from '.';

const meta = {
  component: InlineLink,
  args: {
    href: '#',
    children: 'Templates',
  },
} satisfies Meta<typeof InlineLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
