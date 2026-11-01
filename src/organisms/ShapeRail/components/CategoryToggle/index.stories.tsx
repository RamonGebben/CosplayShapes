import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategoryToggle } from '.';

const meta = {
  component: CategoryToggle,
  args: { children: 'Tubes and cones', 'aria-expanded': true },
} satisfies Meta<typeof CategoryToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Closed: Story = { args: { 'aria-expanded': false } };
