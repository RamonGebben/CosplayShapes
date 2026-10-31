import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '.';

const meta = {
  component: Button,
  args: {
    href: '#',
    children: 'Deploy Now',
    $variant: 'primary',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    children: 'Documentation',
    $variant: 'secondary',
  },
};
